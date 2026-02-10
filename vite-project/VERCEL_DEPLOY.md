# Guia de Deploy no Vercel

## Preparação

Este projeto foi configurado para ser deployado no Vercel com:
- Frontend Vite + React
- Backend Express.js com segurança (helmet, rate-limit, CORS)

## Pré-requisitos

1. Conta no [Vercel](https://vercel.com)
2. Github/Gitlab/Bitbucket com o código enviado
3. Node.js 20+ instalado localmente

## Passo a Passo

### 1. Conectar ao Vercel

```bash
# Opção A: Via CLI (recomendado)
npm install -g vercel
vercel

# Opção B: Via Dashboard Vercel
# - Vá para https://vercel.com/dashboard
# - Clique "New Project"
# - Selecione seu repositório
# - Vercel vai detectar Vite automaticamente
```

### 2. Configurar Variáveis de Ambiente

No dashboard do Vercel, vá para **Settings > Environment Variables** e adicione:

**Frontend:**
- `VITE_API_URL` → URL da sua API (ex: `https://seu-projeto.vercel.app/api`)
- `VITE_STRIPE_PUBLIC_KEY` → Sua chave pública do Stripe

**Backend:**
- `STRIPE_SECRET_KEY` → Sua chave secreta do Stripe
- `SESSION_SECRET` → Uma string aleatória segura
- `NODE_ENV` → `production`
- `ALLOWED_ORIGINS` → URLs permitidas (ex: `https://seu-projeto.vercel.app`)

### 3. Deploy

```bash
# Via CLI
vercel --prod

# Ou push para sua branch
git push origin main
# Vercel fará auto-deploy
```

## Estrutura de Deploy

```
├── dist/                    # Build do frontend Vite
├── api/                     # Serverless functions (backend)
├── public/                  # Arquivos estáticos
├── vercel.json             # Configuração do Vercel
└── .vercelignore           # Arquivos ignorados no build
```

## Monitoramento

- Dashboard: https://vercel.com/dashboard
- Logs: Clique no seu projeto > "Deployments" > Selecione deployment > "Logs"
- Analytics: Disponível na aba "Analytics"

## Troubleshooting

### Erro: "Cannot find module"
- Rode `npm install` localmente
- Verifique `package.json` e `package-lock.json`

### Erro: CORS
- Configure `ALLOWED_ORIGINS` com seu domínio Vercel
- Verifique `server/index.ts` para regras de CORS

### Erro 404 em rotas
- Vercel automaticamente faz rewrite para `index.html` para SPAs
- Isso já está configurado em `vercel.json`

## Notas Importantes

1. **PHP não é suportado no Vercel** - Migre os arquivos `.php` para Node.js
2. **Serverless functions têm timeout de 60s** - Otimize operações longas
3. **Varsáveis de Ambiente** - Nunca commite `.env`, use o dashboard Vercel
4. **Build** - Leva ~2-3 minutos na primeira vez, <1min depois

## Próximos Passos

1. Instale dependências: `npm install`
2. Teste localmente: `npm run dev`
3. Faça build: `npm run build && npm run preview`
4. Deploy: `vercel --prod`

## Documentação Oficial

- [Vercel Docs](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)
- [Express on Vercel](https://vercel.com/docs/runtimes/nodejs)
