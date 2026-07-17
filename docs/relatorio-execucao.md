# Relatório de Execução dos Testes

## Objetivo

Registrar a execução dos testes automatizados da API de pagamentos, cobrindo testes funcionais, regras de negócio, cenários negativos, validação de contrato, auditoria técnica no MongoDB e smoke test via Postman/Newman.

## Sistema testado

**Projeto:** QA Automation Lab - API de Pagamentos  
**Tipo:** API REST simulada para laboratório de QA Backend  
**Banco de dados:** MongoDB  
**Execução local:** Windows + Docker  
**Execução CI:** GitHub Actions  

## Escopo executado

A execução contempla os seguintes grupos de testes:

| Suíte | Comando | Objetivo |
|---|---|---|
| Testes de API | `npm run test:api` | Validar endpoints, regras de negócio, autenticação, payloads inválidos e contratos |
| Auditoria MongoDB | `npm run test:db` | Validar persistência diretamente no banco |
| Testes Playwright completos | `npm run test:playwright` | Executar testes de API e auditoria MongoDB em uma única execução |
| Postman/Newman | `npm run postman:test` | Executar fluxo principal da API via collection Postman |
| Suíte completa | `npm run test:all` | Executar Playwright e Newman |
| Pipeline CI | GitHub Actions | Executar validações automaticamente no push ou pull request |

## Tipos de teste executados

- Testes funcionais de API
- Testes de regra de negócio
- Testes negativos
- Testes de autenticação
- Testes de validação de payload
- Testes de contrato JSON
- Auditoria técnica em banco de dados
- Smoke test via Postman/Newman
- Execução automatizada em CI

## Critérios de entrada

Antes
- Smoke test via Postman/Newman
- Execução automatizada em CI

## Critérios de entrada

Antes da execução dos testes, os seguintes critérios devem ser atendidos:

- Dependências da raiz instaladas
- Dependências da API instaladas
- MongoDB disponível
- API inicializada
- Endpoint `/health` respondendo com status `UP`
- Variáveis de ambiente configuradas quando necessário

## Critérios de sucesso

A execução é considerada bem-sucedida quando:

- Todos os testes Playwright passam
- A collection Postman executada via Newman passa
- A pipeline do GitHub Actions finaliza com sucesso
- A massa de teste é expurgada corretamente
- Não há documentos residuais indevidos no MongoDB
- Os contratos JSON são respeitados
- Os logs e relatórios são disponibilizados como evidências

## Evidências geradas

| Evidência | Origem | Descrição |
|---|---|---|
| `playwright-report` | GitHub Actions / Playwright | Relatório HTML dos testes Playwright |
| `api-log` | GitHub Actions | Log da API durante execução no CI |
| Log do Newman | Terminal / GitHub Actions | Resultado da collection Postman |
| Status da pipeline | GitHub Actions | Indica sucesso ou falha da execução automatizada |
| Consulta MongoDB | MongoDB | Confirma expurgo da massa de teste |

## Resultado esperado

O resultado esperado da execução completa é:

- Testes Playwright sem falhas
- Testes de auditoria MongoDB sem falhas
- Collection Postman/Newman sem falhas
- Pipeline CI com status `Success`
- Banco limpo após a execução

## Comandos principais

Instalar dependências:

`npm install`

Instalar dependências da API:

`npm --prefix fake-api install`

Subir MongoDB:

`npm run mongo:up`

Subir API:

`npm run api:dev`

Executar testes Playwright:

`npm run test:playwright`

Executar Newman:

`npm run postman:test`

Executar suíte completa:

`npm run test:all`

Abrir relatório Playwright:

`npm run test:report`

## Observações

A massa de teste é isolada por `testRunId`, permitindo identificar e remover apenas os documentos criados durante a execução.

A suíte de auditoria MongoDB é uma validação complementar e não substitui os testes funcionais de API.

A collection Postman/Newman funciona como smoke test compartilhável dos principais fluxos da API.