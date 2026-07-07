# Plano de Testes

## Objetivo

Validar uma API simulada de pagamentos com foco em testes de API, regras de negÃ³cio, contrato JSON, massa de dados, expurgo e execuÃ§Ã£o em pipeline.

## Escopo inicial

- Criar pagamento
- Consultar pagamento
- Atualizar status
- Cancelar pagamento
- Validar autenticaÃ§Ã£o
- Validar payloads invÃ¡lidos
- Validar contrato JSON
- Expurgar massa de teste por testRunId

## Fora de escopo inicial

- IntegraÃ§Ã£o com banco real de produÃ§Ã£o
- Processamento assÃ­ncrono real
- IntegraÃ§Ã£o com serviÃ§os externos reais
- Testes de interface

## EstratÃ©gia

A suÃ­te principal validarÃ¡ o comportamento pela API REST. O MongoDB serÃ¡ usado como persistÃªncia da API, apoio ao expurgo e, pontualmente, para auditoria tÃ©cnica de dados.
