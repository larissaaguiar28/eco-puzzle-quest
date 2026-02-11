
# 🌍 Landing Page de Sustentabilidade - Plano de Implementação

## Visão Geral
Site educativo, interativo e dinâmico sobre sustentabilidade, com sistema de quizzes que recompensa o usuário com peças de um quebra-cabeça do planeta Terra. Layout com sidebar fixa à esquerda, largura máxima de 1366px, seções de 768px de altura, paleta em tons de verde natural com detalhes dourados/bege.

---

## 🎨 Design & Layout
- **Paleta**: Verde escuro (#1a4d2e), verde floresta (#2d6a4f), bege (#d4a373), dourado (#c9a227), fundo claro (#f5f5dc)
- **Sidebar**: Fixa à esquerda com fundo verde escuro semi-transparente, links para cada seção, ícones temáticos
- **Largura máxima**: 1366px | Altura por seção: 768px
- **Classes utilitárias**: `.row` (flex, align-center, gap), `.shadow` com efeitos hover/active

---

## 📋 Sidebar Interativa (lado esquerdo)
- Navegação com ícones para cada seção do site
- Indicador visual da seção ativa ao scrollar
- Fundo verde escuro com opacidade que combina com o tema
- Botão de colapsar/expandir

---

## 🧩 Sistema de Quizzes & Quebra-Cabeça
- **1 pergunta de múltipla escolha por seção** (6 seções = 6 quizzes)
- Perguntas relacionadas ao conteúdo de cada seção
- Ao acertar, o usuário ganha 1 peça do quebra-cabeça do **planeta Terra**
- Painel flutuante mostrando progresso (peças coletadas)
- Ao completar as 6 peças, animação de montagem do planeta com mensagem de parabéns

---

## 📄 Seções do Site

### 1. Hero - "Impactos Ambientais"
- Imagem de fundo: floresta saudável (floresta_bom.jpeg) em tela cheia
- Headline: "Impactos Ambientais" + subtítulo sobre sustentabilidade como necessidade
- Cards animados sobre energias renováveis (solar, eólica, hidrelétrica)
- Transição parallax alinhando com a imagem da seção 2
- **Quiz**: 1 pergunta sobre impactos ambientais

### 2. Escassez & Desmatamento
- Imagem de fundo: floresta em chamas (floresta_ruim.jpeg) com efeito parallax alinhado à seção anterior
- Dados estatísticos com porcentagens animadas (counters)
- Informações sobre escassez de recursos, consumo excessivo, desmatamento
- Demonstrar por que a plataforma é importante com dados comprobatórios
- **Quiz**: 1 pergunta sobre desmatamento/escassez

### 3. Mudanças Climáticas & Saúde
- Foco nas dores: riscos à saúde humana e impacto na vida marinha
- Cards com animações mostrando efeitos das mudanças climáticas
- Dados sobre aumento de temperatura, nível do mar, extinção de espécies
- **Quiz**: 1 pergunta sobre mudanças climáticas

### 4. CTA - Cadastro & Boas Práticas
- Formulário de login/registro animado (apenas frontend, sem backend)
- Seção com boas práticas: replantio, consumo eficiente, reciclagem
- Cards interativos com dicas práticas
- **Quiz**: 1 pergunta sobre boas práticas sustentáveis

### 5. Prova Social & Linha do Tempo
- Linha do tempo interativa sobre mineração excessiva e desmatamento ao longo dos anos
- Marcos históricos de impacto ambiental com animações ao scrollar
- **Quiz**: 1 pergunta sobre história do impacto ambiental

### 6. Problemas Contraditórios
- Conteúdo sobre agrotóxicos e seus malefícios
- Agropecuária predatória com **gráfico de rosca interativo** (Recharts)
- Assuntos impactantes e pouco divulgados para engajar o usuário
- **Quiz**: 1 pergunta sobre agrotóxicos/agropecuária

---

## ♿ Menu de Acessibilidade
- **Leitura em voz alta**: Usar Web Speech API para ler texto selecionado
- **Zoom**: Botões para aumentar/diminuir o tamanho da fonte na página
- **Modo daltônico**: Filtros CSS para diferentes tipos de daltonismo
- **Modo noturno**: Alternância dark/light mode
- Menu flutuante acessível em todas as seções

---

## ❓ Dúvidas Frequentes (FAQ)
- Accordion no final da página com perguntas e respostas sobre sustentabilidade e uso da plataforma

---

## 🎬 Animações & Interações
- Parallax entre seções 1 e 2 (floresta boa → floresta em chamas)
- Cards com hover effects e animações de entrada (fade-in, scale)
- Contadores animados para estatísticas
- Linha do tempo com scroll-triggered animations
- Gráfico de rosca interativo com Recharts
- Efeitos `.shadow`, `.shadow:hover`, `.shadow:hover:active` nos elementos interativos
