# 🧪 Plano de Testes — Jogos da Plataforma Eco Puzzle Quest

> **Projeto:** Eco Puzzle Quest  
> **Responsável:** Equipe de QA  
> **Data:** 01/04/2026  
> **Versão:** 1.0  

---

## 📌 1. Objetivo

Avaliar se os jogos da plataforma estão **funcionais e sem a ocorrência de erros**, garantindo que o usuário consiga acessar, interagir e concluir cada jogo disponível de forma satisfatória.

---

## 📋 2. Pré-condições

| # | Pré-condição |
|---|-------------|
| 1 | O usuário **deve estar logado** no site para poder jogar. |
| 2 | O navegador deve ser compatível (Chrome, Firefox, Edge — versões recentes). |
| 3 | Conexão com a internet estável. |
| 4 | O ambiente de teste deve estar disponível e acessível. |

---

## ✅ 3. Pós-condições

| # | Pós-condição |
|---|-------------|
| 1 | **Satisfação do usuário** depois de ter jogado o jogo. |
| 2 | **Aprendizado do usuário** sobre temas sustentáveis abordados em cada jogo. |
| 3 | Pontuação registrada corretamente ao final da partida. |

---

## 🎯 4. Critérios de Aceitação

| # | Critério |
|---|---------|
| 1 | Experiência **positiva** ao ter jogado. |
| 2 | **Aprendizado do usuário** sobre sustentabilidade e meio ambiente. |
| 3 | O jogo deve carregar sem erros visuais ou funcionais. |
| 4 | A mecânica de cada jogo deve funcionar conforme o esperado. |
| 5 | A pontuação deve ser calculada e exibida corretamente. |

---

## ⚠️ 5. Riscos

| # | Risco | Impacto |
|---|-------|---------|
| 1 | Jogo estar **mal otimizado**, causando lentidão ou travamentos. | Experiência negativa para o usuário. |
| 2 | Falhas de carregamento de assets (imagens, sons). | Jogo incompleto ou inutilizável. |
| 3 | Incompatibilidade entre navegadores. | Jogos não funcionam para parte dos usuários. |
| 4 | Perda de sessão durante o jogo. | Progresso perdido e frustração do usuário. |

---

## 🧩 6. Estratégias

| Estratégia | Descrição |
|-----------|-----------|
| **Dinâmico** | Testes executados com a aplicação em execução, simulando interações reais do usuário. |
| **Caixa Branca** | Análise do comportamento interno dos jogos, verificando lógica de pontuação, estados e transições. |

---

## 🔬 7. Método

| Método | Descrição |
|--------|-----------|
| **Exploratório** | Os testes serão conduzidos de forma exploratória, navegando pelos jogos e identificando comportamentos inesperados, falhas visuais e problemas de usabilidade sem scripts rígidos pré-definidos. |

---

---

# 🎮 Cenários de Teste

## `describe` ("A001 - Descrever a experiência do usuário ao jogar")

> **Suíte de testes de aceitação** para validar que cada jogo da plataforma é jogável, funcional e proporciona uma experiência positiva ao usuário.

---

### `it` ("Memória Sustentável")

| Campo | Detalhe |
|-------|---------|
| **Tipo** | Aceitação |
| **Entrada** | Jogo da Memória: o usuário deve clicar nas imagens que se correlacionam para poder pontuar. |
| **Saída Esperada** | Usuário conseguir jogar e finalizar o jogo. |

**Rotina de Teste:**

```
1. O usuário realiza login na plataforma com credenciais válidas.
2. O usuário navega até a seção de jogos e seleciona "Memória Sustentável".
3. O jogo carrega completamente sem erros visuais ou de console.
4. O usuário clica em uma carta — ela deve virar e exibir a imagem.
5. O usuário clica em uma segunda carta:
   a. Se as imagens se correlacionam → as cartas permanecem viradas e a pontuação é incrementada.
   b. Se as imagens NÃO se correlacionam → as cartas voltam ao estado original.
6. O usuário repete o processo até encontrar todos os pares.
7. Ao finalizar, uma tela de conclusão é exibida com a pontuação final.
8. RESULTADO ESPERADO: O jogo é concluído com sucesso, sem travamentos ou erros.
```

---

### `it` ("Oceano Limpo")

| Campo | Detalhe |
|-------|---------|
| **Tipo** | Aceitação |
| **Entrada** | Oceano: o usuário deve coletar os lixos sem encostar nos animais para poder pontuar sem perder pontos de vida. |
| **Saída Esperada** | Usuário conseguir jogar e finalizar o jogo. |

**Rotina de Teste:**

```
1. O usuário realiza login na plataforma com credenciais válidas.
2. O usuário navega até a seção de jogos e seleciona "Oceano Limpo".
3. O jogo carrega completamente — cenário do oceano é exibido com lixos e animais.
4. O usuário movimenta o personagem/cursor para coletar os itens de lixo no oceano.
5. Ao coletar um lixo → a pontuação é incrementada.
6. Ao encostar em um animal → pontos de vida são decrementados.
7. O usuário continua coletando lixos, desviando dos animais marinhos.
8. Se os pontos de vida chegam a zero → tela de "Game Over" é exibida.
9. Se o usuário coleta todos os lixos com vida restante → tela de vitória é exibida com pontuação final.
10. RESULTADO ESPERADO: O jogo é concluído com sucesso, sem travamentos ou erros.
```

---

### `it` ("Energia Verde")

| Campo | Detalhe |
|-------|---------|
| **Tipo** | Aceitação |
| **Entrada** | Cidade: o usuário tem que responder corretamente as perguntas optativas para poder acender o cenário e assim pontuar. |
| **Saída Esperada** | Usuário conseguir jogar e finalizar o jogo. |

**Rotina de Teste:**

```
1. O usuário realiza login na plataforma com credenciais válidas.
2. O usuário navega até a seção de jogos e seleciona "Energia Verde".
3. O jogo carrega completamente — cenário de uma cidade escura/apagada é exibido.
4. Uma pergunta de múltipla escolha sobre energia sustentável é apresentada.
5. O usuário seleciona uma das alternativas:
   a. Se a resposta está CORRETA → parte do cenário da cidade acende e a pontuação é incrementada.
   b. Se a resposta está INCORRETA → o cenário permanece apagado; feedback de erro é exibido.
6. Novas perguntas são apresentadas sequencialmente.
7. Ao responder todas as perguntas, a cidade está completamente iluminada (se todas corretas).
8. Tela de conclusão é exibida com a pontuação final e o nível de iluminação alcançado.
9. RESULTADO ESPERADO: O jogo é concluído com sucesso, sem travamentos ou erros.
```

---

### `it` ("Recicla Quest")

| Campo | Detalhe |
|-------|---------|
| **Tipo** | Aceitação |
| **Entrada** | Coleta: o usuário tem que acertar cada item correspondente na sua lixeira. |
| **Saída Esperada** | Usuário conseguir jogar e finalizar o jogo. |

**Rotina de Teste:**

```
1. O usuário realiza login na plataforma com credenciais válidas.
2. O usuário navega até a seção de jogos e seleciona "Recicla Quest".
3. O jogo carrega completamente — lixeiras coloridas e itens de reciclagem são exibidos.
4. Um item de lixo é apresentado ao usuário (ex.: garrafa PET, papel, vidro, orgânico).
5. O usuário arrasta/clica para depositar o item na lixeira correspondente:
   a. Se o item é depositado na lixeira CORRETA → pontuação é incrementada; feedback positivo.
   b. Se o item é depositado na lixeira INCORRETA → feedback de erro; pontuação não é incrementada.
6. Novos itens são apresentados em sequência.
7. Ao classificar todos os itens, a tela de conclusão é exibida com a pontuação final.
8. RESULTADO ESPERADO: O jogo é concluído com sucesso, sem travamentos ou erros.
```

---

### `it` ("Guardião da Floresta")

| Campo | Detalhe |
|-------|---------|
| **Tipo** | Aceitação |
| **Entrada** | Plantar: o usuário tem que clicar na barra no tempo certo para assim plantar uma árvore; dependendo da coloração, o tamanho da árvore será diferente. |
| **Saída Esperada** | Usuário conseguir jogar e finalizar o jogo. |

**Rotina de Teste:**

```
1. O usuário realiza login na plataforma com credenciais válidas.
2. O usuário navega até a seção de jogos e seleciona "Guardião da Floresta".
3. O jogo carrega completamente — cenário de terreno para plantio e uma barra de timing são exibidos.
4. Uma barra animada com diferentes faixas de coloração é apresentada (ex.: verde, amarelo, vermelho).
5. O usuário clica/pressiona no momento em que a barra está na faixa desejada:
   a. Faixa VERDE → árvore grande é plantada; pontuação máxima.
   b. Faixa AMARELA → árvore média é plantada; pontuação intermediária.
   c. Faixa VERMELHA → árvore pequena é plantada; pontuação mínima.
6. A árvore plantada é renderizada no cenário visualmente.
7. O processo se repete para múltiplas rodadas de plantio.
8. Ao final de todas as rodadas, a tela de conclusão é exibida com a pontuação total e a floresta formada.
9. RESULTADO ESPERADO: O jogo é concluído com sucesso, sem travamentos ou erros.
```

---

---

# 📊 Resumo dos Cenários

| # | Cenário | Jogo | Tipo | Status |
|---|---------|------|------|--------|
| A001.01 | Memória Sustentável | Jogo da Memória | Aceitação | 🔲 Pendente |
| A001.02 | Oceano Limpo | Coletar Lixo no Oceano | Aceitação | 🔲 Pendente |
| A001.03 | Energia Verde | Quiz de Energia | Aceitação | 🔲 Pendente |
| A001.04 | Recicla Quest | Classificação de Lixo | Aceitação | 🔲 Pendente |
| A001.05 | Guardião da Floresta | Plantar Árvores | Aceitação | 🔲 Pendente |

---

> **Observação:** Todos os cenários seguem o método **exploratório** e as estratégias **dinâmica** e **caixa branca**. Os testes devem ser executados com o usuário autenticado na plataforma.
