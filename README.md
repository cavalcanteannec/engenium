# Agenda Pro - Sistema de Agendamentos

Sistema de agendamentos inteligente com integração N8N e Google Calendar.

## 🚀 Como começar

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor

```bash
npm start
```

O servidor estará rodando em: **http://localhost:3000**

### 3. Acessar a aplicação

Abra o navegador e acesse: **http://localhost:3000**

## 📡 API REST

A API está disponível em `http://localhost:3000/api`

### Endpoints principais:

- `GET /api/categories` - Listar categorias
- `GET /api/services` - Listar serviços
- `GET /api/services?search=corte` - Buscar serviços
- `GET /api/employees` - Listar funcionários
- `GET /api/health` - Status da API

Veja o arquivo `N8N_INTEGRATION.md` para detalhes completos da API e integração com N8N.

## 🔧 Estrutura do projeto

```
engeniumcodes/
├── index.html          # Frontend React
├── server.js           # Backend Express
├── package.json        # Dependências
├── data.json          # Dados (criado automaticamente)
├── N8N_INTEGRATION.md # Documentação da integração N8N
└── README.md          # Este arquivo
```

## 📦 Tecnologias

- **Frontend**: React 18, Tailwind CSS
- **Backend**: Node.js, Express
- **API**: REST API
- **Integração**: N8N, Google Calendar (em desenvolvimento)

## 🔌 Integração com N8N

O sistema expõe uma API REST que pode ser consumida pelo N8N para:
- Consultar preços de serviços
- Listar categorias disponíveis
- Buscar informações de serviços

**Documentação completa**: Veja `N8N_INTEGRATION.md`

## 📝 Exemplo de uso da API

```bash
# Listar todos os serviços
curl http://localhost:3000/api/services

# Buscar serviço específico
curl http://localhost:3000/api/services?search=corte

# Listar categorias
curl http://localhost:3000/api/categories
```

## 🛠️ Desenvolvimento

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

(Requer `nodemon` instalado: `npm install -g nodemon`)

## 📄 Licença

ISC
