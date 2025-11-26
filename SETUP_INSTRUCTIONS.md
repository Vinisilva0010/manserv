# Instruções de Configuração - LMS Gamificado

## 1. Instalação de Dependências

Execute o seguinte comando no terminal:

```bash
npm install @supabase/supabase-js @supabase/ssr lucide-react clsx tailwind-merge class-variance-authority framer-motion
```

ou com yarn:

```bash
yarn add @supabase/supabase-js @supabase/ssr lucide-react clsx tailwind-merge class-variance-authority framer-motion
```

ou com pnpm:

```bash
pnpm add @supabase/supabase-js @supabase/ssr lucide-react clsx tailwind-merge class-variance-authority framer-motion
```

## 2. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Onde encontrar essas variáveis:**
1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Settings** > **API**
3. Copie a **URL** do projeto e cole em `NEXT_PUBLIC_SUPABASE_URL`
4. Copie a **anon/public key** e cole em `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Estrutura Criada

Os seguintes arquivos foram criados:

- ✅ `src/utils/supabase/client.ts` - Cliente Supabase para o browser
- ✅ `src/utils/supabase/server.ts` - Cliente Supabase para o servidor (SSR)
- ✅ `src/middleware.ts` - Middleware para gerenciar sessões
- ✅ `src/app/globals.css` - Estilos globais com tema dark mode corporativo
- ✅ `src/components/ui/button.tsx` - Componente Button reutilizável
- ✅ `src/lib/utils.ts` - Utilitário para merge de classes (cn)

## 4. Configuração do Tailwind (se necessário)

Certifique-se de que seu `tailwind.config.ts` ou `tailwind.config.js` inclua:

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // ... outras cores definidas no globals.css
      },
    },
  },
  plugins: [],
}
export default config
```

## 5. Uso do Componente Button

```tsx
import { Button } from "@/components/ui/button"

// Variantes disponíveis: primary, secondary, outline, ghost, destructive, success, link
// Tamanhos disponíveis: default, sm, lg, icon

<Button variant="primary" size="default">
  Clique aqui
</Button>
```

## 6. Classes Utilitárias CSS

- `.glass` - Efeito glassmorphism básico
- `.glass-strong` - Efeito glassmorphism mais forte
- `.neon-glow` - Brilho neon verde
- `.neon-glow-strong` - Brilho neon verde intenso
- `.text-glow` - Texto com brilho neon
- `.scrollbar-custom` - Scrollbar customizada

## 7. Próximos Passos

1. Configure suas variáveis de ambiente no `.env.local`
2. Teste a conexão com o Supabase
3. Configure as rotas de autenticação
4. Comece a desenvolver os componentes do LMS

