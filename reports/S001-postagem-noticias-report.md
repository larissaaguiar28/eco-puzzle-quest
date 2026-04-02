# Relatório de Testes de Sistema: S001 - Verificar as Postagens de Notícias

**Data de Execução:** 2026-04-01
**Responsável:** Antigravity AI
**Ambiente:** Vitest + React Testing Library

---

## Sumário
| ID do Caso | Descrição | Status | Observações |
|---|---|---|---|
| CT-001 | Publicar notícias (Logado) | **PASS** | Modal funciona, campos validam e envio ao Supabase mockado. |
| CT-002 | Reagir às notícias (Logado) | **PASS** | Interação com reações (Like) funcionando com contador. |
| CT-003 | Verificar listagem e ordenação | **PASS** | Notícias listadas corretamente, mais recente no topo. |
| CT-004 | Reagir sem login | **PASS** | Alerta de "Você precisa estar logado!" exibido. |

---

## Detalhamento dos Casos de Teste

### CT-001: Publicar Notícias
**Descrição:** Validar que um usuário logado pode publicar uma nova notícia.
- **Entrada:** Título, Categoria, Resumo, Localização, Conteúdo.
- **Resultado Esperado:** Chamada ao banco de dados e fechamento do modal.
- **Resultado Obtido:** Sucesso. O teste confirmou a chamada à API do Supabase.
- **Status:** PASS

### CT-002: Reagir às Notícias
**Descrição:** Validar que o usuário pode reagir às notícias.
- **Entrada:** Clique no botão de Like.
- **Resultado Esperado:** Incremento visual e persistência no banco.
- **Resultado Obtido:** Sucesso. O componente reagiu à interação e disparou a ação de persistência.
- **Status:** PASS

### CT-003: Listagem e Ordenação
**Descrição:** Verificar se as notícias aparecem no feed ordenadas por data.
- **Entrada:** Carregamento inicial da página.
- **Resultado Esperado:** Notícia com data mais recente aparece primeiro.
- **Resultado Obtido:** Sucesso. A ordenação no DOM seguiu o padrão esperado.
- **Status:** PASS

### CT-004: Segurança (Cenário Negativo)
**Descrição:** Impedir reações de usuários não autenticados.
- **Entrada:** Clique em reação sem sessão ativa.
- **Resultado Esperado:** Alerta informativo ao usuário.
- **Resultado Obtido:** Sucesso. O `window.alert` foi disparado corretamente.
- **Status:** PASS

---

## Conclusão
A funcionalidade de postagem de notícias está estável e cumpre os requisitos de aceitação. Os fluxos críticos de publicação, reação e visualização foram validados via testes automatizados.
