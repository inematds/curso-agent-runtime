# SPEC — INEMA Agent Runtime (formato-curso-v2)

Curso INEMA.CLUB (aberto e gratuito) que **ensina a usar o kit** `inematds/inema-agent-runtime`.
Título exato: **INEMA Agent Runtime — faça qualquer IA usar qualquer ferramenta**. courseId = `agrt`.
Skill de formato: `~/.claude/skills/formato-curso-v2/` (erros críticos #1–#31 valem).

Fonte da verdade do conteúdo: o kit em `~/projetos/inema-agent-runtime` (README, AGENTS.md, CLAUDE.md, CHANGELOG, `runtime/`).
**Não editar nada no kit.** Ler à vontade.

## Público e tom

- Comunidade INEMA.CLUB, 30+, já usa chat de IA, ouviu falar em Claude Code/Codex, **não precisa ser programador**, mas vai usar o terminal: cada termo técnico é definido na 1ª vez (box "🆕 Novo aqui?").
- Personagens fixos (usar nos exemplos):
  - **Clara, 47, dona de clínica** com a agenda numa planilha. Profissionais da clínica: **Dra. Ana** e **Dr. Bruno** (são os do `runtime/exemplos/agenda.csv`).
  - **Sônia, 51, contadora**. O cliente dela é uma distribuidora cujo **ERP não tem API**, só exporta CSV de vendas (`runtime/exemplos/erp-vendas.csv`: clientes Mercado Sol, Padaria Lua, Empório Mar).
- Tom: direto, frases curtas, parágrafos de 2–4 linhas, sem coachzinho, português correto com acentos.
- **Não citar nomes de criadores, canais ou vídeos de terceiros.** Falar só "vídeos que circularam sobre mods do Claude Code".
- Casos de falha do INEMA: anônimos ("aconteceu num projeto nosso").

## Tese (atravessa o curso)

Engenharia reversa **não é produto, é técnica de descoberta**. Use sempre a via mais estável que existir:
**API → MCP → CLI → SDK → uso do computador → ponte local → engenharia reversa (só laboratório)**.
Hoje quase tudo que os vídeos de mods fizeram por engenharia reversa tem via oficial: `claude --bg` / `claude agents` (sessões paralelas), plugins oficiais do Claude Code (mods), `codex exec` (Claude chamando o Codex).
O kit funciona pela **assinatura** do Claude Code e/ou do Codex; nenhuma API paga é pré-requisito.

## Vocabulário fixo (um nome por conceito)

- **via** = nível da escada (1 API · 2 MCP · 3 CLI · 4 SDK · 5 uso do computador · 6 ponte local · 7 engenharia reversa)
- **ponte** = o que transforma uma via em algo que o agente chama (script, servidor MCP)
- **receita** = arquivo `runtime/receitas/R*.md` com passos + **Prova**
- **prova** = critério `comando → saída esperada`
- **N0–N4** = autonomia (N0 só conversa · N1 prepara, humano executa · N2 executa depois de pedir · N3 executa e avisa · N4 executa sem aviso)
- **nível de modelo** = super / topo / executor / menor
- **cota** = o limite de uso da assinatura (não é dólar)

## COMANDOS PERMITIDOS (nenhum outro entra numa página)

Tier A = rodado nesta máquina em 2026-10-05 (saída real abaixo, pode ser mostrada como saída).
Tier B = provado no `CHANGELOG.md` 0.1.0 do kit (pode citar o resultado do CHANGELOG).
Tier C = está numa receita com linha "Prova" (Fase 2). Mostrar o comando exatamente e citar a Prova como **"resultado esperado"**, nunca inventar saída de terminal.

| Comando (verbatim) | Fonte | Tier | Saída/prova |
|---|---|---|---|
| `git clone https://github.com/inematds/inema-agent-runtime meu-projeto` / `cd meu-projeto` | README | — | — |
| `node runtime/scripts/doctor.mjs` | README, LEIA-ME | A | ver bloco DOCTOR |
| `npm i -g @anthropic-ai/claude-code` · `npm i -g @openai/codex` · `codex login` | doctor.mjs (dicas) | — | — |
| `claude` / `codex` (abrir na pasta) | README | — | — |
| `chmod +x runtime/pontes/codex-exec.sh` | R1 | — | — |
| `runtime/pontes/codex-exec.sh "Responda apenas PONG"` | R1 | B | `PONG` |
| `runtime/pontes/codex-exec.sh "Crie notas.txt com a palavra OK" "$PWD" workspace-write` | R1 | B | `cat notas.txt` → `OK` |
| `runtime/pontes/codex-exec.sh "x" . danger-full-access` | CHANGELOG | B | `sandbox recusado pela POLITICA`, saída 2 |
| `cat notas.txt` | R1 | B | `OK` |
| variáveis `CODEX_MODELO` (padrão `gpt-6-luna`) e `CODEX_TIMEOUT` (padrão `600`) | R1 | — | — |
| `-c sandbox_workspace_write.network_access=true` (só citar como ajuste da ponte, anotado em LIMITES.md) | R1 | — | — |
| `node runtime/pontes/mcp-modelo/server.mjs --selftest` | R3 | A | ver bloco SELFTEST |
| `claude mcp list` | R3 | A | linha `ponte-modelo: node runtime/pontes/mcp-modelo/server.mjs - ✔ Connected` |
| `codex mcp add ponte-modelo -- node "$PWD/runtime/pontes/mcp-modelo/server.mjs"` | R3 | C | — |
| `claude mcp add ponte-modelo -- node runtime/pontes/mcp-modelo/server.mjs` | comentário do server.mjs | C | — |
| `claude -p "Use a tool listar_horarios_livres da ponte-modelo e diga os horários livres de 2026-10-07."` | R3 | C | esperado: 08:00 (Dra. Ana) e 16:00 (Dr. Bruno) |
| `PONTE_DADOS=/caminho/da/exportacao` (campo `env` do `.mcp.json`) | R3 | — | — |
| `npm i -g agent-browser` · `agent-browser install` | R5 | C | — |
| `agent-browser open https://example.com` · `agent-browser get title` · `agent-browser close` | R5 | C | esperado: `Example Domain` |
| `claude -p "Use o time (planejador, executor, revisor). Tarefa: crie saudacao.txt com a frase 'Olá, comunidade INEMA'. Termine com a resposta do revisor."` | R2 | B | `saudacao.txt` correto, revisor `APROVADO`; custo ~US$ 0,73 equivalente de API (na assinatura é cota, não cobrança) |
| `cat saudacao.txt` | R2 | B | a frase |
| `claude --bg --permission-mode plan --name revisor "Leia runtime/POLITICA.md e responda em uma linha qual é o teto de 'Enviar'."` | R4 | C | — |
| `claude --bg --model sonnet --name executor "Crie resumo.md com 3 linhas sobre o que é este kit."` | R4 | C | — |
| `node runtime/scripts/observar.mjs` · `node runtime/scripts/observar.mjs --todas` | R4 | A | ver bloco OBSERVAR |
| `claude logs <id>` · `claude attach <id>` · `claude stop <id>` | R4 | C | — |
| `node runtime/scripts/verificar.mjs runtime/exemplos/goal-exemplo.md` | R6 | A | ver bloco VERIFICAR |
| `claude --help` · `codex --help` | ROTEAMENTO | — | — |
| `claude --plugin-dir /caminho/do/kit/runtime/mods/runtime-guarda` (levar a guarda a outro projeto, só nesta sessão) | R7 | B (0.3.0) | `rm -r pasta` barrado pelo "Raio", pasta intacta; Edit em arquivo de outra sessão barrado pela "colisão" |
| prova do raio (R7, verbatim): `mkdir -p /tmp/teste-raio/x && echo a > /tmp/teste-raio/x/a && cd /tmp/teste-raio` e `printf '{"cwd":"%s","tool_name":"Bash","tool_input":{"command":"rm -r x"}}' "$PWD" \| node /caminho/do/kit/runtime/mods/runtime-guarda/hooks/raio.mjs` | R7 | B (0.3.0) | esperado: `"permissionDecision":"ask"` e `Raio: este comando apaga 1 arquivo(s)` |
| `INEMA_COLISAO_MIN=60` (muda a janela de 30 min) | R7 | — | — |
| `claude --plugin-dir runtime/mods/runtime-painel` e, na sessão, `/painel` | R7 | B (0.3.0) | painel com sessões do `claude --bg`, botões Atualizar e Parar |
| `claude plugin validate runtime/mods/runtime-painel` · `claude plugin test runtime/mods/runtime-painel` | R7 | B (0.3.0) | passa · `1 pass` |

**Kit 0.3.0 (commit e36b7ed):** 7 receitas R1–R7. O CHANGELOG agora tem as provas da 0.2.0 (R3–R6: selftest, `claude mcp list` Connected, `claude -p` com 08:00 Dra. Ana e 16:00 Dr. Bruno, `claude --bg` + observar com sessão `background … done` que respondeu "N2", verificar 4/4 e FALHA saída 1, agent-browser `Example Domain`) e da 0.3.0 (guarda e painel). Portanto os Tier C acima viraram Tier B: pode citar "provado no CHANGELOG 0.2.0/0.3.0".
**Aprendido (CHANGELOG 0.2.0):** `claude --bg` exige pasta marcada como confiável — o aviso abre com **"No, exit" selecionado** (mude para "Yes, I trust this folder") — e **não aceita `-p`** (`--bg and --print conflict`).
**Guarda já vem ligada no kit** pelo `.claude/settings.json` (hooks PreToolUse/PostToolUse chamando `runtime/mods/runtime-guarda/hooks/colisao.mjs` e `raio.mjs`). Guarda nunca decide sozinha: pergunta (N2). Colisão: arquivo que outra sessão editou, ou que mudou por fora, nos últimos 30 min → pergunta seguir / worktree / cancelar. Raio: antes de `rm` ou `git clean` que apagaria arquivos existentes → mostra quantos, tamanho e primeiros caminhos. Registro em `~/.local/state/inema-runtime/toques.json`, limpa após 24 h. Limite: o Codex ainda não tem gancho "antes de editar"; a colisão **detecta** edições do Codex pela data do arquivo. Mods rodam com as permissões do Claude Code: ler o código de mod de terceiro antes de instalar.

Prompts para colar no agente (podem ser criados, desde que só mandem o agente usar arquivos/comandos acima).
Prompt do README (verbatim): `Leia runtime/LEIA-ME.md e me ajude a preencher o CAPACIDADES.md para o meu trabalho.`
Prompt de R1 (verbatim): `Use runtime/pontes/codex-exec.sh para pedir ao Codex uma revisão do arquivo README.md: o que está confuso para um iniciante? Depois compare com a sua opinião.`
Prompt de R2 (verbatim): `Use o time: o planejador planeja, o executor faz e o revisor confere. Tarefa: crie saudacao.txt com a frase "Olá, comunidade INEMA".`
Prompt de R5 (verbatim): `Use o agent-browser para abrir <site>, ler a tabela de preços e me devolver em CSV. Não clique em botões de envio ou compra: se precisar, pare e me pergunte.`
Prompt de R6 (verbatim): `/goal Cumpra o goal em meu-goal.md. Depois de cada etapa rode node runtime/scripts/verificar.mjs meu-goal.md. Só pare com todos OK ou num portão humano do goal.`

### Saídas reais (Tier A)

DOCTOR (`node runtime/scripts/doctor.mjs`, saída 0):
```
node    ok        24.13.0
claude  ok        2.1.289   login: abra `claude` uma vez; R2 usa ele
codex   ok        0.159.2   Logged in using ChatGPT
ollama  ok        0.33.2    opcional: modelos locais grátis

PRONTO: siga para runtime/receitas/R1-claude-usa-codex.md
```
SELFTEST:
```
tools: 2 (listar_horarios_livres, resumo_vendas)
2026-10-06 09:00 · Dra. Ana
2026-10-06 10:00 · Dra. Ana
2026-10-06 15:00 · Dr. Bruno
TOTAL: R$ 856.00
```
OBSERVAR:
```
id        tipo        nome        estado  iniciada há
d6816239  background  r4-revisor  done    7 min

ver saída: claude logs <id> · entrar: claude attach <id> · parar: claude stop <id>
```
VERIFICAR (saída 0):
```
OK     node runtime/pontes/mcp-modelo/server.mjs --selftest
OK     node runtime/pontes/mcp-modelo/server.mjs --selftest
OK     node runtime/pontes/mcp-modelo/server.mjs --selftest
OK     node runtime/scripts/doctor.mjs

4/4 critérios OK
```
Conta de conferência do `TOTAL: R$ 856.00`: 10×18,50 + 25×5,20 + 40×5,20 + 6×18,50 + 12×18,50 = 185 + 130 + 208 + 111 + 222 = 856.

### Arquivos do kit que podem ser mostrados (conteúdo real — copiar do kit, não reescrever)

`runtime/LEIA-ME.md` (ciclo e escada), `runtime/CAPACIDADES.md` (tabela + exemplos), `runtime/POLITICA.md` (N0–N4, teto por ação, Aprendizado), `runtime/ROTEAMENTO.md` (4 níveis + 4 regras), `runtime/FALHAS.md` (linha real: doctor lia só stdout), `runtime/LIMITES.md`, `AGENTS.md`, `CLAUDE.md`, `.claude/settings.json` (deny `rm -rf`, `git push --force`, `git push -f`, `git reset --hard`; `enabledMcpjsonServers: ["ponte-modelo"]`), `.mcp.json`, `.claude/agents/{planejador,executor,revisor}.md`, `runtime/exemplos/*`, `runtime/exemplos/goal-exemplo.md`, receitas R1–R6.
Mods: `runtime/mods/runtime-guarda` (colisão + raio, ligada no kit) e `runtime/mods/runtime-painel` (opcional, `/painel`) — receita `R7-guarda-e-painel.md`, provas no CHANGELOG 0.3.0.
O execução-longa é citado como link `https://github.com/inematds/execucao-longa` (é o que o kit linka).

## Mapa do curso (CONGELADO — títulos h2 dos tópicos = títulos no índice da trilha)

Cada módulo: 6 tópicos, `~35 min`, nível entre parênteses. Emoji do card entre colchetes.

### T1 · 🧭 Descobrir (emerald) — nav "Descobrir"
- **1.1 [🧭] Engenharia reversa não é produto** — "Técnica, não produto" · Fundamento
  1. Veja o que os vídeos de mods mostraram
  2. Separe descoberta de produto
  3. Conheça as vias oficiais de hoje
  4. Entenda o que é o kit
  5. Percorra o ciclo de sete etapas
  6. Conheça a Clara, a Sônia e o mapa do curso
- **1.2 [🩺] Instalar e diagnosticar** — "doctor diz PRONTO" · Prático
  1. Confira o que você precisa ter
  2. Clone o kit na sua máquina
  3. Rode o diagnóstico
  4. Leia cada linha do doctor
  5. Veja como os dois agentes leem as mesmas regras
  6. Faça o primeiro pedido ao agente
- **1.3 [🪜] A escada das vias** — "A mais alta que existir" · Fundamento
  1. Suba os sete degraus da escada
  2. Entenda por que estabilidade manda
  3. Exija teste antes do "não dá"
  4. Suba a escada com o ERP da Sônia
  5. Suba a escada com a agenda da Clara
  6. Suba a escada com o seu sistema
- **1.4 [🗺️] O mapa de capacidades** — "Sem linha, sem uso" · Prático
  1. Leia as colunas do CAPACIDADES.md
  2. Entenda as duas linhas que já vêm prontas
  3. Use os exemplos para copiar
  4. Preencha o mapa com o agente
  5. Só deixe entrar linha testada
  6. Olhe o software antes de dizer impossível

### T2 · 🔌 Conectar (blue) — nav "Conectar"
- **2.1 [🤝] Claude usa o Codex** — "Uma ponte por CLI" · Prático (receita R1)
  1. Entenda a ponte codex-exec
  2. Teste a ponte sozinha
  3. Peça uma segunda opinião de dentro do Claude
  4. Deixe o Codex alterar arquivos
  5. Veja a política recusar o perigoso
  6. Ajuste modelo, tempo e erros comuns
- **2.2 [🔌] Sua primeira ponte MCP** — "Arquivo vira ferramenta" · Prático (receita R3)
  1. Entenda o que é MCP
  2. Conheça as duas ferramentas da ponte-modelo
  3. Teste a ponte sozinha
  4. Conecte a ponte ao Claude Code
  5. Use a ferramenta pelo agente
  6. Conecte a mesma ponte ao Codex
- **2.3 [🏗️] A ponte do seu sistema** — "Troque o CSV, mantenha a regra" · Prático (R3 passo 4)
  1. Ache a exportação do seu sistema
  2. Aponte a ponte para os seus arquivos
  3. Troque as colunas com a ajuda do agente
  4. Mantenha a ponte só de leitura
  5. Confira o resumo da Sônia na mão
  6. Registre a ponte no CAPACIDADES.md
- **2.4 [🌐] Navegador com política** — "Ler pode, pagar nunca" · Prático (receita R5)
  1. Use o navegador só como penúltimo recurso
  2. Instale o navegador para agentes
  3. Teste só a leitura
  4. Peça ao agente com limite escrito
  5. Cole as regras do navegador no AGENTS.md
  6. Lembre que login é com você

### T3 · ⚙️ Rotear e executar (purple) — nav "Rotear e executar"
- **3.1 [🎚️] Modelo certo, cota rende** — "Comece pelo menor" · Fundamento (ROTEAMENTO.md)
  1. Entenda por que cota não é dólar
  2. Leia os quatro níveis de modelo
  3. Comece pelo menor que resolve
  4. Peça revisão a outro modelo
  5. Monte time só quando compensa
  6. Mantenha a tabela atualizada
- **3.2 [👥] Time de três papéis** — "Planeja, faz, confere" · Prático (receita R2)
  1. Conheça o planejador, o executor e o revisor
  2. Leia os arquivos dos papéis
  3. Rode o time pela tela do Claude
  4. Rode o time sem abrir a tela
  5. Use o time no seu trabalho
  6. Troque modelos e crie papéis
- **3.3 [🧵] Time em segundo plano** — "O Threads oficial" · Prático (receita R4)
  1. Entenda a versão oficial das sessões paralelas
  2. Marque a pasta como confiável
  3. Solte as sessões em segundo plano
  4. Acompanhe com o observar
  5. Entre, leia e pare uma sessão
  6. Junte os resultados sem estourar a cota
- **3.4 [🎯] Agente longo com verificação** — "Pronto é prova, não palpite" · Prático (receita R6)
  1. Entenda por que o agente acha que terminou
  2. Escreva critérios comando → saída
  3. Rode o verificar no goal de exemplo
  4. Quebre um critério de propósito
  5. Rode o agente até passar
  6. Coloque portões humanos e anote falhas

### T4 · 🛡️ Governar e aprender (amber) — nav "Governar e aprender"
- **4.1 [🚦] Política de autonomia** — "Prepara e pede" · Fundamento (POLITICA.md)
  1. Leia os cinco níveis de autonomia
  2. Use o teto por tipo de ação
  3. Entenda por que "sempre permitir" tem teto
  4. Veja o bloqueio no Claude Code
  5. Aplique a política no Codex
  6. Siga as três regras de integração
- **4.2 [📚] O agente propõe, você aprova** — "Regra nova só com seu sim" · Prático
  1. Entenda por que o agente não muda as próprias regras
  2. Preencha a tabela Aprendizado
  3. Promova o aprovado para as Lessons
  4. Anote cada falha em uma linha
  5. Anote o que o ambiente barrou
  6. Faça a revisão da semana com o agente
- **4.3 [🧱] Guarda e painel** — "Pergunta antes do estrago" · Prático (receita R7)
  1. Entenda o que é um mod do Claude Code
  2. Veja a guarda de colisão em ação
  3. Prove o raio antes de apagar
  4. Leve a guarda para outro projeto
  5. Abra o painel do time
  6. Leia o código antes de instalar um mod
- **4.4 [🧪] Laboratório e projeto final** — "Sua ponte e seu time" · Projeto
  1. Volte à escada antes do laboratório
  2. Trate engenharia reversa como laboratório
  3. Respeite termos de uso e credenciais
  4. Escolha seu sistema e preencha o mapa
  5. Construa a ponte e rode o time
  6. Entregue com o verificar e uma lição aprovada

## Arquivos e montagem (NÃO escrever `<head>`, nav nem rodapé à mão)

Cada página é montada por `python3 scripts/montar.py` a partir de partes:
- `context/partes/` — cabeça, nav e cauda compartilhadas (NINGUÉM edita além do autor do curso).
- Corpo de módulo: `context/corpos/modulo-X-Y.html`. Começa em `<nav aria-label="Trilha de navegação"` e termina no fechamento `</div>` do grid (depois de `</aside>`). Depois do corpo, opcionalmente, uma linha `<!--CHECKS-->` seguida de JS puro com as chamadas `INEMA.registerCheck(...)` (sem `<script>`).
- Corpo de índice de trilha: `context/corpos/trilhaN.html`. Começa em `<header` e termina depois do último modal.
- Primeira linha de todo corpo: `<!--TITLE: <título da aba sem o sufixo> -->`.
- Módulo-modelo (CONGELADO, só ler): `context/corpos/modulo-1-1.html`. Índice-modelo (CONGELADO): `context/corpos/trilha1.html`. Copiar padrões cortando por marcador de texto, nunca por número de linha.

## Regras de cada módulo

- 500–850 linhas no HTML montado (≈ 330–700 linhas de corpo). 6 `<section id="topico-N" data-inema-topic="modulo-X-Y#topico-N">`, EXATAMENTE 6.
- Cada seção: círculo numerado grande, h2 = título do mapa acima (idêntico), botão "Tenho dúvida" (`data-inema-doubt-toggle`), parágrafos com `data-inema-block="mX-Y-tN-pK"`, botão "Marcar como lido" no fim com `flex justify-start`.
- VARIEDADE por módulo: ≥2 grids ✓/✗ ou comparação, ≥1 timeline (passos numerados), ≥2 tip boxes (`bg-primary/10 border-primary/30`), tabela quando couber, ≥1 box "🆕 Novo aqui?" definindo termo na 1ª aparição, grid de 4 mini-cards "conceitos-chave" na maioria das seções, 1 box de alerta vermelho quando fizer sentido.
- **SVG:** ≥2 SVGs inline por módulo (visual-first). Estilo do modelo: grid de pontos, glow `stdDeviation="1.8"` só na caixa-foco, `font-family="Inter,sans-serif"`, `role="img"` + `aria-label` descritivo, `class="w-full h-auto"`, **ids prefixados pelo módulo** (ex.: `m23-grid`, `m23b-arrow`). Animação só com as classes `wf-a`/`wf-flow`. Logo abaixo de cada SVG: `<p class="text-sm text-neutral-400 mb-6"><strong class="text-neutral-300">Como ler o desenho:</strong> …</p>`.
- **Terminal:** comando copiável num code box "copy-run" (ver modelo, tópico 3): cabeçalho "🎯 Objetivo: …", instrução de onde rodar, `<pre class="font-mono …">` com o comando REAL (só da tabela de comandos permitidos), rodapé "Como verificar:". Saída real (Tier A) pode aparecer num segundo `<pre>` com rótulo "Saída real (05/10/2026)". Tier C: rótulo "Resultado esperado (pela receita)" e o texto da Prova, sem fingir terminal.
- Snippet do code box de terminal (trocar a cor da trilha; T1 = emerald):
```html
      <div class="bg-dark-800 rounded-xl border border-emerald-500/30 overflow-hidden mb-6">
        <div class="px-5 py-3 bg-emerald-900/20 border-b border-emerald-500/30"><span class="text-emerald-400 font-semibold text-sm">🎯 Objetivo: saber o que está instalado e logado</span></div>
        <div class="p-5">
          <p class="text-sm text-neutral-400 mb-3">No terminal, dentro da pasta do kit:</p>
          <pre class="font-mono text-sm text-neutral-200 whitespace-pre-wrap bg-dark-900/60 rounded-lg p-4 border border-dark-600">node runtime/scripts/doctor.mjs</pre>
          <p class="text-xs text-neutral-500 mt-4 mb-2">Saída real (05/10/2026, Linux):</p>
          <pre class="font-mono text-xs text-neutral-400 whitespace-pre-wrap bg-dark-900/60 rounded-lg p-4 border border-dark-600">node    ok        24.13.0
...
PRONTO: siga para runtime/receitas/R1-claude-usa-codex.md</pre>
        </div>
        <div class="px-5 py-3 bg-dark-700/40 border-t border-dark-600 text-neutral-300 text-sm"><strong class="text-emerald-400">Como verificar:</strong> a última linha começa com <code>PRONTO</code>. Se aparecer <code>FALTA</code>, veja o tópico 4.</div>
      </div>
```
  Para prompt de agente, o mesmo box com "Abra <code>claude</code> na pasta do kit e cole:" e o prompt no `<pre>`.
  Para Tier B/C, troque "Saída real" por "Resultado provado no CHANGELOG 0.x.0:" e escreva só o que o CHANGELOG/receita diz.
- Escapar `<` e `>` dentro de `<pre>` como `&lt;` `&gt;`. Variáveis como `&lt;assim&gt;`.
- 1 checagem leve por módulo (`data-inema-check="modulo-X-Y#q1"`, 3 opções) + `INEMA.registerCheck` depois de `<!--CHECKS-->`, com explicação por opção.
- TOC lateral (`data-inema-toc`) com os 6 tópicos, títulos curtos.
- Meter do módulo no header (`data-inema-meter="modulo:X-Y"`, "0 de 6").
- Resumo final (5 ✓), "Próximo módulo", botões ← trilha / próximo →. Último módulo da trilha aponta para `../trilhaN+1/index.html`; o 4.4 aponta para `../../index.html` ("Voltar ao início").
- Breadcrumb: Início / Trilha N / Módulo X.Y.

## Regras do índice de trilha

Copiar `context/corpos/trilha1.html`: header com gradiente + hero SVG novo (tema da trilha, ids `tNh-…`) + stats (4 Módulos, 24 Tópicos, ~2h20, Nível) + meter `trilha:N` ("0 de 24"); "Mapa da trilha" (4 cards-âncora, subtítulo PUNCHY = o texto entre aspas do mapa, emoji no título, `~35 min`); h2 "Conteúdo detalhado"; um card por módulo com `id="modulo-X-Y" data-inema-module data-inema-track`, meter do módulo, 6 tópicos expansíveis (círculo numerado, emoji, título = MESMO título do h2, subtítulo curto, 3 partes "O que é / Por que aprender / Conceitos-chave", `aria-expanded`/`aria-controls` → `id="tN-X-Y"` com N = número do tópico, ex. `t3-2-4`), botões "Ver em Modal" e "Ver Completo" à esquerda (`justify-start`); navegação ← trilha anterior / próxima trilha →; modais com iframe (um por módulo).

## Cores

| Trilha | Tailwind | SVG primária | claro | fill caixa-foco |
|---|---|---|---|---|
| T1 | emerald | `#34d399` | `#a7f3d0` | `#0e2018` |
| T2 | blue | `#60a5fa` | `#bfdbfe` | `#0f1b33` |
| T3 | purple | `#c084fc` | `#e9d5ff` | `#1e1233` |
| T4 | amber | `#fbbf24` | `#fde68a` | `#2a1d06` |

Ciano `#38bdf8` (claro `#bae6fd`, fill `#0b1f2e`) é sempre a secundária. Vermelho de alerta: stroke `#f87171`, fill `#2a0f0f`, texto `#fca5a5`.
Botão sólido: `bg-<cor>-600 hover:bg-<cor>-500 text-white`.
