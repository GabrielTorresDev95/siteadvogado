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
             <h1> BARUK REGISTRA </h1>
            </span>

            <h2
              className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
              style={{ color: colors.primary }}
            >
              Atuação técnica voltada à proteção e valorização de ativos intelectuais
            </h2>

            <div className="space-y-5 text-lg leading-relaxed" style={{ color: colors.text }}>
              <p>
                A Baruk Registra é uma iniciativa dedicada à proteção, estruturação e defesa
                de ativos intelectuais, com atuação estratégica nas áreas de marcas,
                patentes, softwares, inovação, direitos autorais, contratos e contencioso.
              </p>

              <p>
                No cenário atual, ativos intangíveis — como marcas, criações, tecnologias
                e conteúdos — representam valor real e exigem organização jurídica adequada,
                acompanhamento técnico e proteção contínua.
              </p>

              <p>
                A atuação envolve desde a análise de viabilidade e estruturação de pedidos
                perante o INPI e a Biblioteca Nacional, até o acompanhamento de processos
                administrativos, monitoramento de ativos, elaboração de instrumentos
                contratuais e medidas de defesa administrativa e judicial.
              </p>

              <p>
                Com atendimento remoto em todo o território nacional, a proposta é oferecer
                atuação técnica, estratégica e consistente, alinhada às particularidades de
                cada cliente e às exigências do mercado.
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
                'Proteção de marcas, conteúdos e tecnologias',
                'Estruturação jurídica de ativos intelectuais',
                'Acompanhamento técnico e estratégico',
                'Atuação administrativa e judicial, conforme o caso',
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl border"
                  style={{
                    borderColor: `${colors.secondary}30`,
                    backgroundColor: `${colors.background}80`,
                  }}
                >
                  <p className="font-medium" style={{ color: colors.primary }}>
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