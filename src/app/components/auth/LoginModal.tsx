import {
  FormEvent,
  useEffect,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogIn,
  Mail,
  X,
} from 'lucide-react';

import { useTheme } from '../../context/ThemeContext';

export type Admin = {
  id: number;
  nome: string;
  email: string;
};

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (
    admin: Admin,
  ) => void;
};

type LoginResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  admin?: Admin;
};

export function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  const { colors } = useTheme();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [status, setStatus] =
    useState<
      'success' | 'error' | ''
    >('');

  /*
  |--------------------------------------------------------------------------
  | Comportamento do modal
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === 'Escape' &&
        !loading
      ) {
        onClose();
      }
    };

    document.body.style.overflow =
      'hidden';

    window.addEventListener(
      'keydown',
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        '';

      window.removeEventListener(
        'keydown',
        handleEscape,
      );
    };
  }, [isOpen, loading, onClose]);

  /*
  |--------------------------------------------------------------------------
  | Converter resposta da API
  |--------------------------------------------------------------------------
  */

  const parseResponse = async (
    response: Response,
  ): Promise<LoginResponse> => {
    const responseText =
      await response.text();

    console.log(
      'Resposta do auth.php:',
      responseText,
    );

    if (!responseText.trim()) {
      throw new Error(
        'O servidor retornou uma resposta vazia.',
      );
    }

    try {
      return JSON.parse(
        responseText,
      ) as LoginResponse;
    } catch {
      throw new Error(
        'O servidor não retornou um JSON válido.',
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Enviar login
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const cleanEmail =
      email.trim().toLowerCase();

    setLoading(true);
    setMessage('');
    setStatus('');

    try {
      const response = await fetch(
        '/auth.php?action=login',
        {
          method: 'POST',

          credentials: 'include',

          headers: {
            'Content-Type':
              'application/json',

            Accept:
              'application/json',
          },

          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        },
      );

      const data =
        await parseResponse(response);

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            'Não foi possível realizar o login.',
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Verificar administrador retornado
      |--------------------------------------------------------------------------
      */

      if (!data.admin) {
        console.error(
          'Resposta recebida:',
          data,
        );

        throw new Error(
          'O servidor não retornou os dados do administrador.',
        );
      }

      const loggedAdmin =
        data.admin;

      setStatus('success');

      setMessage(
        `Bem-vindo(a), ${loggedAdmin.nome}!`,
      );

      setPassword('');

      /*
      |--------------------------------------------------------------------------
      | Informar o Header e abrir o painel
      |--------------------------------------------------------------------------
      */

      window.setTimeout(() => {
        onLoginSuccess(
          loggedAdmin,
        );
      }, 700);
    } catch (error) {
      console.error(
        'Erro no login:',
        error,
      );

      setStatus('error');

      setMessage(
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao fazer login.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-title"
        >
          {/* Fundo escuro */}
          <button
            type="button"
            aria-label="Fechar login"
            disabled={loading}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm disabled:cursor-not-allowed"
            onClick={onClose}
          />

          {/* Caixa do login */}
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            transition={{
              duration: 0.25,
            }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl"
            style={{
              borderColor:
                `${colors.secondary}25`,
            }}
          >
            {/* Cabeçalho */}
            <div
              className="px-7 py-8 text-white"
              style={{
                background: `linear-gradient(
                  135deg,
                  ${colors.primary},
                  ${colors.secondary}
                )`,
              }}
            >
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="absolute right-4 top-4 rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <LockKeyhole className="h-6 w-6" />
              </div>

              <h2
                id="login-title"
                className="text-2xl font-bold"
              >
                Área administrativa
              </h2>

              <p className="mt-2 text-sm text-white/80">
                Entre com o e-mail e a
                senha do administrador.
              </p>
            </div>

            {/* Formulário */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-7"
            >
              {/* E-mail */}
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold"
                  style={{
                    color: colors.text,
                  }}
                >
                  E-mail
                </label>

                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                    style={{
                      color:
                        colors.textLight,
                    }}
                  />

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(
                      event,
                    ) =>
                      setEmail(
                        event.target.value,
                      )
                    }
                    autoComplete="email"
                    required
                    disabled={loading}
                    placeholder="seu@email.com"
                    className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none transition focus:ring-2 disabled:bg-slate-100"
                    style={{
                      borderColor:
                        `${colors.secondary}35`,

                      color:
                        colors.text,
                    }}
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-semibold"
                  style={{
                    color: colors.text,
                  }}
                >
                  Senha
                </label>

                <div className="relative">
                  <LockKeyhole
                    className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                    style={{
                      color:
                        colors.textLight,
                    }}
                  />

                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={(
                      event,
                    ) =>
                      setPassword(
                        event.target.value,
                      )
                    }
                    autoComplete="current-password"
                    required
                    minLength={6}
                    disabled={loading}
                    placeholder="Digite sua senha"
                    className="w-full rounded-xl border py-3 pl-12 pr-12 outline-none transition focus:ring-2 disabled:bg-slate-100"
                    style={{
                      borderColor:
                        `${colors.secondary}35`,

                      color:
                        colors.text,
                    }}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current,
                      )
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 disabled:opacity-50"
                    aria-label={
                      showPassword
                        ? 'Ocultar senha'
                        : 'Mostrar senha'
                    }
                    style={{
                      color:
                        colors.textLight,
                    }}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mensagem */}
              {message && (
                <div
                  className="rounded-xl px-4 py-3 text-sm font-medium"
                  style={{
                    backgroundColor:
                      status === 'success'
                        ? '#ecfdf5'
                        : '#fef2f2',

                    color:
                      status === 'success'
                        ? '#047857'
                        : '#b91c1c',
                  }}
                >
                  {message}
                </div>
              )}

              {/* Botão */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={
                  loading
                    ? undefined
                    : {
                        scale: 1.02,
                      }
                }
                whileTap={
                  loading
                    ? undefined
                    : {
                        scale: 0.98,
                      }
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  background: `linear-gradient(
                    135deg,
                    ${colors.secondary},
                    ${colors.primary}
                  )`,
                }}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}

                {loading
                  ? 'Entrando...'
                  : 'Entrar'}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}