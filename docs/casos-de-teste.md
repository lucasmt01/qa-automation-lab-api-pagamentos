# Casos de Teste

|    ID     |                  Cenário             | Tipo              | Prioridade |  Status   |
|-----------|--------------------------------------|-------------------|------------|-----------|
| CT-001    | Health check da API                  | Smoke             |    Alta    | Planejado |
| CT-002    | Criar pagamento PIX com sucesso      | API               |    Alta    | Planejado |
| CT-003    | Criar pagamento sem autenticação     | Segurança/API     |    Alta    | Planejado |
| CT-004    | Criar pagamento com payload inválido | Negativo          |    Alta    | Planejado |
| CT-005    | Consultar pagamento existente        | API               |    Alta    | Planejado |
| CT-006    | Consultar pagamento inexistente      | Negativo          |    Média   | Planejado |
| CT-007    | Atualizar status para APPROVED       | Regra de negócio  |    Alta    | Planejado |
| CT-008    | Cancelar pagamento PENDING           | Regra de negócio  |    Alta    | Planejado |
| CT-009    | Tentar cancelar pagamento APPROVED   | Regra de negócio  |    Alta    | Planejado |
| CT-010    | Validar contrato JSON da resposta    | Contrato          |    Alta    | Planejado |
| CT-DB-001 | Auditar persistência no MongoDB      | Auditoria técnica |    Média   | Planejado |
