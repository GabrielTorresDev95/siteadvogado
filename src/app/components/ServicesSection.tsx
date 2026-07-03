import { motion } from 'motion/react';
import { Shield, Copyright, FileText, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ServicesSection() {
  const { colors } = useTheme();

  const services = [
    {
      icon: Shield,
      title: 'Propriedade Industrial',
      items: ['Registro de marca', 'Registro de Software', 'Desenho Industrial', 'Registro Patente', 'Monitoramento', 'Defesa do INPI e Judicial'],
    },
    {
      icon: Copyright,
      title: 'Direitos Autorais',
      items: ['Registro', 'Prova de anterioridade', 'Contrato e Negociação', 'Defesa judicial'],
    },
    {
      icon: FileText,
      title: 'Contratos e Negociação',
      items: [ 'Licenciamento', 'Cessão', 'Proteção Juridica'],
    },
    {
      icon: Globe,
      title: 'Direito Digital',
      items: ['Proteção de Dados e Privacidade', 'Direito Eletronico e Digital', 'Takedown / Pirataria(contrafação)', 'Proteção online(ou no digital)'],
    },
  ];

  return (
    <section id="servicos" className="py-24">
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
            Áreas de atuação
          </span>

          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: colors.primary }}
          >
            Atuação jurídica voltada à proteção e à estruturação de ativos intelectuais
          </h2>

          <p className="text-lg" style={{ color: colors.text }}>
          Desde 2024, a Baruk Registra atua de forma especializada na proteção e defesa de ativos intelectuais, reunindo experiência, expertise e tradição em Propriedade Intelectual, Direitos Autorais, contratos e contencioso, com atuação estratégica em todo o território nacional pautada em segurança, sigilo e profissionalismo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="rounded-2xl p-8 border shadow-sm"
              style={{
                borderColor: `${colors.secondary}25`,
                backgroundColor: colors.background,
              }}
            >
              <service.icon
                className="w-10 h-10 mb-5"
                style={{ color: colors.secondary }}
              />

              <h3
                className="text-xl font-bold mb-4"
                style={{ color: colors.primary }}
              >
                {service.title}
              </h3>

              <ul className="space-y-3">
                {service.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="text-sm leading-relaxed"
                    style={{ color: colors.text }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}