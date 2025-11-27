# Agente de IA — Front-end (HTML / CSS / JS)

Projeto front-end simples para venda/consulta de serviços de "Agente de IA" (atendimento por WhatsApp, leitura de documentos, consultoria).

Testar localmente
- Preferível servir via um servidor estático (recomendado) — use um servidor local (ex.: Python http.server) para evitar problemas com fetch/arquivos locais.
- Com Python instalado, execute (PowerShell):

```powershell
# no diretório do projeto
py -3 -m http.server 8000; # ou: python -m http.server 8000
```

Abra `http://localhost:8000` no navegador.

Arquivos principais
- `index.html` — SPA entry (Home, Serviços, Carrinho)
- `admin.html` — página informativa 'Sobre Nossa Empresa' (funções de admin/loja foram removidas)
- `css/` — `variables.css`, `base.css`, `layout.css`, `components.css`
-- `js/` — `app.js`, `cart.js`, `whatsapp.js`, `docreader.js` (a loja foi removida)

Observações importantes
- Sem backend: algumas features locais (ex.: carrinho) usam `localStorage`. A loja foi removida do projeto — para restaurar a loja, reintroduza um arquivo `data/products.json` e o script `js/shop.js`.
- WhatsApp: `js/whatsapp.js` usa `window.WhatsAppConfig.PHONE` para definir o número. Para integrar com WhatsApp Business API, envie pedidos do cliente para seu backend e faça requisições autenticadas à API. Não ponha tokens em código cliente.
- PDF/OCR: `js/docreader.js` carrega `PDF.js` e `Tesseract.js` via CDN dinamicamente. OCR acontece no navegador (privado), mas pode ser lento para grandes arquivos.
- Pagamentos: fluxo de checkout é simulado; para produção integre um provedor (Pagar.me, Stripe, etc.) via backend.

SEO e performance
- Scripts carregados com `defer`.
- Imagens usam `loading="lazy"` quando possível.
- Meta tags básicas incluídas.

Próximos passos sugeridos
- (Loja removida) Para restaurar: subir `data/products.json` e adaptar `js/shop.js` para apontar para a URL.
- Implementar backend para salvar pedidos/integração com WhatsApp Business API.
