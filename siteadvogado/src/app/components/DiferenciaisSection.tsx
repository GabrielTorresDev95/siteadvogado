import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export function DiferenciaisSection() {
  const { colors } = useTheme();

  return (
    <section id="sobre" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span
              className="inline-block text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: colors.secondary }}
            >
              BARUK REGISTRA
            </span>

            <h2
              className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
              style={{ color: colors.primary }}
            >
              Seu negócio é único. Registre-o.
            </h2>

            <div
              className="space-y-5 text-lg leading-relaxed"
              style={{ color: colors.text }}
            >
              <p>
                A Baruk Registra atua na proteção, estruturação e defesa de
                ativos intelectuais, oferecendo soluções estratégicas em
                marcas, patentes, softwares, inovação, direitos autorais,
                contratos e contencioso.
              </p>

              <p>
                Com atuação especializada, experiência prática e abordagem
                personalizada, desenvolve serviços voltados à segurança
                jurídica de negócios, projetos, criações e tecnologias,
                acompanhando desde a análise de viabilidade e registros
                perante órgãos e entidades competentes até a condução de
                medidas administrativas e judiciais relacionadas à proteção
                de direitos.
              </p>

              <p>
                A atuação é realizada de forma remota em todo o território
                nacional, utilizando tecnologia adequada para acompanhamento
                e gestão dos processos de cada cliente, com segurança,
                sigilo, organização e profissionalismo.
              </p>

              <p>
                Mais do que viabilizar registros, a Baruk Registra busca
                oferecer uma atuação estratégica, sólida e alinhada às
                necessidades reais de cada cliente e às dinâmicas do mercado
                contemporâneo.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl p-8 shadow-lg"
            style={{ backgroundColor: `${colors.primary}08` }}
          >
            <div className="space-y-6">
              {[
                'Marcas e Patentes',
                'Softwares e Inovação',
                'Direitos Autorais',
                'Contratos e Contencioso',
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl border"
                  style={{
                    borderColor: `${colors.secondary}30`,
                    backgroundColor: `${colors.background}80`,
                  }}
                >
                  <p
                    className="font-medium"
                    style={{ color: colors.primary }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

