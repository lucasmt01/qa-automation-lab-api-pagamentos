# Plano de Testes

## Objetivo

Definir a estratégia de testes do projeto **QA Automation Lab - API de Pagamentos**, descrevendo escopo, tipos de teste, ferramentas, ambiente, critérios de entrada, critérios de saída e riscos.

## Escopo

O escopo dos testes contempla a API simulada de pagamentos e seus principais fluxos de negócio.

Estão dentro do escopo:

- Health check da aplicação
- Criação de pagamento
- Consulta de pagamento por ID
- Atualização de status
- Cancelamento de pagamento
- Validação de autenticação
- Validação de payloads inválidos
- Validação de campos obrigatórios
- Controle e expurgo de massa de teste
- Validação de contrato JSON
- Auditoria técnica no MongoDB
- Execução de fluxo principal via Postman/Newman
- Execução automatizada em pipeline CI

## Fora de escopo

Não fazem parte do escopo atual:

- Testes de interface web
- Testes de performance/carga
- Testes de segurança avançados
- Integração com serviços externos reais
- Integração com Kafka ou mensageria real
- Validação de produto bancário real
- Testes em ambiente produtivo

Esses itens podem ser considerados em evoluções futuras do projeto.

## Tipos de teste

| Tipo de teste | Objetivo |
|---|---|
| Funcional de API | Validar se os endpoints respondem conforme esperado |
| Regra de negócio | Validar transições de status e restrições do pagamento |
| Negativo | Validar erros esperados em cenários inválidos |
| Autenticação | Validar ausência de token e token inválido |
| Validação de payload | Validar campos obrigatórios, tipos e valores inválidos |
| Contrato JSON | Validar estrutura, tipos e campos obrigatórios das respostas |
| Auditoria MongoDB | Validar persistência diretamente no banco |
| Smoke via Newman | Validar fluxo principal usando collection Postman |
| CI | Executar validações automaticamente no GitHub Actions |

## Ferramentas utilizadas

- Node.js
- Express
- TypeScript
- Playwright API
- MongoDB
- Docker Compose
- Zod
- AJV
- AJV Formats
- Postman
- Newman
- GitHub Actions

## Ambiente local

O ambiente local utiliza:

- API executando em `http://localhost:3000`
- MongoDB via Docker em `mongodb://localhost:27018`
- Banco `qa_lab_payments`
- Collection `payments`

## Ambiente CI

O ambiente de CI utiliza GitHub Actions.

No CI, o MongoDB é iniciado como service do workflow e a API é executada em segundo plano.

A pipeline executa:

- Instalação de dependências
- Build da API
- Inicialização do MongoDB
- Inicialização da API
- Health check
- Testes Playwright
- Collection Postman via Newman
- Upload de artefatos

## Estratégia de massa de dados

Os testes utilizam `testRunId` para identificar massas criadas durante a execução.

Essa estratégia permite:

- Isolar dados de uma execução
- Evitar conflito entre testes
- Expurgar somente os dados criados pela automação
- Manter o banco limpo após a execução

## Critérios de entrada

Para iniciar os testes, é necessário que:

- As dependências estejam instaladas
- O MongoDB esteja disponível
- A API esteja em execução
- O endpoint `/health` esteja respondendo
- As variáveis de ambiente estejam configuradas, quando aplicável

## Critérios de saída

A execução é considerada concluída com sucesso quando:

- Todos os testes Playwright passam
- A collection Newman passa
- O GitHub Actions finaliza com status `Success`
- O relatório Playwright é gerado
- Os logs da API são disponibilizados no CI
- A massa de teste é removida do banco

## Riscos e mitigação

| Risco | Mitigação |
|---|---|
| API não iniciar no CI | Health check e upload de `api.log` |
| Massa residual no banco | Uso de `testRunId` e endpoint de expurgo |
| Alteração indevida no contrato | Testes com JSON Schema e AJV |
| Falha difícil de analisar | Relatório Playwright e logs como artefatos |
| Diferença entre ambiente local e CI | Variáveis de ambiente configuradas no workflow |
| Conflito com Mongo local | Uso da porta `27018` no ambiente local |

## Observações

O projeto utiliza uma API simulada para permitir controle total dos fluxos de teste, regras de negócio, massa de dados e persistência.

Essa abordagem permite construir uma suíte mais realista e controlada para fins de estudo, prática e portfólio.