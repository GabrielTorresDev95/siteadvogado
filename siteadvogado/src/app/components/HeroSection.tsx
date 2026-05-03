import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Shield, Music, Copyright } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function HeroSection() {
  const { colors } = useTheme();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const bgTransform = useMotionTemplate`translate3d(${springX}px, ${springY}px, 0) scale(1.12)`;
  const contentTransform = useMotionTemplate`translate3d(${springX}px, ${springY}px, 0)`;
  const cardsTransform = useMotionTemplate`translate3d(calc(${springX}px * -0.6), calc(${springY}px * -0.6), 0)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const rect = currentTarget.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const moveX = ((x / rect.width) - 0.5) * 24;
    const moveY = ((y / rect.height) - 0.5) * 24;

    mouseX.set(moveX);
    mouseY.set(moveY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const scrollToContact = () => {
    const element = document.querySelector('#contato');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="inicio"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* BACKGROUND SEM IMAGEM */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{ transform: bgTransform }}
          className="absolute inset-0 will-change-transform"
        />

        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${colors.primary}e8 0%, ${colors.primary}cc 100%)`,
          }}
        />

        <motion.div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.18, 0.3, 0.18],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ backgroundColor: `${colors.secondary}55` }}
        />

        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.12, 1],
            opacity: [0.1, 0.22, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{ backgroundColor: `${colors.background}20` }}
        />
      </div>

      {/* CONTEÚDO */}
      <motion.div
        style={{ transform: contentTransform }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 will-change-transform"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 backdrop-blur-md border"
              style={{
                backgroundColor: `${colors.secondary}20`,
                color: colors.secondary,
                borderColor: `${colors.secondary}30`,
              }}
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-semibold">
                Atuação em Propriedade Intelectual
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ color: colors.background }}
            >
              Proteção, estruturação e defesa de{' '}
              <span style={{ color: colors.secondary }}>
                ativos intelectuais
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl mb-8 leading-relaxed opacity-90"
              style={{ color: colors.background }}
            >
              Atuação técnica e estratégica em marcas, direitos autorais,
              contratos, inovação e proteção jurídica de ativos intangíveis.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToContact}
              className="group relative overflow-hidden px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-3 shadow-2xl"
              style={{
                backgroundColor: colors.secondary,
                color: colors.primary,
              }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-white/20" />
              <span className="absolute -left-10 top-0 h-full w-10 bg-white/30 skew-x-12 group-hover:left-full transition-all duration-700" />
              <span className="relative">Solicitar atendimento</span>
              <ArrowRight className="relative w-5 h-5" />
            </motion.button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              {['Marcas', 'Direitos Autorais', 'Contratos'].map((item, index) => (
                <div key={index}>
                  <div
                    className="text-xl font-bold"
                    style={{ color: colors.secondary }}
                  >
                    {item}
                  </div>
                  <div
                    className="text-sm opacity-80"
                    style={{ color: colors.background }}
                  >
                    Atuação estratégica
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            style={{ transform: cardsTransform }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="hidden md:grid grid-cols-2 gap-6 will-change-transform"
          >
            {[
              { icon: Music, label: 'Direitos Autorais' },
              { icon: Copyright, label: 'Registro de Marca' },
              { icon: Shield, label: 'Proteção Jurídica' },
              { icon: Shield, label: 'Contratos' },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -6 }}
                className="p-8 rounded-2xl backdrop-blur-md border"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: `${colors.secondary}40`,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                }}
              >
                <item.icon
                  className="w-10 h-10 mb-4"
                  style={{ color: colors.secondary }}
                />
                <h3
                  className="text-lg font-semibold"
                  style={{ color: colors.background }}
                >
                  {item.label}
                </h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* INDICADOR */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div
          className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-2"
          style={{ borderColor: colors.secondary }}
        >
          <div
            className="w-1 h-2 rounded-full"
            style={{ backgroundColor: colors.secondary }}
          />
        </div>
      </motion.div>
    </section>
  );
}