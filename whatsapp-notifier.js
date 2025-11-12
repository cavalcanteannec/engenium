/**
 * WhatsApp Notifier via N8N
 * 
 * Sistema que monitora novos agendamentos e envia para o N8N,
 * que por sua vez envia via WAHA para o WhatsApp
 * 
 * ARQUITETURA:
 * - Backend (porta 3002) -> salva agendamento
 * - Este script -> detecta novo agendamento -> envia para N8N
 * - N8N (porta 5678) -> processa -> envia para WAHA
 * - WAHA (porta 3000) -> envia WhatsApp
 * 
 * INSTALAÇÃO:
 * 1. Salve este arquivo como: whatsapp-notifier.js
 * 2. Execute: node whatsapp-notifier.js
 * 3. Deixe rodando em paralelo com seu backend
 */

const fs = require('fs');
const path = require('path');

// ==================== CONFIGURAÇÕES ====================
const CONFIG = {
  // Arquivo de dados do seu sistema (porta 3002)
  dataFile: path.join(__dirname, 'data.json'),
  
  // URL do Webhook N8N
  n8nWebhookUrl: 'http://host.docker.internal:5678/webhook/agendamento',
  
  // Intervalo de verificação (em milissegundos)
  checkInterval: 3000, // Verificar a cada 3 segundos
  
  // Arquivo para rastrear agendamentos já notificados
  trackerFile: path.join(__dirname, '.notified-appointments.json'),
  
  // Habilitar logs detalhados
  verbose: true
};

// ==================== FUNÇÕES DE RASTREAMENTO ====================

function loadNotifiedAppointments() {
  try {
    if (fs.existsSync(CONFIG.trackerFile)) {
      const data = fs.readFileSync(CONFIG.trackerFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('❌ Erro ao carregar rastreamento:', error.message);
  }
  return { notified: [], lastCheck: null };
}

function saveNotifiedAppointments(tracker) {
  try {
    fs.writeFileSync(CONFIG.trackerFile, JSON.stringify(tracker, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar rastreamento:', error.message);
    return false;
  }
}

function markAsNotified(appointmentId) {
  const tracker = loadNotifiedAppointments();
  if (!tracker.notified.includes(appointmentId)) {
    tracker.notified.push(appointmentId);
    tracker.lastCheck = new Date().toISOString();
    saveNotifiedAppointments(tracker);
  }
}

function isAlreadyNotified(appointmentId) {
  const tracker = loadNotifiedAppointments();
  return tracker.notified.includes(appointmentId);
}

// ==================== FUNÇÃO PARA LER DADOS ====================

function readDataFile() {
  try {
    if (fs.existsSync(CONFIG.dataFile)) {
      const data = fs.readFileSync(CONFIG.dataFile, 'utf8');
      return JSON.parse(data);
    } else {
      if (CONFIG.verbose) {
        console.log('⚠️  Arquivo data.json não encontrado. Aguardando criação...');
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao ler data.json:', error.message);
    return null;
  }
}

// ==================== ENVIO PARA N8N ====================

async function sendToN8N(appointment, employee) {
  try {
    const payload = {
      agendamento_id: appointment.id,
      cliente_nome: appointment.clientName,
      cliente_telefone: appointment.clientPhone,
      cliente_email: appointment.clientEmail || '',
      servico: appointment.serviceName,
      data: appointment.date,
      hora: appointment.time,
      duracao: appointment.duration,
      status: appointment.status,
      prestador_nome: employee ? employee.name : 'Não especificado',
      prestador_whatsapp: employee ? employee.phone : '558589725487',
      observacoes: appointment.notes || '',
      criado_em: appointment.createdAt
    };

    if (CONFIG.verbose) {
      console.log('📤 Enviando para N8N:', JSON.stringify(payload, null, 2));
    }

    const response = await fetch(CONFIG.n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`N8N retornou status ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Notificação enviada com sucesso para N8N!');
    if (CONFIG.verbose) {
      console.log('   Resposta:', result);
    }
    
    return { success: true, result };

  } catch (error) {
    console.error('❌ Erro ao enviar para N8N:', error.message);
    return { success: false, error: error.message };
  }
}

// ==================== FORMATAÇÃO DE MENSAGEM ====================

function formatAppointmentMessage(appointment, employee) {
  const dateFormatted = new Date(appointment.date + 'T00:00:00').toLocaleDateString('pt-BR');
  
  return `🔔 *NOVO AGENDAMENTO*

👤 *Cliente:* ${appointment.clientName}
📱 *Telefone:* ${appointment.clientPhone}
${appointment.clientEmail ? `📧 *Email:* ${appointment.clientEmail}\n` : ''}
✂️ *Serviço:* ${appointment.serviceName}
📅 *Data:* ${dateFormatted}
🕐 *Horário:* ${appointment.time}
⏱️ *Duração:* ${appointment.duration} minutos
${employee ? `👨‍💼 *Profissional:* ${employee.name}\n` : ''}
${appointment.notes ? `📝 *Observações:* ${appointment.notes}\n` : ''}
✅ *Status:* Confirmado

_Agendamento ID: ${appointment.id}_`;
}

// ==================== MONITORAMENTO ====================

async function checkNewAppointments() {
  const data = readDataFile();
  
  if (!data || !data.appointments) {
    return;
  }

  // Filtrar apenas agendamentos confirmados
  const confirmedAppointments = data.appointments.filter(apt => 
    apt.status === 'confirmed'
  );

  // Verificar novos agendamentos
  for (const appointment of confirmedAppointments) {
    if (!isAlreadyNotified(appointment.id)) {
      console.log(`\n🆕 Novo agendamento detectado: ${appointment.clientName} - ${appointment.serviceName}`);
      
      // Buscar informações do funcionário
      let employee = null;
      if (appointment.employeeId && data.employees) {
        employee = data.employees.find(e => e.id === appointment.employeeId);
      }

      // Enviar para N8N
      const result = await sendToN8N(appointment, employee);
      
      if (result.success) {
        // Marcar como notificado
        markAsNotified(appointment.id);
        console.log(`✅ Agendamento #${appointment.id} processado com sucesso!\n`);
      } else {
        console.log(`⚠️  Falha ao processar agendamento #${appointment.id}. Tentará novamente...\n`);
      }
    }
  }
}

// ==================== INICIALIZAÇÃO ====================

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║        📱 WhatsApp Notifier - Sistema Ativo               ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('');
console.log('🔧 Configuração:');
console.log(`   📂 Data File: ${CONFIG.dataFile}`);
console.log(`   🔗 N8N Webhook: ${CONFIG.n8nWebhookUrl}`);
console.log(`   ⏱️  Intervalo: ${CONFIG.checkInterval}ms`);
console.log('');
console.log('🚀 Sistema iniciado! Monitorando novos agendamentos...');
console.log('   (Pressione Ctrl+C para parar)');
console.log('');

// Verificar se o arquivo data.json existe
if (!fs.existsSync(CONFIG.dataFile)) {
  console.log('⚠️  ATENÇÃO: Arquivo data.json não encontrado!');
  console.log('   Certifique-se de que o backend está rodando e criou o arquivo.');
  console.log('');
}

// Iniciar monitoramento
let isChecking = false;

setInterval(async () => {
  if (!isChecking) {
    isChecking = true;
    try {
      await checkNewAppointments();
    } catch (error) {
      console.error('❌ Erro no monitoramento:', error.message);
    } finally {
      isChecking = false;
    }
  }
}, CONFIG.checkInterval);

// Verificação inicial imediata
setTimeout(async () => {
  console.log('🔍 Executando primeira verificação...\n');
  await checkNewAppointments();
}, 1000);

// Handler para encerramento gracioso
process.on('SIGINT', () => {
  console.log('\n\n👋 Encerrando WhatsApp Notifier...');
  console.log('✅ Sistema encerrado com sucesso!');
  process.exit(0);
});