import { motion } from 'motion/react';
import {
  useEffect,
  useState,
} from 'react';

import {
  useTheme,
} from '../context/ThemeContext';

import {
  getArticles,
  type Article,
  type ArticleBlock,
} from '../services/strapi';

export function TestimonialsSection() {
  const { colors } = useTheme();

  const [
    articles,
    setArticles,
  ] = useState<Article[]>([]);

  const [
    selectedArticle,
    setSelectedArticle,
  ] = useState<Article | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  // ====================================================
  // CARREGAR ARTICLES DO STRAPI
  // ====================================================

  useEffect(() => {
    async function carregarArtigos() {
      try {
        setLoading(true);
        setError(null);

        const dados =
          await getArticles();

        console.log(
          'ARTIGOS CARREGADOS:',
          dados
        );

        setArticles(dados);
      } catch (erro) {
        console.error(
          'Erro ao carregar artigos:',
          erro
        );

        setError(
          'Não foi possível carregar os artigos.'
        );
      } finally {
        setLoading(false);
      }
    }

    carregarArtigos();
  }, []);

  // ====================================================
  // CATEGORIA
  // ====================================================

  function getCategoryName(
    category: any
  ): string {
    if (!category) {
      return 'Artigo';
    }

    // Caso seja string
    if (
      typeof category ===
      'string'
    ) {
      return category;
    }

    // Strapi 5
    if (category.name) {
      return category.name;
    }

    if (category.title) {
      return category.title;
    }

    // Strapi 4
    if (
      category.data
        ?.attributes?.name
    ) {
      return category.data
        .attributes.name;
    }

    if (
      category.data
        ?.attributes?.title
    ) {
      return category.data
        .attributes.title;
    }

    return 'Artigo';
  }

  // ====================================================
  // RENDERIZAR RICH TEXT
  // ====================================================

  function renderRichText(
    body?: string
  ) {
    if (!body) {
      return null;
    }

    /*
      Por enquanto mostramos
      o Markdown preservando
      as quebras de linha.
    */

    return (
      <div
        className="
          whitespace-pre-line
          leading-8
        "
        style={{
          color: colors.text,
        }}
      >
        {body}
      </div>
    );
  }

  // ====================================================
  // RENDERIZAR DYNAMIC ZONE
  // ====================================================

  function renderBlock(
    block: ArticleBlock
  ) {
    switch (
      block.__component
    ) {
      // ================================================
      // RICH TEXT
      // ================================================

      case 'shared.rich-text':
        return (
          <div
            key={
              `${block.__component}-${block.id}`
            }
            className="mb-6"
          >
            {renderRichText(
              block.body
            )}
          </div>
        );

      // ================================================
      // QUOTE
      // ================================================

      case 'shared.quote':
        return (
          <blockquote
            key={
              `${block.__component}-${block.id}`
            }
            className="
              border-l-4
              pl-5
              py-2
              my-8
              italic
            "
            style={{
              borderColor:
                colors.secondary,

              color:
                colors.text,
            }}
          >
            {block.title && (
              <strong
                className="
                  block
                  mb-2
                  not-italic
                "
                style={{
                  color:
                    colors.primary,
                }}
              >
                {block.title}
              </strong>
            )}

            {block.text}
          </blockquote>
        );

      // ================================================
      // OUTROS COMPONENTES
      // ================================================

      default:
        console.log(
          'Componente ainda não renderizado:',
          block.__component,
          block
        );

        return null;
    }
  }

  return (
    <>
      {/* =================================================
          SEÇÃO DE ARTIGOS
      ================================================= */}

      <section
        id="artigos"
        className="py-24"
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* =============================================
              CABEÇALHO
          ============================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className="
              text-center
              max-w-3xl
              mx-auto
              mb-14
            "
          >
            <span
              className="
                inline-block
                text-sm
                font-semibold
                uppercase
                tracking-widest
                mb-4
              "
              style={{
                color:
                  colors.secondary,
              }}
            >
              Conteúdo jurídico
            </span>

            <h2
              className="
                text-3xl
                md:text-4xl
                font-bold
                mb-4
              "
              style={{
                color:
                  colors.primary,
              }}
            >
              Artigos e orientações
              sobre direitos autorais,
              marcas e contratos
            </h2>

            <p
              className="text-lg"
              style={{
                color:
                  colors.text,
              }}
            >
              Publicações
              informativas para
              esclarecer temas
              relevantes do setor
              criativo e empresarial.
            </p>
          </motion.div>

          {/* =============================================
              LOADING
          ============================================= */}

          {loading && (
            <div
              className="
                text-center
                py-12
              "
              style={{
                color:
                  colors.text,
              }}
            >
              Carregando artigos...
            </div>
          )}

          {/* =============================================
              ERRO
          ============================================= */}

          {!loading &&
            error && (
              <div
                className="
                  text-center
                  py-12
                "
                style={{
                  color:
                    colors.text,
                }}
              >
                {error}
              </div>
            )}

          {/* =============================================
              SEM ARTIGOS
          ============================================= */}

          {!loading &&
            !error &&
            articles.length ===
              0 && (
              <div
                className="
                  text-center
                  py-12
                "
                style={{
                  color:
                    colors.text,
                }}
              >
                Nenhum artigo
                publicado.
              </div>
            )}

          {/* =============================================
              GRID
          ============================================= */}

          {!loading &&
            !error &&
            articles.length >
              0 && (
              <div
                className="
                  grid
                  md:grid-cols-2
                  lg:grid-cols-3
                  gap-8
                "
              >
                {articles.map(
                  (
                    article,
                    index
                  ) => (
                    <motion.article
                      key={
                        article.documentId ||
                        article.id
                      }
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay:
                          index *
                          0.1,

                        duration:
                          0.6,
                      }}
                      className="
                        rounded-2xl
                        overflow-hidden
                        shadow-sm
                        border
                        flex
                        flex-col
                      "
                      style={{
                        backgroundColor:
                          '#ffffff',

                        borderColor:
                          `${colors.secondary}20`,
                      }}
                    >
                      {/* ===============================
                          CAPA
                      =============================== */}

                      {article.cover
                        ?.url && (
                        <img
                          src={
                            article
                              .cover
                              .url
                          }
                          alt={
                            article.title
                          }
                          className="
                            w-full
                            h-52
                            object-cover
                          "
                        />
                      )}

                      {/* ===============================
                          CARD
                      =============================== */}

                      <div
                        className="
                          p-8
                          flex
                          flex-col
                          flex-1
                        "
                      >
                        <span
                          className="
                            text-sm
                            font-semibold
                            mb-3
                          "
                          style={{
                            color:
                              colors.secondary,
                          }}
                        >
                          {getCategoryName(
                            article.category
                          )}
                        </span>

                        <h3
                          className="
                            text-xl
                            font-bold
                            mb-4
                          "
                          style={{
                            color:
                              colors.primary,
                          }}
                        >
                          {
                            article.title
                          }
                        </h3>

                        <p
                          className="
                            text-base
                            leading-relaxed
                            mb-6
                            flex-1
                          "
                          style={{
                            color:
                              colors.text,
                          }}
                        >
                          {article.description ||
                            'Leia o artigo completo para saber mais.'}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedArticle(
                              article
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            justify-center
                            rounded-xl
                            px-5
                            py-3
                            font-semibold
                            transition
                            hover:opacity-90
                          "
                          style={{
                            backgroundColor:
                              colors.primary,

                            color:
                              '#ffffff',
                          }}
                        >
                          Ler artigo
                        </button>
                      </div>
                    </motion.article>
                  )
                )}
              </div>
            )}
        </div>
      </section>

      {/* =================================================
          MODAL
      ================================================= */}

      {selectedArticle && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            px-4
            py-6
          "
          onClick={() =>
            setSelectedArticle(
              null
            )
          }
        >
          <div
            className="
              w-full
              max-w-3xl
              rounded-2xl
              shadow-xl
              max-h-[90vh]
              overflow-y-auto
            "
            style={{
              backgroundColor:
                '#ffffff',
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* ===========================================
                CAPA DO MODAL
            =========================================== */}

            {selectedArticle
              .cover?.url && (
              <img
                src={
                  selectedArticle
                    .cover.url
                }
                alt={
                  selectedArticle
                    .title
                }
                className="
                  w-full
                  h-64
                  md:h-80
                  object-cover
                  rounded-t-2xl
                "
              />
            )}

            <div className="p-8">
              {/* =========================================
                  CABEÇALHO
              ========================================= */}

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-6
                  mb-8
                "
              >
                <div>
                  <span
                    className="
                      text-sm
                      font-semibold
                      uppercase
                      tracking-wider
                    "
                    style={{
                      color:
                        colors.secondary,
                    }}
                  >
                    {getCategoryName(
                      selectedArticle.category
                    )}
                  </span>

                  <h3
                    className="
                      text-2xl
                      md:text-3xl
                      font-bold
                      mt-2
                    "
                    style={{
                      color:
                        colors.primary,
                    }}
                  >
                    {
                      selectedArticle.title
                    }
                  </h3>

                  {selectedArticle
                    .description && (
                    <p
                      className="
                        mt-4
                        text-lg
                        leading-relaxed
                      "
                      style={{
                        color:
                          colors.text,
                      }}
                    >
                      {
                        selectedArticle.description
                      }
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedArticle(
                      null
                    )
                  }
                  className="
                    shrink-0
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    font-semibold
                    border
                  "
                  style={{
                    color:
                      colors.primary,

                    borderColor:
                      `${colors.primary}30`,
                  }}
                >
                  Fechar
                </button>
              </div>

              {/* =========================================
                  CONTEÚDO DO ARTICLE
              ========================================= */}

              <div>
                {selectedArticle
                  .blocks &&
                selectedArticle
                  .blocks.length >
                  0 ? (
                  selectedArticle
                    .blocks
                    .map(
                      (
                        block
                      ) =>
                        renderBlock(
                          block
                        )
                    )
                ) : (
                  <p
                    style={{
                      color:
                        colors.text,
                    }}
                  >
                    Este artigo ainda
                    não possui conteúdo.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}