# Car Via Auto Peças

Loja com catálogo por categoria, carrinho, painel de administrador/gerente e atendimento por WhatsApp.

## Executar no VS Code
Instale Node.js 22.13 ou superior, extraia o projeto e abra a pasta no VS Code. No terminal:

```sh
npx pnpm@11.25.0 install
npx pnpm@11.25.0 dev
```

Abra http://localhost:5173. A instalação exige internet. O ambiente local utiliza recursos simulados de autenticação; a loja hospedada utiliza a identidade do ChatGPT/Sites.

## Painel
Acesse `/admin`. O proprietário é definido pela variável de servidor `STORE_OWNER_EMAIL`, usando o e-mail verificado da conta que entra no site. Não há senha padrão nem promoção automática do primeiro visitante.

- Administrador: cadastra, edita, exclui ou oculta peças; configura WhatsApp; atribui cargos por e-mail.
- Gerente: cadastra, edita, exclui ou oculta peças; não altera acessos ou WhatsApp.
- Cliente: consulta a loja; não pode acessar APIs administrativas.

As permissões são verificadas no servidor. O administrador não pode remover o proprietário nem alterar seu próprio cargo.

### Cadastro de peças
Campos: nome, código único, marca, categoria, preço unitário, estoque, descrição/aplicação, endereço HTTPS de foto e visibilidade. As categorias podem ser selecionadas ou digitadas. Sem foto, é usada uma ilustração. Estoque zero desativa a adição ao carrinho.

O primeiro cadastro real substitui os exemplos do catálogo. Peças ocultas não aparecem para o cliente. O catálogo, os acessos e o WhatsApp são persistidos no banco D1; as migrações estão em `drizzle/`.

### WhatsApp
No painel, abra WhatsApp e informe código do país + DDD + número, por exemplo 5563999999999. Deixe vazio para ocultar o botão. O botão flutuante abre atendimento geral; nos detalhes da peça, a mensagem inclui nome e código.

### Equipe
Use o mesmo e-mail da conta usada para entrar no site. Além do cargo da loja, o gerente precisa ter acesso à publicação enquanto o site estiver privado. Atribuir um cargo não envia convites nem modifica a privacidade da publicação.

## Arquivos principais
- `app/page.tsx`: vitrine e carrinho.
- `app/admin/`: painel.
- `app/api/admin/`: operações administrativas.
- `app/api/catalog/`: catálogo e WhatsApp públicos.
- `lib/admin.ts`: permissões.
- `lib/product-validation.ts`: validações.
- `db/schema.ts` e `drizzle/`: banco e migrações.
- `app/api/checkout/`: integração Mercado Pago.

## Banco e configuração local
Aplique as migrações D1 em um banco local usando a configuração do seu ambiente Cloudflare. O painel e o catálogo consultam esse banco; não bastam arquivos estáticos. A variável `STORE_OWNER_EMAIL` deve ser configurada no servidor. Na publicação Sites as migrações são aplicadas pela plataforma. Para hospedagem independente, também é necessário configurar a autenticação e as associações Cloudflare D1.

## Pagamentos
Vendas reais permanecem desativadas. A integração Mercado Pago exige a variável secreta `MERCADO_PAGO_ACCESS_TOKEN` e `SALES_ENABLED=true`. Antes de ativar, defina entrega/retirada, valide o catálogo e implemente a reserva/baixa de estoque na confirmação dos pagamentos. As compras não têm cálculo de frete ou emissão fiscal. Não há armazenamento de dados de cartão na loja.

Nunca exponha tokens no código da interface. Não houve teste de pagamento real nem teste no Windows. TypeScript, compilação e verificações de autorização, validação e migrações foram executados. Não houve revisão visual em navegador.
