import { useState } from 'react';
import { motion } from 'motion/react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, Youtube } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PoliticaPrivacidadeSection } from '../components/politicaprivacidadesection';
import  logo  from '../assets/barukregistra.jpg';

export function Footer() {
  const { colors } = useTheme();
  const [showPrivacy, setShowPrivacy] = useState(false);

  const footerLinks = {
    servicos: [
      'Direitos Autorais',
      'Registro de Marcas',
      'Proteção Musical',
      'Defesa Jurídica',
      'Consultoria',
    ],
    recursos: [
      'Blog Jurídico',
      'Artigos',
      'Guias',
      'FAQ',
      'Casos de Sucesso',
    ],
    empresa: [
      'Sobre nós',
      'Equipe',
      'Contato',
      'Política de Privacidade',
      'Termos de Uso',
    ],
  };

  const socialLinks = [
    { icon: Instagram, url: 'https://www.instagram.com/barukregistra/', label: 'Instagram' },
    { icon: Linkedin, url: 'https://www.linkedin.com/in/jaderwindson/', label: 'LinkedIn' },
    { icon: Youtube, url: 'https://www.youtube.com/@JaderWindsonBaruk', label: 'Youtube' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFooterLinkClick = (link: string) => {
    if (link === 'Política de Privacidade') {
      setShowPrivacy(true);
      return;
    }
  };

  return (
    <>
      <footer style={{ backgroundColor: colors.primary }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center space-x-3 mb-6"
              >
                <div className="w-16 h-16 flex items-center justify-center">
  <img
    src={logo}
    alt="Baruk Registra"
    className="w-full h-full object-contain"
  />
</div>

                <div>
                  <h3 className="text-xl font-bold" style={{ color: colors.background }}>
                    Direito Autoral
                  </h3>
                  <p className="text-sm" style={{ color: `${colors.background}80` }}>
                    Proteção Intelectual
                  </p>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6 opacity-80"
                style={{ color: colors.background }}
              >
                Escritório especializado em direitos autorais, registro de marcas e proteção de obras
                musicais. Atuação estratégica para artistas, produtores e empresas.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5" style={{ color: colors.secondary }} />
                  <a
                    href="tel:+5561996621304"
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: colors.background }}
                  >
                    (61) 99662-1304
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" style={{ color: colors.secondary }} />
                  <a
                    href="mailto:contato@barukregistra.com.br"
                    className="hover:opacity-80 transition-opacity"
                    style={{ color: colors.background }}
                  >
                    contato@barukregistra.com.br
                  </a>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" style={{ color: colors.secondary }} />
                  <span style={{ color: colors.background }}>Brasília, DF - Brasil</span>
                </div>
              </motion.div>
            </div>

            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h4 className="font-bold mb-4 capitalize" style={{ color: colors.background }}>
                  {category}
                </h4>

                <ul className="space-y-2">
                  {links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button
                        type="button"
                        onClick={() => handleFooterLinkClick(link)}
                        className="opacity-80 hover:opacity-100 transition-opacity inline-block text-left"
                        style={{ color: colors.background }}
                      >
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 pt-8"
            style={{ borderTop: `1px solid ${colors.background}20` }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 rounded-lg transition-all"
                    style={{
                      backgroundColor: `${colors.background}10`,
                      color: colors.secondary,
                    }}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>

              <motion.button
                type="button"
                onClick={() => scrollToSection('#inicio')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.primary,
                }}
              >
                Voltar ao topo
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div
          className="py-6"
          style={{
            backgroundColor: `${colors.primary}f0`,
            borderTop: `1px solid ${colors.background}20`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p style={{ color: `${colors.background}80` }}>
                © 2026 Direito Autoral - Todos os direitos reservados
              </p>

              <div className="flex space-x-6">
                <button
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: `${colors.background}80` }}
                >
                  Política de Privacidade
                </button>

                <a
                  href="#"
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: `${colors.background}80` }}
                >
                  Termos de Uso
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4" style={{ backgroundColor: `${colors.primary}f5` }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-center" style={{ color: `${colors.background}60` }}>
              OAB/SP 123.456 • Este site não oferece garantias de resultados. Cada caso é único e
              analisado individualmente.
            </p>
          </div>
        </div>
      </footer>

      {showPrivacy && (
        <PoliticaPrivacidadeSection onClose={() => setShowPrivacy(false)} />
      )}
    </>
  );
}