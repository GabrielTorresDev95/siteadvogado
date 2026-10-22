import { motion } from 'motion/react';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

type Article = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
};

export function TestimonialsSection() {
  const { colors } = useTheme();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      title: 'Como proteger obras musicais e autorais',
      excerpt:
        'Entenda os principais cuidados jurídicos para resguardar composições, gravações e demais criações artísticas.',
      content:
        'A proteção de obras musicais e autorais envolve o registro adequado, a formalização de contratos e a definição clara da titularidade dos direitos. Também é importante analisar cessões, licenças e o uso indevido por terceiros. Com uma estrutura jurídica correta, o autor ou titular reduz riscos e fortalece sua segurança patrimonial e comercial.',
      category: 'Direitos Autorais',
    },
    {
      title: 'Registro de marca para projetos e negócios criativos',
      excerpt:
        'Veja por que o registro de marca é uma etapa essencial para quem deseja crescer com segurança.',
      content:
        'O registro de marca é fundamental para proteger a identidade do negócio e evitar conflitos futuros. Ao registrar a marca, o titular passa a ter maior segurança para explorar comercialmente seu nome, identidade visual e posicionamento no mercado. O acompanhamento jurídico ajuda a prevenir indeferimentos e estruturar melhor a proteção.',
      category: 'Marcas',
    },
    {
      title: 'Contratos no setor criativo: pontos que merecem atenção',
      excerpt:
        'Saiba quais cláusulas costumam exigir mais cuidado em contratos envolvendo obras, marcas e licenciamento.',
      content:
        'Em contratos do setor criativo, é essencial observar objeto, prazo, remuneração, formas de uso, território, exclusividade, responsabilidade e hipóteses de rescisão. Uma redação técnica e clara evita ambiguidades e reduz conflitos. Cada projeto deve ser analisado de forma individual, conforme sua finalidade e seus ativos envolvidos.',
      category: 'Contratos',
    },
  ];

  return (
    <>
      <section id="artigos" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: colors.secondary }}
            >
              Conteúdo jurídico
            </span>

            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: colors.primary }}
            >
              Artigos e orientações sobre direitos autorais, marcas e contratos
            </h2>

            <p className="text-lg" style={{ color: colors.text }}>
              Publicações informativas para esclarecer temas relevantes do setor criativo e empresarial.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="rounded-2xl p-8 shadow-sm border flex flex-col"
                style={{
                  backgroundColor: '#ffffff',
                  borderColor: `${colors.secondary}20`,
                }}
              >
                <span
                  className="text-sm font-semibold mb-3"
                  style={{ color: colors.secondary }}
                >
                  {article.category}
                </span>

                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: colors.primary }}
                >
                  {article.title}
                </h3>

                <p
                  className="text-base leading-relaxed mb-6 flex-1"
                  style={{ color: colors.text }}
                >
                  {article.excerpt}
                </p>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(article)}
                  className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold transition hover:opacity-90"
                  style={{
                    backgroundColor: colors.primary,
                    color: '#ffffff',
                  }}
                >
                  Ler artigo
                </button>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="w-full max-w-3xl rounded-2xl p-8 shadow-xl max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: '#ffffff' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: colors.secondary }}
                >
                  {selectedArticle.category}
                </span>

                <h3
                  className="text-2xl md:text-3xl font-bold mt-2"
                  style={{ color: colors.primary }}
                >
                  {selectedArticle.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="rounded-lg px-3 py-2 text-sm font-semibold border"
                style={{
                  color: colors.primary,
                  borderColor: `${colors.primary}30`,
                }}
              >
                Fechar
              </button>
            </div>

            <div
              className="text-base leading-relaxed whitespace-pre-line"
              style={{ color: colors.text }}
            >
              {selectedArticle.content}
            </div>
          </div>
        </div>
      )}
    </>
  );
}