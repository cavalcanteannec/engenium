# Integração com N8N

Este documento explica como conectar o Agenda Pro ao N8N para que o N8N possa consultar informações de serviços e categorias.

## Pré-requisitos

1. Servidor Agenda Pro rodando (http://localhost:3000)
2. N8N instalado e rodando

## Endpoints da API

### Base URL
```
http://localhost:3000/api
```

### 1. Listar todas as categorias
```
GET /api/categories
```

**Resposta:**
```json
[
  {
    "id": "1",
    "name": "Cabelo",
    "description": "Serviços de cabelo"
  },
  {
    "id": "2",
    "name": "Unha",
    "description": "Manicure e pedicure"
  }
]
```

### 2. Listar todos os serviços
```
GET /api/services
```

**Parâmetros de query (opcionais):**
- `categoryId` - Filtrar por categoria (ex: `?categoryId=1`)
- `active` - Filtrar por status (ex: `?active=true`)
- `search` - Buscar por nome (ex: `?search=corte`)

**Resposta:**
```json
[
  {
    "id": "1",
    "name": "Corte + Escova",
    "categoryId": "1",
    "categoryName": "Cabelo",
    "price": 100,
    "duration": 60,
    "active": true
  },
  {
    "id": "2",
    "name": "Escova Simples",
    "categoryId": "1",
    "categoryName": "Cabelo",
    "price": 50,
    "duration": 30,
    "active": true
  }
]
```

### 3. Obter um serviço específico
```
GET /api/services/:id
```

**Exemplo:**
```
GET /api/services/1
```

**Resposta:**
```json
{
  "id": "1",
  "name": "Corte + Escova",
  "categoryId": "1",
  "categoryName": "Cabelo",
  "price": 100,
  "duration": 60,
  "active": true
}
```

### 4. Buscar serviços por nome
```
GET /api/services?search=corte
```

## Configuração no N8N

### Workflow 1: Consultar Preços de Serviços

1. **Trigger**: Configure um trigger (Webhook, Telegram, WhatsApp, etc.)

2. **HTTP Request Node**:
   - **Method**: GET
   - **URL**: `http://localhost:3000/api/services`
   - **Response Format**: JSON

3. **Code Node** (opcional - para processar a resposta):
   ```javascript
   const services = $input.all();
   let response = "📋 *Serviços Disponíveis:*\n\n";
   
   services.forEach(item => {
     const service = item.json;
     if (service.active) {
       response += `✂️ *${service.name}*\n`;
       response += `   💰 Preço: R$ ${service.price.toFixed(2)}\n`;
       response += `   ⏱️ Duração: ${service.duration} minutos\n`;
       response += `   📁 Categoria: ${service.categoryName}\n\n`;
     }
   });
   
   return { json: { message: response } };
   ```

4. **Send Message Node**: Envie a resposta para o cliente

### Workflow 2: Consultar Preço de um Serviço Específico

1. **Trigger**: Receba a mensagem do cliente

2. **IF Node**: Verifique se a mensagem contém nome de serviço

3. **HTTP Request Node**:
   - **Method**: GET
   - **URL**: `http://localhost:3000/api/services?search={{$json.message}}`
   - Substitua `{{$json.message}}` pela mensagem do cliente

4. **Code Node**: Formate a resposta
   ```javascript
   const services = $input.all();
   const service = services[0].json[0]; // Primeiro resultado
   
   if (service) {
     return {
       json: {
         message: `💰 *${service.name}*\n\n` +
                  `Preço: R$ ${service.price.toFixed(2)}\n` +
                  `Duração: ${service.duration} minutos\n` +
                  `Categoria: ${service.categoryName}`
       }
     };
   } else {
     return {
       json: {
         message: "❌ Serviço não encontrado. Por favor, verifique o nome."
       }
     };
   }
   ```

### Workflow 3: Listar Categorias

1. **HTTP Request Node**:
   - **Method**: GET
   - **URL**: `http://localhost:3000/api/categories`

2. **Code Node**:
   ```javascript
   const categories = $input.all();
   let response = "📁 *Categorias Disponíveis:*\n\n";
   
   categories.forEach(item => {
     const category = item.json;
     response += `• ${category.name}\n`;
     if (category.description) {
       response += `  _${category.description}_\n`;
     }
   });
   
   return { json: { message: response } };
   ```

## Exemplo Completo: Bot de WhatsApp/Telegram

### Fluxo:
1. Cliente pergunta: "Quais são os serviços disponíveis?"
2. N8N faz requisição para `/api/services`
3. N8N formata a resposta
4. N8N envia para o cliente

### Node Configuration:

**1. Webhook/Telegram Trigger**
- Recebe mensagem do cliente

**2. IF Node**
```
{{ $json.message }} contém "serviços" OU "preços" OU "valores"
```

**3. HTTP Request**
- URL: `http://localhost:3000/api/services?active=true`
- Method: GET

**4. Code Node**
```javascript
const items = $input.all();
const services = items[0].json;

if (!services || services.length === 0) {
  return {
    json: {
      message: "❌ Nenhum serviço disponível no momento."
    }
  };
}

let response = "📋 *Nossos Serviços:*\n\n";

services.forEach(service => {
  response += `✂️ *${service.name}*\n`;
  response += `   💰 R$ ${service.price.toFixed(2)}\n`;
  response += `   ⏱️ ${service.duration} min\n`;
  response += `   📁 ${service.categoryName}\n\n`;
});

return {
  json: {
    message: response
  }
};
```

**5. Send Message Node**
- Envia a resposta formatada

## Testando a API

### Usando cURL:
```bash
# Listar serviços
curl http://localhost:3000/api/services

# Buscar serviço específico
curl http://localhost:3000/api/services?search=corte

# Listar categorias
curl http://localhost:3000/api/categories
```

### Usando Postman ou Insomnia:
1. Crie uma nova requisição GET
2. URL: `http://localhost:3000/api/services`
3. Envie a requisição

## Troubleshooting

### Erro: "Cannot connect to server"
- Verifique se o servidor está rodando: `npm start`
- Verifique se a porta 3000 está disponível
- No N8N, use `http://localhost:3000` se estiver na mesma máquina, ou o IP da máquina se estiver em outra

### Erro: "CORS"
- O servidor já está configurado com CORS habilitado
- Se ainda houver problemas, verifique as configurações do N8N

### Dados não aparecem
- Verifique se o arquivo `data.json` existe
- Verifique os logs do servidor para erros

## Próximos Passos

1. Adicionar autenticação (API Key)
2. Adicionar rate limiting
3. Adicionar logs de requisições
4. Integrar com Google Calendar (próxima etapa)

