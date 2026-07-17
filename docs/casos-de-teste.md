| ID | Cenário | Endpoint/Ferramenta | Tipo | Prioridade | Status |
|---|---|---|---|---|---|
| CT-001 | Health check da API | Smoke | Alta | Automatizado |
| CT-002 | Criar pagamento PIX com sucesso | API | Alta | Automatizado |
| CT-003 | Criar pagamento sem autenticação | Segurança/API | Alta | Automatizado |
| CT-004 | Criar pagamento com payload inválido | Negativo | Alta | Automatizado |
| CT-005 | Consultar pagamento existente | API | Alta | Automatizado |
| CT-006 | Consultar pagamento inexistente | Negativo | Média | Automatizado |
| CT-007 | Expurgar massa de teste por testRunId | Massa de dados | Alta | Automatizado |
| CT-008 | Tentar expurgar massa sem informar testRunId | Negativo | Alta | Automatizado |
| CT-009 | Atualizar status de pagamento para `APPROVED` | `PATCH /payments/:id/status` | Regra de negócio | Alta | Automatizado |
| CT-010 | Atualizar status de pagamento para `REFUSED` | `PATCH /payments/:id/status` | Regra de negócio | Alta | Automatizado |
| CT-011 | Tentar atualizar pagamento inexistente | `PATCH /payments/:id/status` | Negativo | Média | Automatizado |
| CT-012 | Tentar atualizar pagamento com status inválido | `PATCH /payments/:id/status` | Validação / Negativo | Alta | Automatizado |
| CT-013 | Tentar atualizar pagamento já finalizado | `PATCH /payments/:id/status` | Regra de negócio / Negativo | Alta | Automatizado |
| CT-014 | Cancelar pagamento PENDING com sucesso | POST /payments/:id/cancel | Regra de negócio | Alta | Automatizado |
| CT-015 | Tentar cancelar pagamento inexistente | POST /payments/:id/cancel | Negativo | Média | Automatizado |
| CT-016 | Tentar cancelar pagamento APPROVED | POST /payments/:id/cancel | Regra de negócio / Negativo | Alta | Automatizado |
| CT-017 | Tentar cancelar pagamento REFUSED | POST /payments/:id/cancel | Regra de negócio / Negativo | Alta | Automatizado |
| CT-018 | Tentar cancelar pagamento já CANCELLED | POST /payments/:id/cancel | Regra de negócio / Negativo | Alta | Automatizado |
| CT-019 | Validar contrato da criação de pagamento | POST /payments | Contrato | Alta | Automatizado |
| CT-020 | Validar contrato da consulta de pagamento | GET /payments/:id | Contrato | Alta | Automatizado |
| CT-021 | Validar contrato da atualização de status | PATCH /payments/:id/status | Contrato | Alta | Automatizado |
| CT-022 | Validar contrato do cancelamento de pagamento | POST /payments/:id/cancel | Contrato | Alta | Automatizado |
| CT-023 | Validar contrato de erro 400 | POST /payments | Contrato / Negativo | Média | Automatizado |
| CT-024 | Validar contrato de erro 404 | GET /payments/:id | Contrato / Negativo | Média | Automatizado |
| CT-025 | Validar contrato de erro 409 | POST /payments/:id/cancel | Contrato / Negativo | Alta | Automatizado |
| CT-026 | Validar persistência do pagamento criado no MongoDB | MongoDB / payments | Auditoria técnica | Alta | Automatizado |
| CT-027 | Validar atualização de status no MongoDB | MongoDB / payments | Auditoria técnica | Alta | Automatizado |
| CT-028 | Validar cancelamento de pagamento no MongoDB | MongoDB / payments | Auditoria técnica | Alta | Automatizado |
| CT-029 | Validar expurgo de massa de teste no MongoDB | MongoDB / payments | Auditoria técnica | Alta | Automatizado |
| CT-030 | Executar fluxo principal via Postman/Newman | Collection Postman | Integração / Smoke | Média | Automatizado |
| CT-031 | Criar pagamento sem token | POST /payments | Autenticação / Negativo | Alta | Automatizado |
| CT-032 | Criar pagamento com token inválido | POST /payments | Autenticação / Negativo | Alta | Automatizado |
| CT-033 | Consultar pagamento sem token | GET /payments/:id | Autenticação / Negativo | Média | Automatizado |
| CT-034 | Expurgar massa sem token | DELETE /test-data/payments | Autenticação / Negativo | Média | Automatizado |
| CT-035 | Criar pagamento sem amount | POST /payments | Validação / Negativo | Alta | Automatizado |
| CT-036 | Criar pagamento com amount negativo | POST /payments | Validação / Negativo | Alta | Automatizado |
| CT-037 | Criar pagamento com amount zero | POST /payments | Validação / Negativo | Alta | Automatizado |
| CT-038 | Criar pagamento com currency inválida | POST /payments | Validação / Negativo | Média | Automatizado |
| CT-039 | Criar pagamento com paymentMethod inválido | POST /payments | Validação / Negativo | Média | Automatizado |
| CT-040 | Criar pagamento sem customerDocument | POST /payments | Validação / Negativo | Alta | Automatizado |
| CT-041 | Atualizar status sem informar status | PATCH /payments/:id/status | Validação / Negativo | Alta | Automatizado |