# Checklist de Verificação antes do Deploy

## ✅ Antes de Deployar

- [ ] Todas as dependências estão listadas em `package.json` e `server/package.json`
- [ ] Arquivo `.env` NÃO está commitado no git
- [ ] Arquivo `.env.local` NÃO está commitado no git
- [ ] Arquivo `vercel.json` existe na raiz
- [ ] Arquivo `.vercelignore` existe na raiz
- [ ] Build local funciona: `npm run build`
- [ ] Preview local funciona: `npm run preview`
- [ ] Não há erros de TypeScript: `npx tsc --noEmit`

## 🔌 Variáveis de Ambiente

Antes do deploy, configure no Dashboard do Vercel:

### Production
```
VITE_API_URL=https://[seu-projeto].vercel.app/api
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
SESSION_SECRET=[gere um valor aleatório longo]
ALLOWED_ORIGINS=https://[seu-projeto].vercel.app
NODE_ENV=production
```

### Preview/Development
```
VITE_API_URL=https://[seu-projeto].vercel.app/api
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
SESSION_SECRET=[use um valor de teste]
ALLOWED_ORIGINS=https://[seu-projeto].vercel.app
NODE_ENV=preview
```

## 🚀 Contexto de Deploy

Este projeto é um monorepo com:
- **Frontend**: Vite + React + TypeScript em `/src`
- **Backend**: Express.js em `/server` com APIs em `/api`
- **Build Output**: Produção em `/dist`

Vercel automaticamente:
1. Detecta Vite pelo `vite.config.ts`
2. Roda `npm run build` para gerar `/dist`
3. Expõe arquivos estáticos do `/dist`
4. Roda funções serverless de `/api`

## 🔐 Segurança

- Helmet.js já está ativado
- Rate limiting está ativado
- CORS está configurable
- Session/Cookie seguro em produção
- Nenhum source map em produção
- Console logs removidos em produção

## 📝 Configuração de Domínio

1. Em `vercel.json` está configurado rewrite para SPA
2. Seu domínio pode ser:
   - Subdomínio Vercel fornecido (grátis)
   - Domínio customizado (conexão de DNS)

No dashboard: **Settings > Domains**

## 📊 Monitoramento Pós-Deploy

- Vercel Analytics: Tráfico, performance
- Vercel Logs: Console output, erros
- Status Page: Verificar saúde das APIs

## 🛠️ Possíveis Ajustes Futuros

- [ ] Migrar banco de dados para serviço compatível (vercel postgres, mongodb, etc)
- [ ] Remover arquivos `.php` ou migrá-los para Node.js
- [ ] Configurar CI/CD custom no `vercel.json` se necessário
- [ ] Adicionar webhooks para automação
- [ ] Configurar backups automáticos do banco

## 📞 Suporte

- Documentação Vercel: https://vercel.com/docs
- Status Vercel: https://www.vercelstatus.com
- Comunidade: https://github.com/vercel
