# 🚀 Integração do Agenda Pro com seu Fluxo WAHA/N8N

Você já tem um setup legal com WAHA + AI Agent! Vou te mostrar como adicionar a integração do seu sistema de agendamentos.

---

## 📊 Seu Fluxo Atual vs. Novo

```
SEU FLUXO ATUAL:
Webhook → Dados → Switch → AI Agent → WAHA (resposta)

NOVO FLUXO COM AGENDAMENTOS:
┌─────────────────────────────────────────────────────────┐
│ Webhook WAHA recebe mensagem do cliente                 │
└────────────────┬────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────┐
│ Switch/Rules detecta:                                    │
│ • "serviços" / "preço" / "tabela" → Fluxo 1            │
│ • "agendar" / "horário" → Direciona para site          │
│ • Outras → AI Agent continua                            │
└────────────────┬────────────────────────────────────────┘
                 ↓
        ┌────────┴─────────┐
        ↓                  ↓
   FLUXO 1:          FLUXO NORMAL:
   Busca API      AI Agent (Google
   + Formata      Gemini) responde
   Serviços           ↓
        │          WAHA envia
        └─────┬────────┘
             ↓
        Resposta ao cliente
```

---

## 🔧 PASSO A PASSO: Adicionar Busca de Serviços

### Parte 1: Modificar seu Node "Switch"

Seu Switch atual tem estas regras:
```
mode: Rules
condition 1: ...
condition 2: ...
```

**Adicione uma nova condição:**

```
Nome: CONSULTAR_SERVICOS
Condição: 
  message (or text) contains any of:
  • "serviços"
  • "preço"
  • "preços"
  • "valores"
  • "tabela"
  • "quanto custa"
  • "qual é o valor"
  • "você faz o quê"
```

**Output route**: "CONSULTAR_SERVICOS"

---

### Parte 2: Criar a Branch "CONSULTAR_SERVICOS"

**Após o Switch, quando o output é "CONSULTAR_SERVICOS":**

#### Step 1: HTTP Request Node

Clique no output "CONSULTAR_SERVICOS" do Switch e adicione um **HTTP Request** node

**Configuração:**
```
Method:              GET
URL:                 http://localhost:3000/api/services?active=true
Authentication:      None
Response Format:     JSON
Send Query String:   OFF
Specify Data Mode:   Using Fields Below
```

#### Step 2: Code Node (Formatar Resposta)

Adicione um **Code node** após o HTTP Request

**Código JavaScript:**

```javascript
// Pega a resposta do API
const response = $input.first().json;

// Verifica se recebeu dados
if (!response || response.length === 0) {
  return {
    json: {
      message: "❌ Nenhum serviço disponível no momento. Tente novamente mais tarde!"
    }
  };
}

// Monta a mensagem formatada
let serviceList = "📋 *NOSSOS SERVIÇOS:*\n";
serviceList += "─────────────────\n\n";

response.forEach((service, index) => {
  serviceList += `*${index + 1}. ${service.name}*\n`;
  serviceList += `💰 R$ ${service.price.toFixed(2)}\n`;
  serviceList += `⏱️ Duração: ${service.duration} min\n`;
  serviceList += `📁 ${service.categoryName}\n\n`;
});

serviceList += "─────────────────\n";
serviceList += "📅 *Para agendar, clique aqui:*\n";
serviceList += "_http://seusite.com/book.html_\n\n";
serviceList += "Precisa de mais informações? Só me chamar! 😊";

return {
  json: {
    message: serviceList,
    text: serviceList
  }
};
```

#### Step 3: Enviar Mensagem

Adicione o nó de **"Send a text message"** (WAHA)

**Configuração:**
```
Chat ID:     {{ $json.chatId }}  (ou o campo correto do seu webhook)
Text:        {{ $json.message }}
```

---

## 📨 Parte 2: Criar Workflow de NOTIFICAÇÃO de Agendamento

### Novo Workflow: "Agenda Pro - Notificação"

#### Step 1: Webhook Trigger

- Clique em **"+"** 
- Procure por **"Webhook"**
- Configure:
  ```
  Method:  POST
  Path:    /agenda-novo-agendamento
  ```
- **COPIE A URL COMPLETA** que aparecer no campo azul

Ela será algo como:
```
http://seu-n8n.com/webhook/agenda-novo-agendamento
```

#### Step 2: Code Node - Formatar Dados

Adicione um **Code node**

```javascript
// Recebe os dados do agendamento do seu servidor
const agendamento = $input.first().json;

// Monta mensagem para você receber
const mensagem = `
🎉 *NOVO AGENDAMENTO!*

👤 *Cliente:* ${agendamento.clientName}
📞 *Telefone:* ${agendamento.clientPhone}
📧 *Email:* ${agendamento.clientEmail || '(não fornecido)'}

💇 *Serviço:* ${agendamento.serviceName}
💰 *Valor:* R$ ${(agendamento.servicePrice || 0).toFixed(2)}
📅 *Data:* ${new Date(agendamento.date).toLocaleDateString('pt-BR')}
🕐 *Hora:* ${agendamento.time}
⏱️ *Duração:* ${agendamento.serviceDuration} min

✅ Acesse seu painel para gerenciar!
`;

return {
  json: {
    message: mensagem.trim(),
    text: mensagem.trim()
  }
};
```

#### Step 3: Send Message - WAHA

Adicione o nó **"Send a text message"**

**Configuração:**
```
Chat ID:     SEU_NUMERO_COM_CODIGO_PAIS
             Exemplo: 5585987654321
             
Text:        {{ $json.message }}
```

---

## 🔌 Parte 3: Conectar seu Server ao Webhook

### Abra `server.js`

Procure pela rota **POST `/api/appointments`** onde o agendamento é criado.

**Após salvar o agendamento com sucesso**, adicione este código:

```javascript
// ============================================
// INTEGRAÇÃO COM N8N - NOTIFICAÇÃO WEBHOOK
// ============================================

// Se o agendamento foi criado com sucesso, notificar N8N
if (newAppointment) {
  try {
    // ⚠️ MUDE ISSO PARA SUA URL DO WEBHOOK
    const N8N_WEBHOOK_URL = "http://seu-n8n.com/webhook/agenda-novo-agendamento";
    
    // Preparar dados do agendamento
    const notificationData = {
      clientName: clientData.name,
      clientPhone: clientData.phone,
      clientEmail: clientData.email,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.duration,
      date: selectedDate,
      time: selectedTime,
      timestamp: new Date().toISOString()
    };
    
    // Enviar para N8N
    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData)
    })
    .then(res => console.log('✅ Notificação enviada para N8N'))
    .catch(err => console.log('⚠️ Erro ao enviar notificação:', err.message));
    
  } catch (error) {
    console.log('⚠️ Erro na integração N8N:', error.message);
  }
}
```

---

## 🧪 TESTANDO TUDO

### Teste 1: Consultar Serviços

1. Abra WhatsApp Business
2. Envie uma mensagem com: "serviços"
3. Espere a resposta com a tabela de preços

**Se não funcionar:**
- ✅ Seu servidor está rodando? (`npm start`)
- ✅ N8N está rodando?
- ✅ O node HTTP Request tem a URL correta?
- ✅ O node WAHA tem o Chat ID correto?

### Teste 2: Agendamento → Notificação

1. Acesse: `http://localhost:3000/book.html`
2. Faça um agendamento completo
3. Você deve receber a mensagem no WhatsApp

**Se não funcionar:**
- ✅ O webhook URL está correto em `server.js`?
- ✅ Você salvou e reiniciou o servidor (`npm start`)?
- ✅ O webhook N8N está "Ativo" (ativado)?

---

## 📋 Checklist de Configuração

```
WEBHOOKS N8N:
☐ Copiei a URL do webhook de "Consultar Serviços"
☐ Copiei a URL do webhook de "Notificação"
☐ As URLs estão EXATAS no código (sem espaços extras)

SERVER.JS:
☐ Adicionei o código de integração após criar agendamento
☐ Adicionei a URL do webhook correto
☐ Reiniciei o servidor (npm start)

N8N WORKFLOWS:
☐ Switch detecta palavras-chave para serviços
☐ HTTP Request Node puxa dados da API
☐ Code Node formata com emojis e informações
☐ WAHA envia a mensagem

WAHA:
☐ Meu número está correto (com código do país)
☐ Connection está ativa
☐ Estou recebendo mensagens normalmente
```

---

## 🎨 Personalizações (OPCIONAL)

### Customizar emojis
No Code node, mude os emojis conforme quiser:
- 💇 para cabelo
- 💅 para unhas
- 🧔 para barba
- etc.

### Adicionar link direto
Se quiser que ao clicar em um serviço vá direto para agendar:
```
Coloque no final da mensagem:
📅 Agendar: https://seusite.com/book.html?service=1
```

### Responder com IA
Se a pergunta não encaixar em nenhuma regra, deixar o AI Agent do Google Gemini responder normalmente.

---

## 🆘 Troubleshooting

| Problema | O que checar |
|----------|-------------|
| "Serviços não aparecem" | URL do API está http://localhost:3000? |
| "Webhook não recebe dados" | URL do webhook está EXATA no server.js? |
| "Mensagem não envia" | Chat ID (seu número) está correto? |
| "N8N não ativa webhook" | Você clicou em Execute/Activate? |
| "Erro CORS" | Seu servidor tem CORS habilitado? |

---

## 📞 Resumo dos URLs que você precisa

```
SEU API:
GET http://localhost:3000/api/services

WEBHOOKS N8N (você gera):
POST http://seu-n8n/webhook/consultar-servicos
POST http://seu-n8n/webhook/agenda-novo-agendamento

SITE:
http://localhost:3000/book.html (ou seu domínio)

WAHA:
Seu número: 5585987654321 (exemplo)
```

---

## 🎯 Próximas Ideias (futuramente)

1. ✅ Cliente marca agendamento → Você recebe notificação
2. ⏳ Você confirma no N8N → Cliente recebe confirmação
3. ⏳ Lembretes automáticos 1 dia antes
4. ⏳ Enviar comprovante/link de pagamento
5. ⏳ Avaliação automática após agendamento

---

**Qualquer dúvida, me chama!** 🚀
