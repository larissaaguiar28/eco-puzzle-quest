

# Plano: Botão flutuante do Chatbot + Correção de build

## 1. Corrigir erro de build no Dashboard.tsx
O erro é causado pelo `type: "spring"` sendo inferido como `string` em vez do literal. Solução: usar `as const` no objeto `itemVariants`.

**Linha 25-28 de `Dashboard.tsx`:** Adicionar `as const` ao final da definição de `itemVariants`.

## 2. Criar componente FloatingChatbot
Novo arquivo `src/components/home/FloatingChatbot.tsx`:
- Botão flutuante fixo no canto inferior direito (`fixed bottom-6 right-6`)
- Ícone `Bot` do lucide-react
- Animação de escala/pulse com framer-motion
- Ao clicar, navega para `/home/chatbot` usando `useNavigate`
- Tooltip ou label "EcoBot" ao hover
- Estilo verde gradiente consistente com o tema

## 3. Adicionar FloatingChatbot no HomeLayout
Em `src/layouts/HomeLayout.tsx`, importar e renderizar `<FloatingChatbot />` ao lado do `<Outlet />`, garantindo que aparece em todas as páginas da Home.

O botão não será exibido quando já estiver na página `/home/chatbot` (verificar rota atual com `useLocation`).

