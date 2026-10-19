import { motion } from 'motion/react';
import { Shield, ArrowRight, AlertCircle } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';

export function CTASection() {
  const { colors } = useTheme();

  const scrollToContact = () => {
    const element = document.querySelector('#contato');

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background mais claro */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            135deg,
            ${colors.primary}E6 0%,
            ${colors.textLight}CC 100%
          )`,
        }}
      />

      {/* Overlay suave */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundColor: colors.background,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(
              circle at 2px 2px,
              ${colors.background} 1px,
              transparent 0
            )`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Ícone */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              type: 'spring',
              duration: 0.8,
            }}
            className="
              inline-flex
              items-center
              justify-center
              w-20
              h-20
              rounded-full
              mb-8
              shadow-lg
            "
            style={{
              backgroundColor: `${colors.background}30`,
              border: `1px solid ${colors.background}40`,
            }}
          >
            <AlertCircle
              className="w-10 h-10"
              style={{
                color: colors.background,
              }}
            />
          </motion.div>

          {/* Título */}
          <motion.h2
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="
              text-4xl
              md:text-5xl
              lg:text-6xl
              font-bold
              mb-6
            "
            style={{
              color: colors.background,
            }}
          >
            Proteja seu patrimônio intelectual{' '}
            <span
              style={{
                color: '#ffffff',
              }}
            >
              antes que seja tarde
            </span>
          </motion.h2>

          {/* Subtítulo */}
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.1,
            }}
            className="
              text-lg
              md:text-xl
              mb-8
              max-w-3xl
              mx-auto
            "
            style={{
              color: `${colors.background}F0`,
            }}
          >
            Não espere ter problemas para proteger suas criações.
            Agende uma consulta e garanta a segurança jurídica que sua
            obra merece.
          </motion.p>

          {/* Benefícios */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.2,
            }}
            className="
              flex
              flex-wrap
              justify-center
              gap-8
              mb-12
            "
          >
            {[
              'Atendimento personalizado',
              'Processo 100% seguro',
              'Resultados comprovados',
            ].map((item) => (
              <div
                key={item}
                className="flex items-center space-x-2"
              >
                <Shield
                  className="w-5 h-5"
                  style={{
                    color: colors.background,
                  }}
                />

                <span
                  className="font-semibold"
                  style={{
                    color: colors.background,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Botões */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.3,
            }}
            className="
              flex
              flex-col
              sm:flex-row
              gap-4
              justify-center
              items-center
            "
          >
            {/* Agendar consulta */}
            <motion.button
              type="button"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              onClick={scrollToContact}
              className="
                px-8
                py-4
                rounded-lg
                text-lg
                font-semibold
                flex
                items-center
                space-x-3
                shadow-xl
                transition-all
              "
              style={{
                backgroundColor: `${colors.background}F2`,
                color: colors.primary,
                border: `1px solid ${colors.background}`,
              }}
            >
              <span>Agendar consulta agora</span>

              <ArrowRight className="w-5 h-5" />
            </motion.button>

            {/* WhatsApp */}
            <motion.a
              href="https://wa.me/5561996621304"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="
                px-8
                py-4
                rounded-lg
                text-lg
                font-semibold
                flex
                items-center
                space-x-3
                transition-all
                shadow-lg
              "
              style={{
                backgroundColor: `${colors.background}20`,
                color: colors.background,
                border: `2px solid ${colors.background}CC`,
              }}
            >
              <span>Falar no WhatsApp</span>
            </motion.a>
          </motion.div>

          {/* Informação inferior */}
          <motion.p
            initial={{
              opacity: 0,
            }}
            whileInView={{
              opacity: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.4,
            }}
            className="mt-8 text-sm"
            style={{
              color: `${colors.background}CC`,
            }}
          >
            Atendimento confidencial • Sem compromisso • Resposta em
            até 24h
          </motion.p>
        </div>
      </div>
    </section>
  );
}