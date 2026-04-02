# Rotina de Testes de Sistema: S001 - Verificar as Postagens de Notícias

**Objetivo:** Verificar a listagem das notícias, inspecionar o conteúdo de cada uma, validar interações (reações) e garantir que a postagem está sendo realizada corretamente e exibida na ordem correta no feed.

---

## 1. Cenário: Publicar Notícias (Cenário Positivo)
**Descrição:** Validar que um usuário logado pode publicar uma nova notícia com sucesso.

| Passo | Ação | Dados de Entrada | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|---|
| 1 | Clicar no botão "Publicar Notícia" | - | O modal de criação de notícia deve ser exibido. | | |
| 2 | Preencher os campos obrigatórios | Título: "Teste de Notícia", Categoria: "Energia Solar", Resumo: "Resumo do teste", Localização: "Brasil", Conteúdo: "Conteúdo detalhado da notícia de teste." | Os campos devem aceitar os dados inseridos. | | |
| 3 | Clicar em "Publicar" | - | O modal deve fechar, os campos devem ser limpos e a notícia deve aparecer no topo do feed. | | |

---

## 2. Cenário: Reagir às Notícias
**Descrição:** Validar que o usuário pode reagir às notícias (Like, Coração, Ideia).

| Passo | Ação | Dados de Entrada | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|---|
| 1 | Clicar no ícone de "Like" (Polegar) | - | O contador de likes deve incrementar em 1 e o ícone deve mudar de cor. | | |
| 2 | Clicar no ícone de "Coração" | - | O contador de corações deve incrementar em 1 e o ícone deve mudar de cor. | | |
| 3 | Clicar no ícone de "Lâmpada" (Ideia) | - | O contador de ideias deve incrementar em 1 e o ícone deve mudar de cor. | | |
| 4 | Clicar novamente em uma reação já realizada | - | O contador deve decrementar em 1 e a reação deve ser removida. | | |

---

## 3. Cenário: Listagem e Ordenação
**Descrição:** Validar que as notícias são listadas corretamente e ordenadas pela mais recente.

| Passo | Ação | Dados de Entrada | Resultado Esperado | Resultado Obtido | Status |
|---|---|---|---|---|---|
| 1 | Acessar o Feed de Notícias | - | As notícias devem ser carregadas do banco de dados e exibidas em cards. | | |
| 2 | Observar a ordem das notícias | - | A notícia publicada mais recentemente deve estar no topo da lista. | | |
| 3 | Expandir uma notícia | Clicar no título da notícia | O card deve expandir exibindo o conteúdo completo e a imagem (se houver). | | |

---

## 4. Cenários Negativos / Comportamento Inesperado

### 4.1 Postagem sem estar logado
**Descrição:** Validar que um usuário não logado não consegue publicar notícias.
*   **Passos:** Tentar acessar a funcionalidade de postagem sem autenticação.
*   **Resultado Esperado:** O botão de publicar não deve disparar a ação ou deve redirecionar/exibir alerta.

### 4.2 Reação sem estar logado
**Descrição:** Validar que um usuário não logado recebe alerta ao tentar reagir.
*   **Passos:** Clicar em qualquer reação sem estar logado.
*   **Resultado Esperado:** Um alerta com a mensagem "Você precisa estar logado!" deve ser exibido.

### 4.3 Campos Vazios na Publicação
**Descrição:** Tentar publicar sem preencher campos.
*   **Passos:** Abrir modal, deixar campos vazios e clicar em "Publicar".
*   **Resultado Esperado:** O sistema deve validar os campos obrigatórios e não permitir o envio ao banco.

---

## Riscos Mitigados
- [x] Usuário não logado conseguir acessar ou postar
- [x] Usuário logado não conseguir visualizar notícias
- [x] Notícias sem conteúdo
- [x] Reações não funcionarem
- [x] Ordem do feed incorreta
