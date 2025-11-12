# Guia de Agendamento - Página do Cliente

## 📋 Como funciona

O sistema agora possui uma página pública de agendamento que os clientes podem acessar para marcar seus serviços.

## 🔗 Acesso

A página de agendamento está disponível em:
```
http://localhost:3000/book.html
```

## 🎯 Fluxo do Cliente

1. **Cliente recebe o link** → `http://localhost:3000/book.html`
2. **Seleciona o serviço** → Vê todos os serviços ativos cadastrados
3. **Escolhe a data** → Vê os próximos 30 dias disponíveis
4. **Escolhe o horário** → Vê apenas horários disponíveis (sem conflitos)
5. **Preenche dados** → Nome, telefone e email (opcional)
6. **Confirma agendamento** → Agendamento é criado e aparece no dashboard do prestador

## ⚙️ Configurações do Prestador

O prestador pode configurar:

1. **Horário de funcionamento**:
   - Horário de abertura
   - Horário de fechamento
   - Configurado em: Configurações → Horário de funcionamento

2. **Dias de atendimento**:
   - Segunda a Sábado (padrão)
   - Pode desabilitar dias específicos
   - Configurado em: Configurações → Horário de funcionamento

3. **Intervalo entre horários**:
   - Padrão: 30 minutos
   - Define o espaçamento entre os slots de horário
   - Configurado em: Configurações → Horário de funcionamento

4. **Antecedência mínima**:
   - Padrão: 60 minutos
   - Tempo mínimo antes do agendamento
   - Configurado em: Configurações → Horário de funcionamento

## 🔒 Prevenção de Conflitos

O sistema automaticamente:
- ✅ Impede agendamentos em horários já ocupados
- ✅ Considera a duração do serviço ao verificar disponibilidade
- ✅ Mostra apenas horários que cabem dentro do horário de funcionamento
- ✅ Respeita os dias de trabalho configurados

## 📊 Visualização no Dashboard

Após o cliente agendar:
- ✅ Aparece no **Dashboard** do prestador (agendamentos de hoje)
- ✅ Aparece na página **Agendamentos** (filtro por data)
- ✅ Estatísticas são atualizadas automaticamente

## 🎨 Personalização

A página de agendamento usa as mesmas cores do sistema do prestador, mas pode ser personalizada editando o arquivo `book.html`.

## 📱 Responsivo

A página funciona perfeitamente em:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 🔄 Próximos Passos

Para compartilhar com clientes:
1. Configure o servidor para estar acessível publicamente
2. Compartilhe o link: `http://seu-servidor:3000/book.html`
3. Ou crie um domínio personalizado: `https://agenda.seudominio.com/book.html`

## 🛠️ Exemplo de Uso

1. Cliente acessa: `http://localhost:3000/book.html`
2. Vê os serviços disponíveis
3. Seleciona "Corte + Escova" (R$ 100,00 - 60 min)
4. Escolhe a data: "Seg, 15 Jan"
5. Vê horários disponíveis: 09:00, 09:30, 10:00, 10:30...
6. Seleciona 10:00
7. Preenche: Nome, Telefone, Email
8. Confirma
9. ✅ Agendamento criado!

O prestador verá no dashboard:
- "10:00 - Maria Silva - Corte + Escova - 📱 85999999999"

