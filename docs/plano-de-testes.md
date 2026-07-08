# Plano de Testes

## Objetivo

Validar uma API simulada de pagamentos com foco em testes de API, regras de negócio, contrato JSON, massa de dados, expurgo e execução em pipeline.

## Escopo inicial

- Criar pagamento
- Consultar pagamento
- Atualizar status
- Cancelar pagamento
- Validar autenticação
- Validar payloads inválidos
- Validar contrato JSON
- Expurgar massa de teste por testRunId

## Fora de escopo inicial

- Integração com banco real de produção
- Processamento assíncrono real
- Integração com serviços externos reais
- Testes de interface

## Estratégia

A suíte principal validará o comportamento pela API REST. O MongoDB será usado como persistência da API, apoio ao expurgo e, pontualmente, para auditoria técnica de dados.
