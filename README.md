# Car Via Auto Peças

Loja em desenvolvimento com catálogo, carrinho, orçamento por WhatsApp e painel de gestão.

Loja hospedada: https://car-via-auto-pecas.frostytetra64.chatgpt.site/

## Funcionalidades

- 16 departamentos e 124 tipos de peças.
- Busca por nome, código interno, código do fabricante e marca da peça.
- Filtros por marca do veículo, modelo, ano e motorização. As opções vêm das aplicações cadastradas; sem aplicação, a peça não aparece no filtro por veículo.
- Até 8 fotos HTTPS por peça, galeria e ilustração de fallback. Não há upload de fotos para armazenamento próprio.
- Administrador e gerente cadastram peças e aplicações, importam Excel e movimentam estoque. Somente administrador altera equipe e WhatsApp.
- Importação .xlsx: modelo para baixar no painel, 100 linhas/5 MB, prévia, erros por linha, ignorar ou atualizar códigos existentes. Atualizar substitui todos os campos, incluindo fotos, aplicação e saldo. Fórmulas são recusadas; colunas de códigos devem usar texto para manter zeros.
- Histórico de entradas e saídas, saldo após movimento, motivo e responsável. Os triggers registram também mudanças no cadastro/importação; saldos anteriores à migração ficam identificados como saldo inicial de histórico.
- Atualizações concorrentes no cadastro são recusadas. Saídas nunca podem deixar saldo negativo. Importações com uma edição concorrente no momento da gravação informam conflitos sem sobrescrever a peça.
- Carrinho salva no navegador e gera mensagem de orçamento com nome, código e quantidade. WhatsApp abre a mensagem para revisão, sem enviá-la automaticamente. Orçamento não cria pedido nem reserva estoque.
- Área /conta com cadastro, login Google/e-mail, recuperação de senha, confirmação de e-mail, perfil e pedidos individuais. Integração implementada; ativação externa pendente.

## Executar

Node.js >=22.13, pnpm conforme package.json.

```sh
npx pnpm@11.25.0 install
npx pnpm@11.25.0 dev
```

Use o banco D1 e suas migrações. O ambiente local usa identidade simulada; a produção usa os cabeçalhos confiáveis de Sites para administração. Não hospede atrás de um servidor que permita ao visitante falsificar esses cabeçalhos.

```sh
npx pnpm@11.25.0 test
npx pnpm@11.25.0 build:html
```

## Arquivo index.html

`standalone/dist/index.html` é gerado por `build:html`. Contém vitrine de demonstração, imagens, estilos e JavaScript em um arquivo. Abra no navegador, inclusive sem servidor. Busca e carrinho usam exemplos locais; aplicações fictícias estão explicitamente identificadas. A área do cliente aponta para a loja hospedada. Não contém banco de dados, painel local, importação local nem login real. Não envia pedidos ou pagamentos.

O `index.html` da raiz do repositório GitHub continua sendo o redirecionamento do GitHub Pages para a loja privada. O código-fonte da versão de demonstração está em `standalone/entry.tsx`; o arquivo entregue separadamente é a vitrine, não esse redirecionamento.

## Login Firebase — configuração externa pendente

O proprietário ainda não possui projeto Firebase. Para ativar:

1. Criar um projeto Firebase e registrar um aplicativo Web.
2. Ativar Authentication com Email/Password e Google; definir o e-mail de suporte do Google.
3. Autorizar `car-via-auto-pecas.frostytetra64.chatgpt.site` em Authentication > Settings > Authorized domains. Para testar localmente, autorizar localhost.
4. Copiar da configuração Web os valores e configurar no servidor: `FIREBASE_PROJECT_ID`, `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_APP_ID`.
5. Publicar a configuração e testar criação de conta, confirmação do e-mail, recuperação de senha, popup Google e pedidos de duas contas diferentes.

A API Web key faz parte da configuração pública do cliente. Credenciais administrativas e tokens de pagamentos nunca vão para a interface. JWTs são verificados no servidor por assinatura, emissor, audiência e validade. IDs Firebase usam namespace separado dos usuários Sites; pedidos anteriores não são vinculados automaticamente por e-mail.

A loja permanece privada em Sites. Configurar Firebase não libera acesso público. A audiência deve ser definida separadamente pelo proprietário.

## Antes de vender

Pagamentos reais permanecem desativados. A integração Mercado Pago existente exige `MERCADO_PAGO_ACCESS_TOKEN` e `SALES_ENABLED=true`, mas não ative antes de concluir:

- Catálogo, preços, estoque e aplicações reais conferidos.
- Telefone do vendedor cadastrado em Painel > WhatsApp.
- Login Firebase ativado e testado com usuários reais.
- Entrega/retirada, frete, prazos, política de troca e operação fiscal definidos.
- Reserva/baixa de estoque por pedido, expiração/liberação de reservas, confirmação por webhook idempotente e conciliação de cancelamentos/reembolsos implementadas.
- Teste completo com ambiente de testes do Mercado Pago e revisão final da loja no celular.

O histórico de estoque já registra ajustes manuais, mas não constitui integração automática entre pagamento e estoque. A consulta de pedido pode confirmar pagamento pela API; não há webhook de confirmação implementado.

## Verificação realizada nesta entrega

TypeScript, compilação de produção, geração de HTML, validações de filtros/fotos/importação/orçamento, JWTs e testes de APIs com banco D1 local. Os testes verificam permissões, origem, duplicados, concorrência, histórico, saldo insuficiente, importação, perfil, isolamento dos pedidos e bloqueio de checkout. Não houve compra real, teste com Google real ou revisão visual no navegador. Os testes usam banco temporário e não alteram produtos da loja.
