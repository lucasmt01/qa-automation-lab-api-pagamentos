# QA Automation Lab - API de Pagamentos

Projeto de portfólio criado para demonstrar práticas de qualidade de software em uma API REST de pagamentos, com foco em testes de backend, automação de API, validação de regras de negócio, controle de massa de dados, persistência em MongoDB, validação de contrato JSON, auditoria técnica em banco, execução de collection Postman via Newman e integração com CI/CD.

## Contexto

A API simula fluxos comuns em produtos financeiros, como criação de pagamentos, consulta por identificador, atualização de status, cancelamento e expurgo de massa de teste.

O projeto foi estruturado para representar um cenário próximo ao ambiente real de QA backend, onde os testes precisam validar não apenas o status code das respostas, mas também regras de negócio, autenticação, payloads inválidos, persistência, contratos de resposta, limpeza dos dados utilizados na execução e fluxos executáveis em diferentes ferramentas de teste.

## Funcionalidades da API

Atualmente a API cobre os seguintes fluxos:

- Health check da aplicação
- Criação de pagamento
- Consulta de pagamento por ID
- Listagem de pagamentos por `testRunId`
- Atualização de status para `APPROVED` ou `REFUSED`
- Cancelamento de pagamento
- Validação de autenticação via token
- Validação de payload
- Registro de histórico de status
- Expurgo de massa de teste por `testRunId`

## Regras de negócio principais

- Todo pagamento é criado inicialmente com status `PENDING`
- Pagamentos `PENDING` podem ser atualizados para `APPROVED` ou `REFUSED`
- Pagamentos finalizados não podem ter o status alterado novamente
- Pagamentos `PENDING` podem ser cancelados
- Pagamentos `APPROVED`, `REFUSED` ou `CANCELLED` não podem ser cancelados
- Toda mudança de status é registrada em `statusHistory`
- Dados de teste podem ser removidos por `testRunId`
- Endpoints protegidos exigem autenticação via token
- Payloads inválidos devem retornar erro de validação

## Estratégia de testes

A suíte automatizada valida a API em diferentes camadas:

- Testes funcionais de endpoints REST
- Testes de regras de negócio
- Testes de cenários negativos
- Testes dedicados de autenticação
- Testes de validação de payload e campos obrigatórios
- Validação de autenticação
- Validação de payloads inválidos
- Validação de persistência por consulta
- Expurgo de massa de teste
- Validação de contrato JSON com AJV
- Auditoria técnica diretamente no MongoDB
- Smoke test dos principais fluxos via Postman/Newman
- Execução automatizada no GitHub Actions

## Validação de contrato

O projeto utiliza JSON Schema e AJV para validar os contratos das respostas da API.

Além dos testes funcionais, a suíte automatizada verifica se as respostas mantêm os campos obrigatórios, tipos esperados, formatos de data e regras estruturais definidas nos schemas.

Schemas utilizados:

- `schemas/payment-response.schema.json`
- `schemas/error-response.schema.json`

Execução dos testes de contrato:

```bash
npx playwright test tests/api/payments.contract.spec.ts
```

## Auditoria técnica no MongoDB

Além dos testes funcionais de API, o projeto possui uma suíte dedicada para validar a persistência dos dados diretamente no MongoDB.

Essa suíte executa ações pela API e consulta a collection `payments` para confirmar se os documentos foram salvos, atualizados, cancelados e expurgados corretamente.

Execução dos testes de auditoria:

```bash
npm run test:db
```

## Postman e Newman

O projeto também possui uma collection Postman para execução dos principais fluxos da API.

Arquivos utilizados:

- `postman/payments.postman_collection.json`
- `postman/local.postman_environment.json`

A collection cobre:

- Cleanup inicial da massa Postman
- Health check
- Criação de pagamento
- Consulta de pagamento
- Atualização de status para `APPROVED`
- Tentativa de atualização de pagamento já finalizado
- Criação de pagamento para cancelamento
- Cancelamento de pagamento
- Tentativa de cancelar pagamento já cancelado
- Cleanup final da massa Postman

Execução via Newman:

```bash
npm run postman:test
```

## Stack utilizada

### Implementado atualmente

- Node.js
- Express
- TypeScript
- React
- Vite
- Playwright API
- MongoDB
- Docker Compose
- Zod
- AJV
- AJV Formats
- Postman
- Newman
- GitHub Actions

### Evoluções planejadas

- Testes E2E com Playwright UI
- Integração dos testes E2E no GitHub Actions
- Documentação final da Parte 2

## Estrutura do projeto

```txt
qa-automation-lab-api-pagamentos/
├── .github/
│   └── workflows/
│       └── api-tests.yml
├── docs/
│   ├── casos-de-teste.md
│   ├── estrategia-de-massa-de-dados.md
│   ├── evidencias.md
│   ├── plano-de-testes.md
│   └── relatorio-execucao.md
├── fake-api/
│   └── src/
├── postman/
│   ├── local.postman_environment.json
│   └── payments.postman_collection.json
├── reports/
├── schemas/
│   ├── error-response.schema.json
│   └── payment-response.schema.json
├── tests/
│   ├── api/
│   │   ├── auth.spec.ts
│   │   ├── health.spec.ts
│   │   ├── payments.cancel.spec.ts
│   │   ├── payments.contract.spec.ts
│   │   ├── payments.create.spec.ts
│   │   ├── payments.get.spec.ts
│   │   ├── payments.list.spec.ts
│   │   ├── payments.status.spec.ts
│   │   ├── payments.validation.spec.ts
│   │   └── test-data.cleanup.spec.ts
│   ├── data/
│   ├── database/
│   │   └── payments.mongo-audit.spec.ts
│   ├── fixtures/
│   └── helpers/
│       ├── auth.ts
│       ├── cleanup.ts
│       ├── mongo-client.ts
│       ├── payment-assertions.ts
│       ├── schema-validator.ts
│       └── test-run.ts
├── web-app/
│   └── src/
├── docker-compose.yml
├── package.json
├── playwright.config.ts
└── README.md
```

## Endpoints disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se a API está online |
| `POST` | `/payments` | Cria um pagamento |
| `GET` | `/payments?testRunId=` | Lista pagamentos por contexto de execução |
| `GET` | `/payments/:id` | Consulta um pagamento por ID |
| `PATCH` | `/payments/:id/status` | Atualiza o status do pagamento |
| `POST` | `/payments/:id/cancel` | Cancela um pagamento |
| `DELETE` | `/test-data/payments?testRunId=` | Remove massa de teste |

## Como rodar o projeto

### 1. Instalar dependências da raiz

```bash
npm install
```

### 2. Instalar dependências da API simulada de pagamentos

```bash
npm --prefix fake-api install
```

### 3. Subir o MongoDB com Docker

```bash
npm run mongo:up
```

O MongoDB do projeto fica disponível em:

```txt
mongodb://localhost:27018
```

Banco utilizado:

```txt
qa_lab_payments
```

Collection principal:

```txt
payments
```

### 4. Subir a API

```bash
npm run api:dev
```

A API ficará disponível em:

```txt
http://localhost:3000
```

### 5. Rodar todos os testes de API

```bash
npm run test:api
```

### 6. Rodar apenas os testes de contrato

```bash
npx playwright test tests/api/payments.contract.spec.ts
```

### 7. Rodar os testes de auditoria no MongoDB

```bash
npm run test:db
```

### 8. Rodar todos os testes Playwright

```bash
npm run test:playwright
```

### 9. Rodar a collection Postman via Newman

```bash
npm run postman:test
```

### 10. Rodar toda a suíte automatizada

```bash
npm run test:all
```

### 11. Abrir relatório do Playwright

```bash
npm run test:report
```

## Interface web

O projeto possui uma interface web em React + Vite para consumir a API local de pagamentos.

A interface permite:

- Listar pagamentos por `testRunId`
- Criar pagamentos
- Visualizar detalhes de um pagamento
- Aprovar pagamentos pendentes
- Recusar pagamentos pendentes
- Cancelar pagamentos pendentes
- Filtrar e buscar registros na tabela

Por padrão, o front utiliza o contexto manual:

`run_web_local`

Também é possível informar um `testRunId` pela URL, o que será utilizado nos testes E2E para isolar a massa de dados:

`http://localhost:5173/?testRunId=run_e2e_exemplo`

Executar a interface web:

`npm run web:dev`

Gerar build da interface:

`npm run web:build`

## Autenticação

Os endpoints protegidos exigem o header:

```txt
Authorization: Bearer qa-lab-token
```

Exemplo de endpoint público:

```bash
curl -X GET http://localhost:3000/health
```

Exemplo de endpoint protegido:

```bash
curl -X POST http://localhost:3000/payments \
  -H "Authorization: Bearer qa-lab-token" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.75,
    "currency": "BRL",
    "paymentMethod": "PIX",
    "customerDocument": "12345678909",
    "description": "Pagamento PIX criado pela automação",
    "testRunId": "run_example_001"
  }'
```

## Exemplo de payload de criação

```json
{
  "amount": 150.75,
  "currency": "BRL",
  "paymentMethod": "PIX",
  "customerDocument": "12345678909",
  "description": "Pagamento PIX criado pela automação",
  "testRunId": "run_example_001"
}
```

## Exemplo de resposta de pagamento

```json
{
  "id": "pay_123",
  "amount": 150.75,
  "currency": "BRL",
  "paymentMethod": "PIX",
  "customerDocument": "12345678909",
  "description": "Pagamento PIX criado pela automação",
  "status": "PENDING",
  "statusHistory": [
    {
      "from": null,
      "to": "PENDING",
      "changedAt": "2026-07-13T12:00:00.000Z",
      "reason": "Pagamento criado"
    }
  ],
  "testRunId": "run_example_001",
  "createdAt": "2026-07-13T12:00:00.000Z",
  "updatedAt": "2026-07-13T12:00:00.000Z"
}
```

## Controle de massa de dados

Cada pagamento criado nos testes recebe um `testRunId`.

Esse identificador permite remover apenas os dados criados durante a execução dos testes, sem afetar outras massas.

Endpoint de expurgo:

```txt
DELETE /test-data/payments?testRunId=run_example_001
```

Essa estratégia evita sujeira no banco e simula uma prática comum em automação de testes de backend.

## Casos de teste documentados

Os casos de teste estão documentados em:

`docs/casos-de-teste.md`

A documentação inclui cenários de:

- Criação de pagamento
- Consulta de pagamento
- Validação de autenticação
- Validação de payload inválido
- Validação de campos obrigatórios
- Atualização de status
- Cancelamento
- Expurgo de massa
- Validação de contrato
- Auditoria técnica no MongoDB
- Execução de fluxo principal via Postman/Newman
- Execução em pipeline CI

## Documentação complementar

Além dos casos de teste, o projeto possui documentos auxiliares em `docs/`:

| Documento | Objetivo |
|---|---|
| `docs/plano-de-testes.md` | Define escopo, tipos de teste, ferramentas, critérios e riscos |
| `docs/estrategia-de-massa-de-dados.md` | Explica o uso de `testRunId` e a estratégia de expurgo |
| `docs/evidencias.md` | Descreve evidências geradas localmente e no CI |
| `docs/relatorio-execucao.md` | Resume execução, suítes, comandos, critérios de sucesso e evidências |

## CI com GitHub Actions

O projeto possui uma pipeline no GitHub Actions para executar automaticamente as validações da API.

A pipeline é executada em eventos de `push` e `pull_request` e realiza as seguintes etapas:

- Instalação das dependências
- Build da API simulada de pagamentos
- Inicialização de um serviço MongoDB
- Subida da API
- Verificação do endpoint `/health`
- Execução dos testes Playwright API e MongoDB Audit
- Execução da collection Postman via Newman
- Upload do relatório Playwright como artefato
- Upload dos logs da API como artefato

Arquivo da pipeline:

`/.github/workflows/api-tests.yml`

## Próximas evoluções

- Testes E2E com Playwright UI
- Integração do front e dos testes E2E no GitHub Actions
- Documentação final da Parte 2

## Autor

Projeto desenvolvido como parte de um laboratório prático de qualidade de software, automação de testes e validação de APIs.