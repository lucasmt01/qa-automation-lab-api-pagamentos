| ID | Cenário | Tipo | Prioridade | Status |
|---|---|---|---|---|
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