# 🤖 Guia Prático: Integrar Agenda Pro com N8N + WhatsApp

## 📋 O que você vai conseguir fazer:

1. ✅ Cliente pergunta os preços dos serviços no WhatsApp
2. ✅ N8N puxa automaticamente do seu sistema
3. ✅ Quando o cliente marca um agendamento pelo site, você recebe mensagem no WhatsApp

---

## 🚀 PARTE 1: Configuração Inicial do N8N

### Passo 1: Instalar e rodar N8N

```bash
# Instalar N8N (primeira vez)
npm install -g n8n

# Rodar N8N
n8n start

# Ou se já tiver instalado, pode abrir no navegador:
# http://localhost:5678
```

### Passo 2: Configurar WhatsApp Business

Você precisa:
1. Ter uma conta de **WhatsApp Business** (gratuita)
2. Gerar um **Access Token** para integrar com N8N
3. Ter seu **número de telefone** verificado

**Para conseguir o Access Token:**
- Acesse: https://developers.facebook.com/
- Crie um app do tipo "Negócio"
- Configure WhatsApp Business
- Gere o Access Token
- Salve em um lugar seguro!

---

## 📝 PARTE 2: Criar Workflow para CONSULTAR PREÇOS

### O que fazer:
Cliente escreve: "Quais são os serviços?" → N8N responde com a lista de preços

### Passo a passo:

#### 1️⃣ Criar novo Workflow no N8N

- Clique em **"New Workflow"**
- Dê um nome: "Consultar Serviços"

#### 2️⃣ Adicionar Trigger (Gatilho)

- Clique em **"+"** no meio da tela
- Procure por **"WhatsApp"** ou **"Webhook"**
- Se usar Webhook:
  - Copie a URL do webhook
  - Ela será algo como: `http://localhost:5678/webhook/...`

**OU se tiver WhatsApp Business integrado:**
- Selecione **WhatsApp Business** como trigger
- Escolha **"Message Received"**
- Configure com seu Access Token

#### 3️⃣ Adicionar um nó para FILTRAR mensagens

- Clique **"+"** depois do WhatsApp
- Procure por **"IF"** (nó condicional)
- Configure assim:

```
Campo: message (ou texto da mensagem)
Contém: "serviços" OU "preço" OU "valores" OU "quanto custa"
```

#### 4️⃣ Adicionar HTTP Request Node (IMPORTANTE!)

**Este é o nó que vai buscar os dados do seu servidor:**

- Clique **"+"** após o IF
- Procure por **"HTTP Request"**
- Configure assim:

```
Method:           GET
URL:              http://localhost:3000/api/services?active=true
Authentication:   None
Response Format:  JSON
```

**⚠️ IMPORTANTE:**
- Se o N8N estiver em OUTRA máquina/servidor, use o IP correto:
  - Ex: `http://192.168.1.100:3000/api/services`
  - Ou o domínio do seu servidor

#### 5️⃣ Adicionar Code Node para FORMATAR a resposta

- Clique **"+"** após o HTTP Request
- Procure por **"Code"** (JavaScript)
- Copie e cole este código:

```javascript
// Pega todos os serviços da resposta da API
const items = $input.all();
const services = items[0].json;

// Verifica se recebeu dados
if (!services || services.length === 0) {
  return {
    json: {
      message: "❌ Nenhum serviço disponível no momento."
    }
  };
}

// Monta a mensagem formatada
let response = "📋 *NOSSOS SERVIÇOS:*\n\n";

services.forEach((service, index) => {
  response += `${index + 1}️⃣ *${service.name}*\n`;
  response += `   💰 R$ ${service.price.toFixed(2)}\n`;
  response += `   ⏱️ ${service.duration} minutos\n`;
  response += `   📁 ${service.categoryName}\n\n`;
});

response += "📅 *Para agendar, acesse:* http://seusite.com/book.html";

return {
  json: {
    message: response
  }
};
```

#### 6️⃣ Adicionar Send Message Node

- Clique **"+"** após o Code
- Procure por **"WhatsApp Business"** ou **"Send Message"**
- Configure:
  - **To**: `{{ $json.senderPhone }}` (número de quem enviou)
  - **Message**: `{{ $json.message }}` (mensagem formatada)
  - **Access Token**: Cole o token que você gerou

---

## 🎯 PARTE 3: Criar Workflow para RECEBER NOTIFICAÇÃO DE AGENDAMENTO

### O que fazer:
Quando um cliente confirma agendamento no site → Você recebe mensagem no WhatsApp

### Passo a passo:

#### 1️⃣ Modificar o server.js

**Abra seu `server.js` e procure pela rota POST `/api/appointments`**

Você vai adicionar um webhook trigger do N8N. Mas primeiro, crie o workflow:

#### 2️⃣ Criar novo Workflow: "Notificação de Agendamento"

- New Workflow
- Nome: "Notificação de Agendamento"

#### 3️⃣ Adicionar Webhook como Trigger

- Clique em **"+"**
- Procure por **"Webhook"**
- Clique em **"Webhook"**
- Configure:
  - **Method**: POST
  - **Path**: `/agendamento-novo` (qualquer nome)
- **COPIE A URL COMPLETA** que aparecer

#### 4️⃣ Adicionar um nó para processar os dados

- Clique **"+"** após Webhook
- Procure por **"Code"** (JavaScript)
- Cole este código:

```javascript
// Pega os dados do agendamento que vieram do server
const body = $input.first().json;

// Monta a mensagem para você
const message = `
📱 *NOVO AGENDAMENTO!*

👤 *Cliente:* ${body.clientName}
📞 *Telefone:* ${body.clientPhone}
📧 *Email:* ${body.clientEmail || 'Não fornecido'}

💇 *Serviço:* ${body.serviceName}
💰 *Preço:* R$ ${body.servicePrice?.toFixed(2) || 'N/A'}
📅 *Data:* ${body.date}
🕐 *Hora:* ${body.time}
⏱️ *Duração:* ${body.serviceDuration} minutos

✅ Acesse seu painel para confirmar!
`;

return {
  json: {
    message: message.trim()
  }
};
```

#### 5️⃣ Adicionar Send Message Node

- Clique **"+"** após Code
- **WhatsApp Business** → Send Message
- Configure:
  - **To**: Seu número de WhatsApp (ex: 5585987654321)
  - **Message**: `{{ $json.message }}`
  - **Access Token**: Seu token

#### 6️⃣ Ativar e Copiar o Webhook

- Clique em **"Execute Workflow"** (▶️) 
- Em cima, você vai ver a URL do webhook
- **COPIE ESTA URL**

---

## 🔗 PARTE 4: Conectar o Site com o N8N

### Abra o arquivo `server.js`

Procure pela função que cria agendamentos. Adicione isto **DEPOIS** que o agendamento for criado:

```javascript
// Depois de savear o agendamento com sucesso, adicione:

// Enviar notificação para N8N
try {
  const webhookUrl = "COLE_AQUI_A_URL_DO_WEBHOOK_DO_N8N";
  
  const notificationData = {
    clientName: clientData.name,
    clientPhone: clientData.phone,
    clientEmail: clientData.email,
    serviceName: service.name,
    servicePrice: service.price,
    serviceDuration: service.duration,
    date: date,
    time: time
  };
  
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notificationData)
  }).catch(err => console.log('Webhook enviado'));
  
} catch (error) {
  console.log('Erro ao enviar webhook:', error);
}
```

---

## 🧪 TESTANDO TUDO

### Teste 1: Consultar Preços

1. Abra seu WhatsApp Business
2. Envie uma mensagem: "Quais são os serviços?"
3. Espere a resposta automática com lista de preços

**Se não funcionar:**
- ✅ Servidor (`npm start`) está rodando?
- ✅ N8N está rodando?
- ✅ O Access Token é válido?
- ✅ O número de telefone está correto?

### Teste 2: Receber Agendamento

1. Abra `http://localhost:3000/book.html`
2. Faça um agendamento de teste
3. Você deve receber a mensagem no WhatsApp

---

## 📊 URLs Importantes que você vai usar:

```
API do seu servidor:
- GET  http://localhost:3000/api/services
- GET  http://localhost:3000/api/categories
- POST http://localhost:3000/api/appointments

N8N:
- Interface: http://localhost:5678

Webhook N8N (você copia quando cria):
- POST http://localhost:5678/webhook/agendamento-novo
```

---

## 🆘 Troubleshooting

| Problema | Solução |
|----------|---------|
| "Cannot connect to server" | Verifique se `npm start` está rodando no seu projeto |
| "Webhook URL inválida" | Copie a URL completa que aparece no workflow do N8N |
| "N8N não recebe dados" | Use a URL correta do webhook no server.js |
| "WhatsApp não envia mensagem" | Verifique se o Access Token é válido e não expirou |
| "Dados da API não aparecem" | Teste manualmente: `curl http://localhost:3000/api/services` |

---

## 💡 DICAS EXTRAS

### 1. Testar a API manualmente
```bash
# Abra o terminal e digite:
curl http://localhost:3000/api/services

# Ou use Postman/Insomnia para fazer requisições visuais
```

### 2. Ver logs do N8N
- Abra http://localhost:5678
- Vá para o workflow
- Clique em **"Execution"** para ver histórico

### 3. Ver logs do seu servidor
- Abra o terminal onde você rodou `npm start`
- Você vai ver todas as requisições

### 4. Personalizar a mensagem
- Edite o código JavaScript no nó "Code"
- Use emojis, negrito (*texto*), etc.

---

## 🎓 Próximos passos (opcional)

1. **Adicionar validação**: Verificar se o cliente não marcou um horário já ocupado
2. **Enviar confirmação**: Cliente recebe confirmação no WhatsApp
3. **Lembretes**: N8N envia lembretes 1 dia antes
4. **Avaliações**: Pedir nota ao cliente após o agendamento

---

## 📞 Resumo do fluxo final:

```
Cliente escreve no WhatsApp
        ↓
N8N recebe (Webhook)
        ↓
N8N checa: é pergunta sobre serviços?
        ↓
SIM → N8N faz requisição para seu API
        ↓
API retorna lista de serviços
        ↓
N8N formata uma mensagem bonita
        ↓
N8N envia a mensagem no WhatsApp do cliente
        ↓
Cliente clica no link para agendar
        ↓
Cliente agendar no site
        ↓
Site faz POST para o webhook do N8N
        ↓
N8N recebe os dados do agendamento
        ↓
N8N envia mensagem para VOCÊ no WhatsApp
        ↓
🎉 Pronto!
```

---

**Dúvidas? Me chama! 🚀**
