# Evidências de Execução

Este documento descreve as principais evidências geradas durante a execução dos testes automatizados do projeto **QA Automation Lab - API de Pagamentos**.

O objetivo das evidências é permitir rastreabilidade da execução, facilitar análise de falhas e demonstrar que os testes foram executados em ambiente local e em pipeline CI.

## Evidências disponíveis

O projeto gera ou disponibiliza as seguintes evidências:

- Relatório HTML do Playwright
- Logs da API simulada de pagamentos
- Resultado da execução da collection Postman via Newman
- Resultado da pipeline no GitHub Actions
- Validação de limpeza da massa de teste no MongoDB

## Relatório Playwright

O Playwright gera um relatório HTML com o resultado dos testes automatizados.

Esse relatório inclui:

- Suítes executadas
- Testes aprovados
- Testes falhos, quando houver
- Tempo de execução
- Stack trace em caso de erro
- Detalhes da execução por arquivo de teste

Execução local dos testes Playwright:

`npm run test:playwright`

Abrir relatório local:

`npm run test:report`

No GitHub Actions, o relatório é publicado como artefato com o nome:

`playwright-report`

## Logs da API

Durante a execução no GitHub Actions, a API é iniciada em segundo plano e seus logs são redirecionados para o arquivo:

`api.log`

Esse arquivo é publicado como artefato com o nome:

`api-log`

O log da API ajuda a investigar falhas como:

- API não inicializou
- Erro de conexão com MongoDB
- Falha inesperada durante uma requisição
- Problemas de configuração de ambiente

## Execução via Newman

A collection Postman pode ser executada via Newman com o comando:

`npm run postman:test`

Essa execução valida o fluxo principal da API, incluindo:

- Health check
- Criação de pagamento
- Consulta de pagamento
- Atualização de status
- Validação de regra de negócio negativa
- Cancelamento
- Expurgo de massa de teste

O resultado da execução aparece no terminal local ou nos logs do GitHub Actions.

## GitHub Actions

A pipeline do GitHub Actions executa automaticamente as validações do projeto em eventos de `push` e `pull_request`.

A pipeline executa:

- Instalação de dependências
- Build da API simulada
- Inicialização do MongoDB
- Inicialização da API
- Validação do endpoint `/health`
- Execução dos testes Playwright
- Execução da collection Postman via Newman
- Upload do relatório Playwright
- Upload dos logs da API

O resultado esperado é a pipeline finalizar com status:

`Success`

## Evidência de limpeza da massa

A massa de teste é controlada por `testRunId`.

Após a execução dos testes, é possível validar se o banco ficou limpo com:

`docker exec -it qa-lab-mongo mongosh qa_lab_payments --eval "db.payments.countDocuments()"`

O resultado esperado, após a execução completa e expurgo das massas, é:

`0`

## Observações

As evidências geradas localmente não precisam ser versionadas no repositório.

Relatórios, logs e arquivos temporários devem ser tratados como artefatos de execução.