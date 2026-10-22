# Animações e ajustes visuais

As configurações ficam em `src/scripts/animations.js`, no objeto `motion`.

| Configuração     | Padrão | Ajuste                                                                       |
| ---------------- | ------ | ---------------------------------------------------------------------------- |
| `duration`       | 1      | Duração das entradas, em segundos. Use 0.8 a 1.2.                            |
| `stagger`        | 0.08   | Intervalo entre itens do mesmo grupo, em segundos.                           |
| `distance`       | 40     | Deslocamento inicial no desktop, em pixels.                                  |
| `mobileDistance` | 20     | Deslocamento inicial no celular, em pixels.                                  |
| `scrub`          | 0.6    | Suavização dos efeitos ligados ao scroll, em segundos.                       |
| `textOpacity`    | 0.15   | Opacidade inicial das palavras. Valores maiores deixam o texto mais visível. |
| `imageScale`     | 1.15   | Zoom inicial das imagens. 1.08 deixa o efeito mais discreto.                 |
| `parallax`       | 8      | Percurso vertical total em porcentagem. Mantenha entre 0 e 8.                |
| `smoothDuration` | 1.1    | Tempo do scroll suave. Um valor menor deixa a resposta mais direta.          |
| `bounceHeight`   | 8      | Altura do quique do WhatsApp, em pixels.                                     |
| `bouncePause`    | 4      | Pausa entre quiques, em segundos.                                            |

## Aplicar os efeitos

- `data-anim="text-fill"`: preenchimento por palavras. Só os primeiros três elementos de cada página recebem o efeito.
- `data-anim="lines"`: entrada do título linha por linha, com recalculo automático das linhas ao redimensionar.
- `data-anim="fade-up"`: entrada por opacidade e deslocamento vertical.
- `data-anim-group`: adicione no pai dos elementos fade-up para aplicar o stagger.
- `data-anim="img-reveal"`: adicione no contêiner de uma imagem com proporção reservada. A imagem interna recebe o zoom.
- `data-parallax`: adicione junto de img-reveal nas imagens grandes. Somente no desktop.

O componente `Placeholder.astro` também aceita `src`, `width` e `height` e aplica lazy loading fora do hero. Sem fotografias fornecidas, mantém os espaços reservados existentes. As imagens do hero ficam visíveis desde o início para preservar o LCP.

Com movimento reduzido, não são carregadas as bibliotecas de animação. Em execução normal, elas são importadas assim que o DOM está disponível, e a divisão do texto aguarda as fontes. Mudanças na preferência de movimento são detectadas durante a visita. O clip-path é usado somente na revelação inicial; zoom, entradas e parallax usam transform e opacity. O conteúdo continua disponível se o JavaScript falhar.

As fontes Fraunces normal/itálica e Figtree são servidas localmente em `public/fonts/`, com suas licenças OFL.

## Abertura e fundos fotográficos

A abertura usa a monograma P de Priscila: uma camada apagada e outra na cor original, revelada suavemente da esquerda para a direita. A cor preenche em 0.85s; a tela desaparece entre 1s e 1.4s. Executa uma vez por sessão na home, sem bloquear cliques ou rolagem, e não aparece com movimento reduzido ou acesso direto a uma âncora. Não espera fotografias ou bibliotecas para terminar.

Os fundos são configurados em `site.media`, no arquivo `src/data/site.ts`: `hero`, `finalCta` e `intro`. Cada campo aceita o caminho local ou URL da fotografia fornecida. Enquanto não houver arquivos, a seção mostra sua cor de fundo, sem caixa de imagem. A hero usa a imagem com prioridade alta; o CTA usa lazy loading. Com fotografia, a camada de contraste mantém o texto legível.

A tipografia segue o HTML de referência Relaxcantre: Fraunces em peso 300 nos títulos, eixo SOFT em 0, eixo WONK em 1 e tamanho óptico automático; Figtree no corpo. Textos, paleta e outros elementos da referência não foram copiados.

## Galeria horizontal

O objeto motion inclui gallerySpeed (24 pixels por segundo). A galeria apresenta quatro imagens no desktop e duas no celular. Pausa ao receber hover ou foco; setas e arraste permitem navegação manual. O botão de pausa mantém a preferência até ser retomado. Cópias usadas para continuidade são ocultadas das tecnologias assistivas. Com movimento reduzido, só há navegação manual.

A abertura atual segue a sequência observada na referência: decodificação do logo, preenchimento de 2.1s e saída de 0.65s após 2.2s. Fundo fotográfico designado pelo usuário, símbolo P com duas mãos, nome e subtítulo. Limite de segurança de 6s e desativação com movimento reduzido.
