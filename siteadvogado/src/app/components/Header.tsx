import { useState } from 'react';
import { Menu, X, Phone, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { colors } = useTheme();

  const menuItems = [
    { label: 'Início', href: '#inicio' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Conteúdos', href: '#conteudos' },
    { label: 'Contato', href: '#contato' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl"
      style={{
        background: `linear-gradient(180deg, ${colors.background}f2 0%, ${colors.background}dc 100%)`,
        borderBottom: `1px solid ${colors.secondary}18`,
        boxShadow: '0 10px 40px rgba(0,0,0,0.07)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.a
            href="#inicio"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#inicio');
            }}
            className="flex items-center gap-3 shrink-0 group"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="relative w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                boxShadow: `0 10px 28px ${colors.secondary}45`,
              }}
            >
              <div className="absolute inset-0 bg-white/10" />
              <div className="absolute -left-10 top-0 h-full w-8 bg-white/25 skew-x-12 group-hover:left-[140%] transition-all duration-700" />
              <div className="absolute inset-[1px] rounded-2xl border border-white/10" />
              <Scale className="relative w-6 h-6 text-white" />
            </motion.div>

            <div className="flex flex-col leading-none">
              <span
                className="text-[1.05rem] sm:text-lg font-extrabold tracking-tight"
                style={{ color: colors.text }}
              >
                Baruk{' '}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Registra
                </span>
              </span>

              <span
                className="text-[11px] sm:text-xs font-medium tracking-[0.24em] uppercase mt-1"
                style={{ color: `${colors.text}99` }}
              >
                Registro & Proteção
              </span>
            </div>
          </motion.a>

          <nav className="hidden md:flex items-center">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full"
              style={{
                backgroundColor: `${colors.primary}08`,
                border: `1px solid ${colors.secondary}16`,
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 24px rgba(0,0,0,0.04)',
              }}
            >
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className="relative px-4 py-2 rounded-full text-sm font-semibold group overflow-hidden"
                  style={{ color: colors.text }}
                  whileHover={{ y: -2 }}
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    {item.label}
                  </span>

                  <span
                    className="absolute inset-0 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                      transformOrigin: 'center',
                    }}
                  />

                  <span
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-md transition duration-300"
                    style={{
                      background: `${colors.secondary}55`,
                    }}
                  />
                </motion.a>
              ))}
            </div>
          </nav>

          <div className="hidden md:flex items-center">
            <motion.a
              href="#contato"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#contato');
              }}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="group relative flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                color: '#ffffff',
                boxShadow: `0 14px 32px ${colors.secondary}30`,
              }}
            >
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-white/10" />
              <span className="absolute -left-12 top-0 h-full w-10 bg-white/25 skew-x-12 group-hover:left-[120%] transition-all duration-700" />
              <Phone className="relative w-4 h-4" />
              <span className="relative">Agendar consulta</span>
            </motion.a>
          </div>

          <motion.button
            whileHover={{ scale: 1.08, rotate: 4 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-2xl border transition-all duration-300"
            style={{
              color: colors.primary,
              backgroundColor: `${colors.primary}08`,
              borderColor: `${colors.secondary}22`,
              boxShadow: `0 8px 20px ${colors.secondary}10`,
            }}
            aria-label="Abrir menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="md:hidden px-4 pb-4"
          >
            <div
              className="rounded-3xl p-4 mt-2"
              style={{
                background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.primary}06 100%)`,
                border: `1px solid ${colors.secondary}16`,
                boxShadow: '0 18px 40px rgba(0,0,0,0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-4 px-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                    boxShadow: `0 10px 24px ${colors.secondary}35`,
                  }}
                >
                  <Scale className="w-5 h-5 text-white" />
                </div>

                <div className="flex flex-col leading-none">
                  <span
                    className="text-base font-extrabold tracking-tight"
                    style={{ color: colors.text }}
                  >
                    Baruk{' '}
                    <span
                      style={{
                        background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Registra
                    </span>
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-[0.24em] mt-1"
                    style={{ color: `${colors.text}99` }}
                  >
                    Registro & Proteção
                  </span>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.href);
                    }}
                    whileHover={{ x: 4, scale: 1.01 }}
                    className="block rounded-2xl px-4 py-3 text-base font-medium transition-all duration-300"
                    style={{
                      color: colors.text,
                      backgroundColor: `${colors.primary}05`,
                      border: `1px solid ${colors.secondary}10`,
                    }}
                  >
                    {item.label}
                  </motion.a>
                ))}

                <motion.a
                  href="#contato"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('#contato');
                  }}
                  className="group mt-3 flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl text-center font-semibold relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                    color: '#ffffff',
                    boxShadow: `0 12px 30px ${colors.secondary}30`,
                  }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-white/10" />
                  <Phone className="relative w-4 h-4" />
                  <span className="relative">Agendar consulta</span>
                </motion.a>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}