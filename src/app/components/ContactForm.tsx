
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { motion } from "motion/react";
import { Send, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

type FormData = {
  name: string;
  whatsapp: string;
  email: string;
  service: string;
  message: string;
};

const initialFormData: FormData = {
  name: "",
  whatsapp: "",
  email: "",
  service: "",
  message: "",
};

export function ContactForm() {
  const { colors } = useTheme();

  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<
    "success" | "error" | ""
  >("");

  const services = [
    "Registro de direitos autorais",
    "Registro de marca (INPI)",
    "Proteção de obras musicais",
    "Defesa contra uso indevido",
    "Consultoria jurídica",
    "Outro",
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: "Telefone",
      value: "(61) 99662-1304",
      link: "tel:+5561996621304",
    },
    {
      icon: Mail,
      label: "Email",
      value: "contato@barukregistra.com.br",
      link: "mailto:contato@barukregistra.com.br",
    },
    {
      icon: MapPin,
      label: "Endereço",
      value: "Brasília, DF - Brasil",
      link: null,
    },
    {
      icon: Clock,
      label: "Horário",
      value: "Seg a Sex: 9h às 18h",
      link: null,
    },
  ];

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const response = await fetch("/contato.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "O servidor não retornou uma resposta JSON válida."
        );
      }

      const data: {
        error?: string;
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.error || "Não foi possível enviar o formulário."
        );
      }

      setStatusMessage("Mensagem enviada com sucesso!");
      setStatusType("success");
      setFormData({ ...initialFormData });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);

      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua mensagem. Tente novamente."
      );

      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: `${colors.primary}05`,
    border: `1px solid ${colors.secondary}30`,
    color: colors.text,
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all";

  return (
    <section
      id="contato"
      className="py-20"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CABEÇALHO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: colors.primary }}
          >
            Agende sua consulta
          </h2>

          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: colors.textLight }}
          >
            Entre em contato para uma análise personalizada
            do seu caso
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FORMULÁRIO */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NOME */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.primary }}
                >
                  Nome completo *
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="Seu nome"
                />
              </div>

              {/* WHATSAPP */}
              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.primary }}
                >
                  WhatsApp *
                </label>

                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  required
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="(61) 99999-9999"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.primary }}
                >
                  Email *
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                  placeholder="seu@email.com"
                />
              </div>

              {/* SERVIÇO */}
              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.primary }}
                >
                  Tipo de serviço *
                </label>

                <select
                  id="service"
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">Selecione um serviço</option>

                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* MENSAGEM */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: colors.primary }}
                >
                  Mensagem (opcional)
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                  placeholder="Conte-nos mais sobre seu caso..."
                />
              </div>

              {/* BOTÃO */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{
                  scale: loading ? 1 : 1.02,
                }}
                whileTap={{
                  scale: loading ? 1 : 0.98,
                }}
                className="w-full px-8 py-4 rounded-lg text-lg font-semibold flex items-center justify-center space-x-3 shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.background,
                }}
              >
                <span>
                  {loading ? "Enviando..." : "Agendar consulta"}
                </span>

                <Send className="w-5 h-5" />
              </motion.button>

              <p
                className="text-xs text-center"
                style={{ color: colors.textLight }}
              >
                Ao enviar, sua mensagem será encaminhada
                para nossa equipe.
              </p>

              {/* STATUS */}
              {statusMessage && (
                <p
                  role={statusType === "error" ? "alert" : "status"}
                  className="text-sm text-center font-medium"
                  style={{
                    color:
                      statusType === "success"
                        ? "#16a34a"
                        : "#dc2626",
                  }}
                >
                  {statusMessage}
                </p>
              )}
            </form>
          </motion.div>

          {/* INFORMAÇÕES DE CONTATO */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;

                return (
                  <motion.div
                    key={info.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-xl flex items-start space-x-4"
                    style={{
                      backgroundColor: `${colors.primary}05`,
                      border: `1px solid ${colors.secondary}20`,
                    }}
                  >
                    <div
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: `${colors.secondary}20`,
                      }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: colors.secondary }}
                      />
                    </div>

                    <div>
                      <h4
                        className="font-semibold mb-1"
                        style={{ color: colors.primary }}
                      >
                        {info.label}
                      </h4>

                      {info.link ? (
                        <a
                          href={info.link}
                          className="hover:opacity-80 transition-opacity"
                          style={{ color: colors.textLight }}
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p style={{ color: colors.textLight }}>
                          {info.value}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* PRIMEIRA CONSULTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl"
              style={{
                background: `linear-gradient(
                  135deg,
                  ${colors.primary} 0%,
                  ${colors.textLight} 100%
                )`,
              }}
            >
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: colors.background }}
              >
                Primeira consulta
              </h3>

              <p
                className="mb-6 opacity-90"
                style={{ color: colors.background }}
              >
                Agende uma consulta inicial para análise
                do seu caso. Atendimento personalizado
                e confidencial.
              </p>

              <ul
                className="space-y-3"
                style={{ color: colors.background }}
              >
                <li className="flex items-start space-x-2">
                  <span style={{ color: colors.secondary }}>
                    ✓
                  </span>
                  <span>Análise detalhada do caso</span>
                </li>

                <li className="flex items-start space-x-2">
                  <span style={{ color: colors.secondary }}>
                    ✓
                  </span>
                  <span>
                    Orientação estratégica personalizada
                  </span>
                </li>

                <li className="flex items-start space-x-2">
                  <span style={{ color: colors.secondary }}>
                    ✓
                  </span>
                  <span>
                    Proposta de honorários transparente
                  </span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
