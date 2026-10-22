# Priscila Massoterapia

Site Astro estático para Priscila, massoterapeuta tântrica em Campinas e especialista em Nuru. Atendimento para homens, com reserva de horário.

## Executar

`npm install`, seguido de `npm run dev`. O terminal informa a porta disponível. Para produção: `npm run check`, `npm run build` e `npm run verify`.

## Dados confirmados

- WhatsApp: (19) 99575-3027.
- Mensagem: “Oi Priscila, gostaria de mais informações sobre o seu trabalho e os horários disponíveis.”
- Serviços: Nuru, Tântrica e Vivência Mútua.
- Segunda a sexta: 9h30 às 19h. Sábado: até as 15h.
- Campinas confirmada no perfil do Google fornecido pelo usuário.
- Atendimento na região do Cambuí e Nova Campinas, em espaço próprio e particular, com garagem. Por segurança, o endereço é informado somente pelo WhatsApp e não aparece no site, em mapas incorporados ou no schema. As fotos mostram o rosto desfocado por sigilo, discrição e segurança.

Dados centralizados em `src/data/site.ts`; modalidades em `src/data/services.ts`.

## Fotografias

Fotos fornecidas no arquivo Pri.zip. A organização de origem foi preservada em `assets-source/Pri/`. Imagens WebP otimizadas em `public/images/`, com metadados em `reports/priscila-images.json`.

- Hero: foto horizontal no desktop e vertical no celular.
- Sobre mim: foto designada na pasta correspondente.
- Galeria: seis retratos fornecidos.
- CTA final: fotografia designada no ZIP.
- Abertura: fotografia designada no ZIP.

`scripts/prepare-priscila-assets.mjs` regenera as imagens otimizadas. Fotografias fora da hero usam lazy loading. A hero reserva espaço e tem prioridade de carregamento.

## Depoimentos

Textos atualmente publicados: três resumos de avaliações reais consultadas em 14/10/2026 no perfil público do Google: Paulo Augusto Silva, FFS e Ted Luiz. Cada resumo apresenta autoria e link para o original. Não são citações literais nem histórias inventadas. Os textos estão em `src/data/reviews.ts`.

## Logo e animações

Monograma P com duas mãos representando o toque, criado com a ferramenta integrada ImageGen, fundo transparente e cor ameixa. Arquivo original: `assets-source/priscila-logo-v2-original.png`; versão leve: `public/images/priscila-logo-v2.webp`. O mesmo símbolo aparece no cabeçalho, no rodapé, na abertura e no favicon.

Prompt final: “Create ONE premium minimal logo mark for Priscila, a Brazilian massage therapist. Transparent background with genuine alpha. A beautifully proportioned letter P monogram in deep plum #342a38, elegant fine high-contrast serif shape, paired with ONE subtle fluid line suggesting a caring hand and a gentle wave of touch, abstract and tasteful. Must be clear at 40px, compact square composition, centered generous transparent negative space, no words or tagline, no mockup, no shadows, no gradients, no texture, no border, no erotic imagery, no lotus clichés. Flat single-color professional brand symbol, refined organic contours, vector-friendly.”

GSAP/ScrollTrigger e Lenis em `src/scripts/animations.js`. A abertura preenche o símbolo suavemente e desaparece em cerca de 2,85s, na abertura da home. Respeita movimento reduzido e não espera as fotografias para encerrar. A documentação dos controles está em `ANIMATIONS.md`.

## SEO e publicação

Metadados por página, canonical, Open Graph, Twitter Card, schema HealthAndBeautyBusiness, Service nas modalidades e BlogPosting nos artigos, sitemap e robots. Não há schema de avaliações nem endereço inventado.

Configure `SITE_URL` com o domínio de produção antes do deploy. Sem essa variável, a prévia mantém localhost e noindex. Vercel: build `npm run build`, saída `dist`. Cloudflare Pages: mesma configuração, com `_headers` em public.

Use Node.js 22.19 ou superior em produção. Nenhuma publicação foi realizada nesta adaptação.

## Ajustes de galeria, hero e blog

Galeria horizontal com quatro fotos visíveis no desktop e duas no celular. Movimento contínuo a 24px/s, pausado em hover, foco, aba oculta ou interação manual. Setas, arraste e botão de pausa disponíveis. Com movimento reduzido, a galeria continua manual e fica estática.

A hero mobile apresenta a fotografia acima do conteúdo e uma transição translúcida para a área de texto, seguindo a hierarquia da referência Katia Correa. A versão desktop mantém a fotografia de fundo.

Artigos respondem a perguntas sobre preparação, diferenças entre Nuru e tântrica e valores de atendimento em Campinas. Três imagens ilustrativas originais foram criadas via ImageGen e salvas como WebP em public/images/blog-*.webp. Não representam registros de atendimentos reais de Priscila.

O formato dos depoimentos voltou aos três cartões de relato. Os textos existentes permanecem vinculados às fontes verificadas; os trechos reais enviados pelo WhatsApp ainda precisam ser fornecidos antes da substituição. Não foram inventadas experiências de clientes.
