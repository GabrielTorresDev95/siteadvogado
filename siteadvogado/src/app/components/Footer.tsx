import { motion } from 'motion/react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Footer() {
  const { colors } = useTheme();

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
    { icon: Instagram, url: '#', label: 'Instagram' },
    { icon: Facebook, url: '#', label: 'Facebook' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
    { icon: Twitter, url: '#', label: 'Twitter' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer style={{ backgroundColor: colors.primary }}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-6"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.secondary }}
              >
                <span className="text-2xl font-bold" style={{ color: colors.background }}>
                  IP
                </span>
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

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5" style={{ color: colors.secondary }} />
                <a
                  href="tel:+5511999999999"
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: colors.background }}
                >
                  (61) 99662-1304
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5" style={{ color: colors.secondary }} />
                <a
                  href="mailto:contato@direitoautoral.adv.br"
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: colors.background }}
                >
                  contato@barukregistra.com.br
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5" style={{ color: colors.secondary }} />
                <span style={{ color: colors.background }}>Brasilia, DF - Brasil</span>
              </div>
            </motion.div>
          </div>

          {/* Links Columns */}
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
                    <a
                      href="#"
                      className="opacity-80 hover:opacity-100 transition-opacity inline-block"
                      style={{ color: colors.background }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
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

      {/* Bottom Bar */}
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
              <a
                href="#"
                className="hover:opacity-80 transition-opacity"
                style={{ color: `${colors.background}80` }}
              >
                Política de Privacidade
              </a>
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

      {/* Legal Disclaimer */}
      <div className="py-4" style={{ backgroundColor: `${colors.primary}f5` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-center" style={{ color: `${colors.background}60` }}>
            OAB/SP 123.456 • Este site não oferece garantias de resultados. Cada caso é único e
            analisado individualmente.
          </p>
        </div>
      </div>
    </footer>
  );
}
