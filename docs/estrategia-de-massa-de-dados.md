# Estratégia de Massa de Dados

A massa criada pela automação será identificada por um campo `testRunId`.

Esse identificador permitirá:

- rastrear dados criados por execução;
- evitar conflito entre execuções;
- expurgar somente dados da automação;
- manter os testes independentes.

## Expurgo de massa

Cada pagamento criado pela automação recebe um `testRunId`, usado para identificar a massa criada durante os testes.

O campo `id` identifica um pagamento específico, enquanto o `testRunId` identifica o lote ou contexto de teste responsável pela criação da massa.

Ao final de cada teste, a automação executa o endpoint:

```http
DELETE /test-data/payments?testRunId={testRunId}
Esse endpoint remove somente os pagamentos vinculados ao testRunId informado, evitando apagar dados manuais ou dados de outras execuções.

Quando não existem registros para o testRunId, a API retorna sucesso com deletedCount: 0, pois a operação de limpeza é considerada idempotente.
