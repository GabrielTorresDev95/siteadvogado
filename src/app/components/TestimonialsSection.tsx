
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

import { useTheme } from "../context/ThemeContext";

import {
  getArticles,
  type Article,
  type ArticleBlock,
} from "../services/strapi";

export function TestimonialsSection() {
  const { colors } = useTheme();

  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CARREGAR ARTIGOS DO STRAPI
  useEffect(() => {
    let active = true;

    async function carregarArtigos() {
      try {
        setLoading(true);
        setError(null);

        const dados = await getArticles();

        if (active) {
          setArticles(dados);
        }
      } catch (erro) {
        console.error("Erro ao carregar artigos:", erro);

        if (active) {
          setError(
            "Não foi possível carregar os artigos."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void carregarArtigos();

    return () => {
      active = false;
    };
  }, []);

  // FECHAR MODAL COM ESC
  useEffect(() => {
    if (!selectedArticle) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedArticle(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedArticle]);

  // OBTER NOME DA CATEGORIA
  function getCategoryName(category: unknown): string {
    if (!category) return "Artigo";

    if (typeof category === "string") {
      return category;
    }

    if (typeof category !== "object") {
      return "Artigo";
    }

    const obj = category as Record<string, unknown>;

    if (typeof obj.name === "string") {
      return obj.name;
    }

    if (typeof obj.title === "string") {
      return obj.title;
    }

    // Compatibilidade com Strapi 4
    const data = obj.data;

    if (data && typeof data === "object") {
      const attributes = (
        data as Record<string, unknown>
      ).attributes;

      if (
        attributes &&
        typeof attributes === "object"
      ) {
        const attrs =
          attributes as Record<string, unknown>;

        if (typeof attrs.name === "string") {
          return attrs.name;
        }

        if (typeof attrs.title === "string") {
          return attrs.title;
        }
      }
    }

    return "Artigo";
  }

  // RENDERIZAR RICH TEXT
  function renderRichText(body?: string) {
    if (!body) return null;

    return (
      <div
        className="whitespace-pre-line leading-8"
        style={{ color: colors.text }}
      >
        {body}
      </div>
    );
  }

  // RENDERIZAR BLOCOS DO STRAPI
  function renderBlock(block: ArticleBlock) {
    const key = `${block.__component}-${block.id}`;

    switch (block.__component) {
      case "shared.rich-text":
        return (
          <div key={key} className="mb-6">
            {renderRichText(block.body)}
          </div>
        );

      case "shared.quote":
        return (
          <blockquote
            key={key}
            className="border-l-4 pl-5 py-2 my-8 italic"
            style={{
              borderColor: colors.secondary,
              color: colors.text,
            }}
          >
            {block.title && (
              <strong
                className="block mb-2 not-italic"
                style={{
                  color: colors.primary,
                }}
              >
                {block.title}
              </strong>
            )}

            {block.text}
          </blockquote>
        );

      default:
        console.log(
          "Componente ainda não renderizado:",
          block.__component
        );

        return null;
    }
  }

  return (
    <>
      {/* SEÇÃO DE ARTIGOS */}
      <section
        id="artigos"
        className="py-24"
        style={{
          backgroundColor: colors.background,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* CABEÇALHO */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-4"
              style={{
                color: colors.secondary,
              }}
            >
              Conteúdo jurídico
            </span>

            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{
                color: colors.primary,
              }}
            >
              Artigos e orientações sobre direitos
              autorais, marcas e contratos
            </h2>

            <p
              className="text-lg"
              style={{
                color: colors.text,
              }}
            >
              Publicações informativas para esclarecer
              temas relevantes do setor criativo e
              empresarial.
            </p>
          </motion.div>

          {/* CARREGAMENTO */}
          {loading && (
            <div
              className="text-center py-12"
              style={{
                color: colors.text,
              }}
            >
              Carregando artigos...
            </div>
          )}

          {/* ERRO */}
          {!loading && error && (
            <div
              className="text-center py-12"
              style={{
                color: colors.text,
              }}
            >
              {error}
            </div>
          )}

          {/* NENHUM ARTIGO */}
          {!loading &&
            !error &&
            articles.length === 0 && (
              <div
                className="text-center py-12"
                style={{
                  color: colors.text,
                }}
              >
                Nenhum artigo publicado.
              </div>
            )}

          {/* GRID DE ARTIGOS */}
          {!loading &&
            !error &&
            articles.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, index) => (
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
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.6,
                    }}
                    className="rounded-2xl overflow-hidden shadow-sm border flex flex-col"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: `${colors.secondary}20`,
                    }}
                  >
                    {/* CAPA */}
                    {article.cover?.url && (
                      <img
                        src={article.cover.url}
                        alt={article.title}
                        className="w-full h-52 object-cover"
                        loading="lazy"
                      />
                    )}

                    {/* CONTEÚDO DO CARD */}
                    <div className="p-8 flex flex-col flex-1">
                      <span
                        className="text-sm font-semibold mb-3"
                        style={{
                          color: colors.secondary,
                        }}
                      >
                        {getCategoryName(
                          article.category
                        )}
                      </span>

                      <h3
                        className="text-xl font-bold mb-4"
                        style={{
                          color: colors.primary,
                        }}
                      >
                        {article.title}
                      </h3>

                      <p
                        className="text-base leading-relaxed mb-6 flex-1"
                        style={{
                          color: colors.text,
                        }}
                      >
                        {article.description ||
                          "Leia o artigo completo para saber mais."}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedArticle(article)
                        }
                        className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition hover:opacity-90"
                        style={{
                          backgroundColor: colors.primary,
                          color: "#ffffff",
                        }}
                      >
                        Ler artigo
                      </button>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
        </div>
      </section>

      {/* MODAL DO ARTIGO */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={() =>
            setSelectedArticle(null)
          }
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedArticle.title}
            className="w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: "#ffffff",
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* CAPA DO MODAL */}
            {selectedArticle.cover?.url && (
              <img
                src={selectedArticle.cover.url}
                alt={selectedArticle.title}
                className="w-full h-64 md:h-80 object-cover rounded-t-2xl"
              />
            )}

            <div className="p-8">
              {/* CABEÇALHO DO ARTIGO */}
              <div className="flex items-start justify-between gap-6 mb-8">
                <div>
                  <span
                    className="text-sm font-semibold uppercase tracking-wider"
                    style={{
                      color: colors.secondary,
                    }}
                  >
                    {getCategoryName(
                      selectedArticle.category
                    )}
                  </span>

                  <h3
                    className="text-2xl md:text-3xl font-bold mt-2"
                    style={{
                      color: colors.primary,
                    }}
                  >
                    {selectedArticle.title}
                  </h3>

                  {selectedArticle.description && (
                    <p
                      className="mt-4 text-lg leading-relaxed"
                      style={{
                        color: colors.text,
                      }}
                    >
                      {selectedArticle.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedArticle(null)
                  }
                  aria-label="Fechar artigo"
                  className="shrink-0 rounded-lg p-2 border transition hover:opacity-80"
                  style={{
                    color: colors.primary,
                    borderColor: `${colors.primary}30`,
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CONTEÚDO DO ARTIGO */}
              <div>
                {selectedArticle.blocks &&
                selectedArticle.blocks.length > 0 ? (
                  selectedArticle.blocks.map(
                    (block) => renderBlock(block)
                  )
                ) : (
                  <p
                    style={{
                      color: colors.text,
                    }}
                  >
                    Este artigo ainda não possui conteúdo.
                  </p>
                )}
              </div>

              {/* RODAPÉ DO MODAL */}
              <div
                className="mt-10 pt-6 border-t flex justify-end"
                style={{
                  borderColor: `${colors.secondary}20`,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setSelectedArticle(null)
                  }
                  className="px-6 py-3 rounded-xl font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: colors.primary,
                    color: "#ffffff",
                  }}
                >
                  Fechar artigo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
