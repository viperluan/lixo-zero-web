# Especificações

Funcionalidade nova ou mudança que atravessa módulos ganha uma pasta aqui antes do código. O nome é um slug curto: `docs/specs/aprovar-acao/`.

Cada pasta tem três arquivos, nesta ordem, e cada um espera revisão antes do próximo:

1. `spec.md` — objetivo, comandos, estrutura, estilo, teste, limites e critério de pronto.
2. `plan.md` — ordem de implementação, riscos e o que dá para fazer em paralelo.
3. `tasks.md` — tarefas de uma sessão, com aceite, verificação e arquivos.

A skill `spec-driven-development` conduz as fases. Este diretório é o lugar dos artefatos; não crie `SPEC.md` nem `tasks/` na raiz.

Pedido pequeno e já definido (texto, espaçamento, bug de uma tela) não abre pasta. Se a decisão mudar durante a implementação, atualize o `spec.md` antes de seguir.
