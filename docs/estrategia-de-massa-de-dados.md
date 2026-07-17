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