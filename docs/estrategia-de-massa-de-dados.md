# Estratégia de Massa de Dados

## Objetivo

Definir como a massa de teste é criada, identificada, reutilizada e removida durante as execuções automatizadas do projeto.

A estratégia adotada utiliza o campo `testRunId` para isolar os dados gerados pelos testes.

## Problema que a estratégia resolve

Em testes automatizados de API, é comum que cada execução crie dados no banco.

Sem uma estratégia de massa, podem surgir problemas como:

- Dados duplicados
- Banco sujo após os testes
- Conflito entre execuções
- Testes dependentes de dados antigos
- Dificuldade para rastrear quais dados foram criados pela automação

Para evitar esses problemas, todos os pagamentos criados pelos testes recebem um `testRunId`.

## Campo `testRunId`

O `testRunId` é um identificador associado aos pagamentos criados durante uma execução de teste.

Exemplo:

`run_1720000000000_abc123`

Esse campo permite localizar e remover todos os documentos criados por uma execução específica.

## Uso nos testes Playwright

Nos testes Playwright, o `testRunId` é gerado automaticamente por helper.

Cada teste que cria pagamento registra o `testRunId` para expurgo posterior.

Fluxo geral:

1. Gerar `testRunId`
2. Criar pagamento pela API
3. Executar validações
4. Chamar endpoint de expurgo
5. Remover documentos vinculados ao `testRunId`

## Uso na interface web

A interface web utiliza o campo `testRunId` para carregar e criar pagamentos dentro de um contexto controlado.

No uso manual da aplicação, o valor padrão utilizado é:

`run_web_local`

Esse valor permite que os pagamentos criados manualmente pela interface continuem disponíveis após recarregar a página, desde que o MongoDB mantenha o volume de dados.

A listagem da interface utiliza o endpoint:

`GET /payments?testRunId=run_web_local`

A criação de pagamentos pela interface também envia o mesmo `testRunId`, mantendo os dados manuais separados das massas criadas pelos testes automatizados.

## Uso futuro nos testes E2E

Nos testes E2E com Playwright UI, o `testRunId` será dinâmico e específico por teste ou execução.

Exemplo:

`run_e2e_create_payment_1720000000000`

A interface pode receber esse valor pela URL:

`http://localhost:5173/?testRunId=run_e2e_create_payment_1720000000000`

Dessa forma, os testes E2E poderão:

1. Gerar um `testRunId` exclusivo
2. Abrir a interface com esse contexto
3. Criar dados pela UI
4. Validar os fluxos na tela
5. Expurgar apenas os pagamentos daquele `testRunId`

Essa estratégia evita que testes E2E interfiram nos dados manuais da interface ou em massas criadas por testes de API.

## Uso na collection Postman/Newman

Na collection Postman, o `testRunId` é definido no environment local.

Valor utilizado:

`run_postman_local`

A collection executa:

- Cleanup inicial
- Criação dos pagamentos
- Validação dos fluxos
- Cleanup final

Essa abordagem evita que uma execução anterior interfira na próxima.

## Endpoint de expurgo

O endpoint utilizado para limpeza da massa é:

`DELETE /test-data/payments?testRunId={testRunId}`

Exemplo:

`DELETE /test-data/payments?testRunId=run_postman_local`

Esse endpoint remove somente os pagamentos vinculados ao `testRunId` informado.

## Comportamento esperado do expurgo

Quando o `testRunId` é informado corretamente, a API retorna sucesso e a quantidade de documentos removidos.

Exemplo de resposta:

{
  "message": "Massa de teste expurgada com sucesso",
  "testRunId": "run_postman_local",
  "deletedCount": 2
}

Quando não existem documentos para o `testRunId`, o endpoint ainda retorna sucesso com `deletedCount` igual a `0`.

Esse comportamento é intencional para manter o expurgo idempotente.

## Validação no MongoDB

Após a execução, é possível validar se existem documentos residuais com o comando:

`docker exec -it qa-lab-mongo mongosh qa_lab_payments --eval "db.payments.countDocuments()"`

O resultado esperado após uma execução completa é:

`0`

Também é possível validar por `testRunId` específico:

`docker exec -it qa-lab-mongo mongosh qa_lab_payments --eval "db.payments.countDocuments({ testRunId: 'run_postman_local' })"`

Resultado esperado:

`0`

## Vantagens da estratégia

A estratégia com `testRunId` permite:

- Isolamento da massa de teste
- Rastreabilidade dos dados criados
- Expurgo seletivo
- Menor acoplamento entre testes
- Redução de sujeira no banco
- Execuções mais confiáveis localmente e em CI

## Observações

O uso de `testRunId` é uma prática útil em testes de backend, principalmente quando os testes precisam criar dados reais em banco.

Essa estratégia também facilita auditorias técnicas, pois permite buscar diretamente no MongoDB os documentos criados por uma execução específica.