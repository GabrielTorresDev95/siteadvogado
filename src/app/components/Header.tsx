
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Phone,
  Scale,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useTheme } from "../context/ThemeContext";
import logo from "../assets/barukregistra.jpg";
import { LoginModal } from "./auth/LoginModal";
import { AdminPanel } from "./AdminPainelSection";

type Admin = {
  id: number;
  nome: string;
  email: string;
};

type StatusResponse = {
  success?: boolean;
  authenticated?: boolean;
  admin?: Admin;
  error?: string;
};

type LogoutResponse = {
  success?: boolean;
  message?: string;
  error?: string;
};

async function parseApiResponse<T>(
  response: Response
): Promise<T> {
  const responseText = await response.text();

  if (!responseText.trim()) {
    throw new Error(
      "O servidor retornou uma resposta vazia."
    );
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    throw new Error(
      "O servidor não retornou um JSON válido."
    );
  }
}

export function Header() {
  const { colors } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] =
    useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [checkingSession, setCheckingSession] =
    useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const menuItems = [
    { label: "Início", href: "#inicio" },
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "Conteúdos", href: "#conteudos" },
    { label: "Contato", href: "#contato" },
  ];

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      try {
        const response = await fetch(
          "/auth.php?action=status",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data =
          await parseApiResponse<StatusResponse>(
            response
          );

        if (!active) return;

        if (
          response.ok &&
          data.authenticated &&
          data.admin
        ) {
          setAdmin(data.admin);
        } else {
          setAdmin(null);
        }
      } catch (error) {
        console.error(
          "Erro ao verificar sessão:",
          error
        );

        if (active) {
          setAdmin(null);
        }
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    };

    void checkSession();

    return () => {
      active = false;
    };
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      });
    }

    setIsMenuOpen(false);
  };

  const openLogin = () => {
    setIsMenuOpen(false);
    setIsLoginOpen(true);
  };

  const handleLoginSuccess = (
    loggedAdmin: Admin
  ) => {
    setAdmin(loggedAdmin);
    setIsLoginOpen(false);
    setIsMenuOpen(false);
    setIsAdminPanelOpen(true);
  };

  const openAdminPanel = () => {
    if (!admin) return;

    setIsMenuOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch(
        "/auth.php?action=logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data =
        await parseApiResponse<LogoutResponse>(
          response
        );

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Não foi possível sair da conta."
        );
      }

      setAdmin(null);
      setIsLoginOpen(false);
      setIsAdminPanelOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error(
        "Erro ao encerrar sessão:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Erro ao sair da conta."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl"
        style={{
          background: `linear-gradient(
            180deg,
            ${colors.background}f2 0%,
            ${colors.background}dc 100%
          )`,
          borderBottom: `1px solid ${colors.secondary}18`,
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.07)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* LOGOTIPO */}
            <motion.a
              href="#inicio"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("#inicio");
              }}
              className="flex items-center gap-3 shrink-0 group"
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotate: 3,
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 18,
                }}
                className="relative w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  background: `linear-gradient(
                    135deg,
                    ${colors.secondary} 0%,
                    ${colors.primary} 100%
                  )`,
                  boxShadow: `0 10px 28px ${colors.secondary}45`,
                }}
              >
                <div className="absolute inset-0 bg-white/10" />
                <div className="absolute -left-10 top-0 h-full w-8 bg-white/25 skew-x-12 group-hover:left-[140%] transition-all duration-700" />
                <div className="absolute inset-[1px] rounded-2xl border border-white/10" />

                <img
                  src={logo}
                  alt="Baruk Registra"
                  className="relative w-10 h-10 object-contain"
                />
              </motion.div>

              <div className="flex flex-col leading-none">
                <span
                  className="text-[1.05rem] sm:text-lg font-extrabold tracking-tight"
                  style={{ color: colors.text }}
                >
                  Baruk{" "}
                  <span
                    style={{
                      background: `linear-gradient(
                        135deg,
                        ${colors.secondary} 0%,
                        ${colors.primary} 100%
                      )`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor:
                        "transparent",
                    }}
                  >
                    Registra
                  </span>
                </span>

                <span
                  className="text-[11px] sm:text-xs font-medium tracking-[0.24em] uppercase mt-1"
                  style={{
                    color: `${colors.text}99`,
                  }}
                >
                  Especialista em PI
                </span>
              </div>
            </motion.a>

            {/* MENU DESKTOP */}
            <nav className="hidden md:flex items-center">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-full"
                style={{
                  backgroundColor: `${colors.primary}08`,
                  border: `1px solid ${colors.secondary}16`,
                }}
              >
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{
                      opacity: 0,
                      y: -12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.4,
                    }}
                    whileHover={{ y: -2 }}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection(item.href);
                    }}
                    className="relative px-4 py-2 rounded-full text-sm font-semibold group overflow-hidden"
                    style={{
                      color: colors.text,
                    }}
                  >
                    <span className="relative z-10">
                      {item.label}
                    </span>
                  </motion.a>
                ))}
              </div>
            </nav>

            {/* AÇÕES DESKTOP */}
            <div className="hidden md:flex items-center gap-3">
              {!checkingSession && !admin && (
                <motion.button
                  type="button"
                  onClick={openLogin}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-semibold"
                  style={{
                    color: colors.primary,
                    backgroundColor: `${colors.primary}08`,
                    borderColor: `${colors.secondary}30`,
                  }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </motion.button>
              )}

              {!checkingSession && admin && (
                <>
                  <motion.button
                    type="button"
                    onClick={openAdminPanel}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-semibold"
                    style={{
                      color: colors.primary,
                      backgroundColor: `${colors.primary}08`,
                      borderColor: `${colors.secondary}30`,
                    }}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Painel</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() =>
                      void handleLogout()
                    }
                    disabled={loggingOut}
                    whileHover={{
                      scale: loggingOut ? 1 : 1.04,
                    }}
                    whileTap={{
                      scale: loggingOut ? 1 : 0.96,
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-full bg-red-600 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>
                      {loggingOut
                        ? "Saindo..."
                        : "Sair"}
                    </span>
                  </motion.button>
                </>
              )}

              <motion.a
                href="#contato"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection("#contato");
                }}
                whileHover={{
                  scale: 1.04,
                  y: -1,
                }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
                style={{
                  background: `linear-gradient(
                    135deg,
                    ${colors.secondary} 0%,
                    ${colors.primary} 100%
                  )`,
                  color: "#ffffff",
                }}
              >
                <Phone className="w-4 h-4" />
                <span>Agendar consulta</span>
              </motion.a>
            </div>

            {/* BOTÃO MOBILE */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() =>
                setIsMenuOpen((current) => !current)
              }
              className="md:hidden p-3 rounded-2xl border"
              style={{
                color: colors.primary,
                backgroundColor: `${colors.primary}08`,
                borderColor: `${colors.secondary}22`,
              }}
              aria-label={
                isMenuOpen
                  ? "Fechar menu"
                  : "Abrir menu"
              }
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* MENU MOBILE */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -14,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -14,
              }}
              transition={{
                duration: 0.25,
              }}
              className="md:hidden px-4 pb-4"
            >
              <div
                className="rounded-3xl p-4 mt-2"
                style={{
                  background: `linear-gradient(
                    180deg,
                    ${colors.background} 0%,
                    ${colors.primary}06 100%
                  )`,
                  border: `1px solid ${colors.secondary}16`,
                  boxShadow:
                    "0 18px 40px rgba(0,0,0,0.08)",
                }}
              >
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(
                        135deg,
                        ${colors.secondary} 0%,
                        ${colors.primary} 100%
                      )`,
                    }}
                  >
                    <Scale className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex flex-col">
                    <span
                      className="font-extrabold"
                      style={{
                        color: colors.text,
                      }}
                    >
                      Baruk Registra
                    </span>

                    <span
                      className="text-xs"
                      style={{
                        color: colors.textLight,
                      }}
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
                      initial={{
                        opacity: 0,
                        x: -14,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      onClick={(event) => {
                        event.preventDefault();
                        scrollToSection(item.href);
                      }}
                      className="block rounded-2xl px-4 py-3 text-base font-medium"
                      style={{
                        color: colors.text,
                        backgroundColor: `${colors.primary}05`,
                        border: `1px solid ${colors.secondary}10`,
                      }}
                    >
                      {item.label}
                    </motion.a>
                  ))}

                  {!checkingSession && !admin && (
                    <motion.button
                      type="button"
                      onClick={openLogin}
                      className="mt-3 flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl font-semibold border"
                      style={{
                        color: colors.primary,
                        backgroundColor: `${colors.primary}08`,
                        borderColor: `${colors.secondary}25`,
                      }}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </motion.button>
                  )}

                  {!checkingSession && admin && (
                    <>
                      <motion.button
                        type="button"
                        onClick={openAdminPanel}
                        className="mt-3 flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl font-semibold border"
                        style={{
                          color: colors.primary,
                          backgroundColor: `${colors.primary}08`,
                          borderColor: `${colors.secondary}25`,
                        }}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Painel</span>
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() =>
                          void handleLogout()
                        }
                        disabled={loggingOut}
                        className="mt-3 flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl bg-red-600 font-semibold text-white disabled:opacity-60"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>
                          {loggingOut
                            ? "Saindo..."
                            : "Sair"}
                        </span>
                      </motion.button>
                    </>
                  )}

                  <motion.a
                    href="#contato"
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToSection("#contato");
                    }}
                    className="mt-3 flex items-center justify-center gap-2 w-full px-6 py-3 rounded-2xl font-semibold"
                    style={{
                      background: `linear-gradient(
                        135deg,
                        ${colors.secondary} 0%,
                        ${colors.primary} 100%
                      )`,
                      color: "#ffffff",
                    }}
                  >
                    <Phone className="w-4 h-4" />
                    <span>Agendar consulta</span>
                  </motion.a>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MODAL DE LOGIN */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* PAINEL ADMINISTRATIVO */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        admin={admin}
        onClose={() => setIsAdminPanelOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
}
