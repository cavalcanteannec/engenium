# 🎯 Workflow N8N COMPLETO: Agenda Pro + WAHA

**Vou criar 2 workflows do ZERO para você**

---

## 📱 WORKFLOW 1: "Consultar Serviços via WAHA"

### O que faz:
Cliente envia: "Quais são os serviços?" → Você recebe a tabela de preços

### 🚀 Passo a Passo:

#### PASSO 1: Criar novo Workflow

1. Vá para **N8N** (http://localhost:5678)
2. Clique em **"New"** (ou **"+"**)
3. Clique em **"New Workflow"**
4. Nome: **"Agenda Pro - Consultar Serviços"**

---

#### PASSO 2: Adicionar Webhook WAHA como Trigger

1. Clique em **"+"** no meio da tela (ou procure por um node)
2. Procure por: **"WAHA"** ou **"Webhook"**
3. Se encontrou **WAHA** direto:
   - Clique em **WAHA**
   - Em "Operation" escolha: **"Receive Message"**
   - Conecte ao seu WAHA existente

   **OU se usar Webhook genérico:**
   - Clique em **"Webhook"**
   - **Method**: POST
   - **Path**: `/waha-servicos`

**Resultado esperado:** Um nó azul com "WAHA" ou "Webhook" no início

---

#### PASSO 3: Adicionar nó para Extrair Dados

1. Clique em **"+"** após o WAHA
2. Procure por: **"Item Lists"** ou **"Move Binary Data"**
3. Ou vá em **"+"** → procure **"Extract"** → escolha **"Extract from JSON"**

Na verdade, vamos pular isso e ir direto ao Code para processar.

---

#### PASSO 4: Adicionar IF Node (Filtro)

1. Clique **"+"** após o WAHA
2. Procure por: **"IF"**
3. Configure a condição:

```
Condition: message
Operator: contains
Value: serviço
```

**Clique em "+"** para adicionar mais opções:
```
OR message contains: preço
OR message contains: valores
OR message contains: tabela
OR message contains: quanto custa
```

4. Deixe ativa apenas a saída que vai para "true"

---

#### PASSO 5: Adicionar HTTP Request (puxa dados da API)

1. Após o IF, clique em **"+"** na linha que diz **"true"**
2. Procure por: **"HTTP Request"**
3. Configure:

```
Method:          GET
URL:             http://localhost:3000/api/services?active=true
Authentication:  None
Response Format: JSON
```

**Se o N8N está em outra máquina:**
```
URL: http://192.168.X.X:3000/api/services?active=true
(substitua 192.168.X.X pelo IP da sua máquina)
```

---

#### PASSO 6: Adicionar Code Node (formata a resposta)

1. Após o HTTP Request, clique em **"+"**
2. Procure por: **"Code"** (com símbolo `{}`)
3. Clique em **"Code"** (modo JavaScript)
4. **Apague tudo** que está lá
5. **Cole este código:**

```javascript
// Recebe dados da API
const items = $input.all();
const services = items[0].json;

// Verifica se tem serviços
if (!services || services.length === 0) {
  return {
    json: {
      message: "❌ Nenhum serviço disponível no momento!",
      text: "❌ Nenhum serviço disponível no momento!"
    }
  };
}

// Monta a mensagem com os serviços
let response = "📋 *NOSSOS SERVIÇOS:*\n\n";

services.forEach((service, index) => {
  response += `*${index + 1}. ${service.name}*\n`;
  response += `💰 R$ ${service.price.toFixed(2)}\n`;
  response += `⏱️ ${service.duration} minutos\n`;
  response += `\n`;
});

response += "─────────────────\n";
response += "📅 *Para agendar:*\n";
response += "http://localhost:3000/book.html\n\n";
response += "Tem dúvida? Me chama! 😊";

return {
  json: {
    message: response,
    text: response
  }
};
```

6. Clique em **"Execute Node"** (▶️) para testar

---

#### PASSO 7: Adicionar Send Message (WAHA)

1. Após o Code, clique em **"+"**
2. Procure por: **"WAHA"**
3. Em "Operation" escolha: **"Send Message"**
4. Configure:

```
Instance ID:    (seu WAHA ID - mesmo que usa no webhook)
Chat ID:        {{ $json.body.chatId }}  (ou {{ $json.from }} )
Message:        {{ $json.message }}
```

**Nota:** O campo exato depende de como seu WAHA envia os dados. Se não funcionar, teste com:
```
Chat ID: {{ $json.senderPhone }}
     ou
Chat ID: {{ $json.sender }}
     ou
Chat ID: {{ $json.phoneNumber }}
```

---

#### PASSO 8: Testar o Workflow

1. Clique em **"Execute Workflow"** (play verde) ou **"Test Workflow"**
2. No seu WhatsApp, envie a mensagem: "serviços"
3. Espere receber a resposta

**Se não funcionar:**
- ✅ Seu servidor Node.js está rodando? (`npm start`)
- ✅ A URL do API está correta?
- ✅ O WAHA está conectado e recebendo mensagens?

---

#### PASSO 9: Ativar o Workflow

1. Clique em **"Activate"** (ou o botão de play/ativar)
2. Agora está VIVO! 🎉

---

---

## 💬 WORKFLOW 2: "Notificação de Agendamento"

### O que faz:
Cliente marca agendamento no site → Você recebe mensagem no WhatsApp

### 🚀 Passo a Passo:

#### PASSO 1: Criar novo Workflow

1. Clique em **"New Workflow"**
2. Nome: **"Agenda Pro - Novo Agendamento"**

---

#### PASSO 2: Adicionar Webhook Trigger

1. Clique em **"+"**
2. Procure por: **"Webhook"**
3. Configure:

```
Method:  POST
Path:    /agenda-novo
```

4. **COPIE A URL COMPLETA** que aparece no campo azul acima
   - Será algo como: `http://seu-n8n-url/webhook/agenda-novo`

---

#### PASSO 3: Adicionar Code Node (formata dados)

1. Após o Webhook, clique em **"+"**
2. Procure por: **"Code"**
3. **Apague tudo** e cole:

```javascript
// Recebe dados do agendamento
const data = $input.first().json;

// Formata a mensagem
const mensagem = `🎉 *NOVO AGENDAMENTO!*

👤 *Cliente:* ${data.clientName}
📞 *Telefone:* ${data.clientPhone}
📧 *Email:* ${data.clientEmail || '(não informado)'}

💇 *Serviço:* ${data.serviceName}
💰 *Valor:* R$ ${(data.servicePrice || 0).toFixed(2)}
📅 *Data:* ${data.date}
🕐 *Hora:* ${data.time}
⏱️ *Duração:* ${data.serviceDuration} min

✅ Acesse seu painel para confirmar!`;

return {
  json: {
    message: mensagem,
    text: mensagem
  }
};
```

---

#### PASSO 4: Adicionar Send Message (WAHA)

1. Após o Code, clique em **"+"**
2. Procure por: **"WAHA"**
3. Em "Operation": **"Send Message"**
4. Configure:

```
Instance ID:    (seu WAHA ID)
Chat ID:        SEU_NUMERO_WHATSAPP
                Exemplo: 5585987654321
Message:        {{ $json.message }}
```

---

#### PASSO 5: Copiar a URL do Webhook

Você vai precisar dessa URL para adicionar no `server.js`

A URL ficará assim:
```
http://localhost:5678/webhook/agenda-novo
(ou similar, dependendo da sua configuração do N8N)
```

---

#### PASSO 6: Ativar o Workflow

1. Clique em **"Activate"**
2. Agora está pronto para receber agendamentos! ✅

---

---

## 🔌 INTEGRAR COM O SERVER.JS

### Abra seu `server.js`

Procure pela função que cria agendamentos. Geralmente está perto de:

```javascript
app.post('/api/appointments', (req, res) => {
  // ... código para criar agendamento ...
  // Depois de SALVAR com sucesso, adicione:
```

**Adicione isto DEPOIS de salvar o agendamento:**

```javascript
// ========================================
// ENVIAR NOTIFICAÇÃO PARA N8N
// ========================================

try {
  // ⚠️ COLE AQUI A URL DO WEBHOOK QUE VOCÊ COPIOU DO N8N
  const WEBHOOK_URL = "http://localhost:5678/webhook/agenda-novo";
  
  // Preparar os dados
  const agendamentoData = {
    clientName: clientData.name,
    clientPhone: clientData.phone,
    clientEmail: clientData.email,
    serviceName: selectedService.name,
    servicePrice: selectedService.price,
    serviceDuration: selectedService.duration,
    date: selectedDate,
    time: selectedTime
  };
  
  // Enviar para N8N
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agendamentoData)
  })
  .then(res => console.log('✅ Notificação enviada para N8N'))
  .catch(err => console.log('Erro ao notificar N8N:', err.message));

} catch (error) {
  console.log('Erro na integração:', error.message);
}
```

---

---

## 🧪 TESTES FINAIS

### Teste 1: Consultar Serviços

1. No seu WhatsApp, envie: **"serviços"**
2. Você deve receber a lista de preços em segundos

✅ **Se funcionou:** Parabéns! 🎉

❌ **Se não funcionou:**
- Verifique se N8N está rodando
- Verifique se seu servidor Node está rodando
- Abra F12 no navegador e veja se há erros

### Teste 2: Agendar e Receber Notificação

1. Abra: `http://localhost:3000/book.html`
2. Faça um agendamento completo
3. Você deve receber mensagem no WhatsApp em segundos

✅ **Se funcionou:** PERFEITO! 🚀

❌ **Se não funcionou:**
- Verifique se a URL do webhook está correta em `server.js`
- Reinicie o servidor Node (`npm start`)
- Verifique se o workflow do N8N está "Ativo"

---

---

## 📋 CHECKLIST FINAL

```
WORKFLOW 1 - CONSULTAR SERVIÇOS:
☐ Webhook WAHA configurado
☐ IF node filtra palavras-chave
☐ HTTP Request para http://localhost:3000/api/services
☐ Code node formata a mensagem
☐ WAHA envia a resposta
☐ Workflow está ATIVO

WORKFLOW 2 - NOTIFICAÇÃO:
☐ Webhook criado e URL copiada
☐ Code node formata a mensagem
☐ WAHA configurado com seu número
☐ Workflow está ATIVO
☐ server.js tem a URL do webhook correto
☐ Servidor Node foi reiniciado

INTEGRAÇÕES:
☐ N8N rodando
☐ Servidor Node rodando (npm start)
☐ WAHA conectado e funcionando
☐ Firewall não está bloqueando
```

---

---

## 🎯 DICAS EXTRAS

### Se o campo Chat ID não funcionar

No segundo workflow, se não receber a mensagem, tente colocar o Chat ID diretamente:

```
Chat ID: 5585987654321 (seu número com código do país)
```

### Se houver erro de CORS

Seu servidor já tem CORS habilitado, mas se houver erro:

```javascript
// No topo do server.js, certifique-se de ter:
app.use(cors());
```

### Para ver os dados que chegam no webhook

Adicione um **Code node** após o webhook WAHA no workflow 1:

```javascript
console.log('Dados recebidos:', JSON.stringify($input.first().json, null, 2));
return $input.first();
```

Depois veja os logs do N8N para debugar.

---

---

## 📞 RESUMO RÁPIDO

```
2 Workflows necessários:
1. Webhook WAHA → IF → HTTP GET /api/services → Code → Send Message WAHA
2. Webhook → Code → Send Message WAHA (para você)

1 Modificação no server.js:
- Adicionar fetch() para webhook do N8N após criar agendamento

URLs que você precisa:
- API: http://localhost:3000/api/services
- Webhook N8N 1: http://localhost:5678/webhook/agenda-novo (copiar do N8N)
- Site: http://localhost:3000/book.html
```

---

**Alguma dúvida? Me avisa no caminho! 🚀**
