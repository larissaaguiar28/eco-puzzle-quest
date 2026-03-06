
# Atualização de 3 Páginas: Feed, Jogos e Perfil

## 1. Feed de Noticias - Redesign Completo

**Mudancas na estrutura de dados:**
- Adicionar campos: `subtitle`, `location`, `imageUrl` (placeholder) a cada noticia
- Todos os autores passam a ser "Eco'S" com iniciais "ES"
- Manter campos existentes: title, summary, date, category, reactions, comments

**Novo layout de cada card de noticia:**
- Area de imagem placeholder no topo (fundo cinza com icone de imagem, altura fixa ~200px)
- Badge de categoria no canto da imagem
- Abaixo da imagem: titulo em destaque (font-bold, text-lg)
- Subtitulo em texto medio (text-sm, muted)
- Linha com autor "Eco'S" + data + localizacao (com icone MapPin)
- Resumo/descricao do conteudo
- Barra de reacoes e comentarios (manter logica existente)

**Filtro por palavras-chave:**
- Adicionar campo de busca (Input com icone Search) acima do feed
- Filtrar dinamicamente por titulo, subtitulo e resumo
- Combinar com filtro de categoria existente
- Responsivo: funciona em mobile e desktop

**Dados das noticias atualizados:**
- Adicionar subtitulo e localizacao a todas as 6 noticias existentes

## 2. Pagina de Jogos - Redesign Gamer Premium

**Secao Hero com Carrossel (topo):**
- Carrossel ocupando ~60% da largura (lado esquerdo) com jogos ficticios
- Cada slide: imagem placeholder com overlay escuro em degrade, titulo e descricao do jogo
- Indicadores de slide (bolinhas) abaixo do carrossel
- Transicao suave automatica + manual
- Lado direito (~40%): card de "jogo em destaque" ou informacao adicional

**Secao de Perfil do Jogador (abaixo):**
- Avatar do usuario com nome da conta
- Nivel da conta com barra de progresso visual (Progress component)
- XP atual / XP necessario para proximo nivel
- Layout em card com bordas arredondadas (rounded-2xl)

**Insignias do Jogador:**
- Icones circulares em linha horizontal
- Cada insignia com icone, nome e tooltip (usando Tooltip component existente)
- Scroll lateral se necessario (overflow-x-auto)
- Insignias tematicas de sustentabilidade (ex: Guardiao da Floresta, Mestre da Reciclagem)

**Design geral:**
- Bordas arredondadas (16px), sombras suaves
- Estetica gamer premium com animacoes framer-motion
- Efeitos hover elegantes nos cards
- Responsivo desktop-first

## 3. Pagina de Perfil - Fundo Gradiente

**Fundo da pagina:**
- Gradiente vertical de 3 cores:
  - Topo: bege (#d4a373 / beige-start)
  - Meio: azul celeste (#87CEEB / light sky blue)
  - Baixo: verde fantasma (~#c8e6c9 / ghost green)
- Aplicado como background no container principal
- Cards mantem fundo branco/card para contraste e legibilidade

## Detalhes Tecnicos

**Arquivos modificados:**
- `src/pages/home/NewsFeed.tsx` - Redesign completo com busca, novos campos, layout profissional
- `src/pages/home/Games.tsx` - Reescrita total com carrossel, perfil gamer, insignias
- `src/pages/home/Profile.tsx` - Adicionar gradiente de fundo tricolor

**Dependencias utilizadas (ja instaladas):**
- framer-motion (animacoes e carrossel)
- lucide-react (icones)
- recharts (nao necessario aqui)
- Radix UI Tooltip, Progress (ja disponiveis)
- embla-carousel-react (disponivel mas usarei framer-motion para simplicidade)
