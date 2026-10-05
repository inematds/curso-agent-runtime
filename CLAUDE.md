# CLAUDE.md — curso-agent-runtime

Curso "INEMA Agent Runtime — faça qualquer IA usar qualquer ferramenta" no formato `formato-curso-v2` (4 trilhas × 4 módulos × 6 tópicos). courseId `agrt`. Ensina a usar o kit `inematds/inema-agent-runtime`.

- Regras, mapa congelado e lista de comandos permitidos: `context/SPEC.md`. Todo comando do curso tem de existir no kit e ter prova (CHANGELOG do kit).
- As páginas PT são **montadas**: edite `context/corpos/*.html` e rode `python3 scripts/montar.py` e `python3 scripts/lint.py` (precisa `LINT OK`). Não edite `curso/**/*.html` nem `index.html` à mão (são sobrescritos).
- Cabeça, nav e scripts comuns: `context/partes/` + `scripts/montar.py`. O manifesto sai do `TRILHAS` do montar.py.
- EN/ES: `en/` e `es/`, gerados por `~/projetos/wifi/scripts/traduz-pagina-codex.py` (Codex pela assinatura, `gpt-6-luna`), cache em `i18n/`. Depois de mudar o PT, rodar de novo o tradutor (só reenvia texto novo).
- Sem API externa sem autorização explícita.
- Conta git: `inematds <inematds@gmail.com>`. Publicar = push; GitHub Pages serve da raiz (main).

## Self-learning

When I correct you, or you catch yourself making a mistake: before continuing, add the lesson as a one-line rule under ## Lessons, so it never happens again.

## Lessons

- Agentes paralelos copiam dos modelos congelados (`context/corpos/modulo-1-1.html`, `trilha1.html`) por marcador de texto, nunca por número de linha; ninguém edita o modelo durante o lote.
