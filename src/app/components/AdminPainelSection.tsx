import {
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import {
  AlertCircle,
  CheckCircle2,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  Send,
  Users,
  X,
} from 'lucide-react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import { useTheme } from '../context/ThemeContext';

/*
|--------------------------------------------------------------------------
| Tipos
|--------------------------------------------------------------------------
*/

type Admin = {
  id: number;
  nome: string;
  email: string;
};

type NewsletterSubscriber = {
  id: number;
  email: string;
};

type NewsletterApiResponse = {
  success?: boolean;

  message?: string;

  error?: string;

  total?: number;

  enviados?: number;

  falhas?: number;

  inscritos?: NewsletterSubscriber[];
};

type AdminPanelProps = {
  isOpen: boolean;

  admin: Admin | null;

  onClose: () => void;

  onLogout: () => Promise<void>;
};

/*
|--------------------------------------------------------------------------
| Componente
|--------------------------------------------------------------------------
*/

export function AdminPanel({
  isOpen,
  admin,
  onClose,
  onLogout,
}: AdminPanelProps) {
  const { colors } = useTheme();

  /*
  |--------------------------------------------------------------------------
  | Newsletter
  |--------------------------------------------------------------------------
  */

  const [
    subscribers,
    setSubscribers,
  ] = useState<NewsletterSubscriber[]>([]);

  const [
    subject,
    setSubject,
  ] = useState('');

  const [
    message,
    setMessage,
  ] = useState('');

  /*
  |--------------------------------------------------------------------------
  | Estados
  |--------------------------------------------------------------------------
  */

  const [
    loadingSubscribers,
    setLoadingSubscribers,
  ] = useState(false);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const [
    feedback,
    setFeedback,
  ] = useState('');

  const [
    feedbackType,
    setFeedbackType,
  ] = useState<
    'success' |
    'error' |
    ''
  >('');

  /*
  |--------------------------------------------------------------------------
  | Abrir painel
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';

      return;
    }

    document.body.style.overflow =
      'hidden';

    void loadSubscribers();

    return () => {
      document.body.style.overflow =
        '';
    };
  }, [isOpen]);

  /*
  |--------------------------------------------------------------------------
  | Converter resposta PHP
  |--------------------------------------------------------------------------
  */

  const readApiResponse = async (
    response: Response,
  ): Promise<NewsletterApiResponse> => {
    const responseText =
      await response.text();

    console.log(
      'Resposta newsletter-admin.php:',
      responseText,
    );

    /*
    |--------------------------------------------------------------------------
    | PHP retornou vazio
    |--------------------------------------------------------------------------
    */

    if (
      !responseText.trim()
    ) {
      throw new Error(
        'O servidor retornou uma resposta vazia.',
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Converter JSON
    |--------------------------------------------------------------------------
    */

    try {
      return JSON.parse(
        responseText,
      ) as NewsletterApiResponse;
    } catch {
      console.error(
        'Resposta inválida recebida:',
        responseText,
      );

      throw new Error(
        'O PHP retornou uma resposta inválida. Verifique o newsletter-admin.php.',
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Carregar inscritos
  |--------------------------------------------------------------------------
  */

  const loadSubscribers =
    async () => {
      setLoadingSubscribers(
        true,
      );

      /*
      |--------------------------------------------------------------------------
      | Não apagamos mensagens de sucesso do envio automaticamente.
      |--------------------------------------------------------------------------
      */

      try {
        const response =
          await fetch(
            '/newsletter-admin.php',
            {
              method: 'GET',

              credentials:
                'include',

              headers: {
                Accept:
                  'application/json',
              },

              cache:
                'no-store',
            },
          );

        const data =
          await readApiResponse(
            response,
          );

        /*
        |--------------------------------------------------------------------------
        | Sessão expirada
        |--------------------------------------------------------------------------
        */

        if (
          response.status === 401
        ) {
          throw new Error(
            'Sua sessão expirou. Faça login novamente.',
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Erro da API
        |--------------------------------------------------------------------------
        */

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ||
              'Não foi possível carregar os inscritos.',
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Atualizar lista
        |--------------------------------------------------------------------------
        */

        setSubscribers(
          data.inscritos ?? [],
        );
      } catch (error) {
        console.error(
          'Erro ao carregar newsletter:',
          error,
        );

        setSubscribers([]);

        setFeedbackType(
          'error',
        );

        setFeedback(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar os inscritos.',
        );
      } finally {
        setLoadingSubscribers(
          false,
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Enviar newsletter
  |--------------------------------------------------------------------------
  */

  const handleSendNewsletter =
    async (
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      /*
      |--------------------------------------------------------------------------
      | Limpar
      |--------------------------------------------------------------------------
      */

      const cleanSubject =
        subject.trim();

      const cleanMessage =
        message.trim();

      setFeedback('');

      setFeedbackType('');

      /*
      |--------------------------------------------------------------------------
      | Validações
      |--------------------------------------------------------------------------
      */

      if (
        cleanSubject.length < 3
      ) {
        setFeedbackType(
          'error',
        );

        setFeedback(
          'Digite um assunto com pelo menos 3 caracteres.',
        );

        return;
      }

      if (
        cleanSubject.length > 150
      ) {
        setFeedbackType(
          'error',
        );

        setFeedback(
          'O assunto pode ter no máximo 150 caracteres.',
        );

        return;
      }

      if (
        cleanMessage.length < 10
      ) {
        setFeedbackType(
          'error',
        );

        setFeedback(
          'Digite uma mensagem com pelo menos 10 caracteres.',
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Nenhum inscrito
      |--------------------------------------------------------------------------
      */

      if (
        subscribers.length === 0
      ) {
        setFeedbackType(
          'error',
        );

        setFeedback(
          'Nenhum e-mail está cadastrado na newsletter.',
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Confirmação
      |--------------------------------------------------------------------------
      */

      const confirmed =
        window.confirm(
          `Deseja enviar esta mensagem para ${subscribers.length} inscrito(s)?`,
        );

      if (!confirmed) {
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Enviando
      |--------------------------------------------------------------------------
      */

      setSending(true);

      try {
        const response =
          await fetch(
            '/newsletter-admin.php',
            {
              method: 'POST',

              credentials:
                'include',

              headers: {
                'Content-Type':
                  'application/json',

                Accept:
                  'application/json',
              },

              body:
                JSON.stringify({
                  subject:
                    cleanSubject,

                  message:
                    cleanMessage,
                }),
            },
          );

        /*
        |--------------------------------------------------------------------------
        | Resposta
        |--------------------------------------------------------------------------
        */

        const data =
          await readApiResponse(
            response,
          );

        /*
        |--------------------------------------------------------------------------
        | Sessão
        |--------------------------------------------------------------------------
        */

        if (
          response.status === 401
        ) {
          throw new Error(
            'Sua sessão expirou. Faça login novamente.',
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Erro
        |--------------------------------------------------------------------------
        */

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ||
              'Não foi possível enviar a newsletter.',
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Resultado
        |--------------------------------------------------------------------------
        */

        const enviados =
          data.enviados ?? 0;

        const falhas =
          data.falhas ?? 0;

        setFeedbackType(
          'success',
        );

        setFeedback(
          `Newsletter concluída: ${enviados} enviada(s) e ${falhas} falha(s).`,
        );

        /*
        |--------------------------------------------------------------------------
        | Atualizar inscritos
        |--------------------------------------------------------------------------
        */

        await loadSubscribers();

        /*
        |--------------------------------------------------------------------------
        | Limpar formulário quando tudo deu certo
        |--------------------------------------------------------------------------
        */

        if (
          falhas === 0
        ) {
          setSubject('');

          setMessage('');
        }
      } catch (error) {
        console.error(
          'Erro ao enviar newsletter:',
          error,
        );

        setFeedbackType(
          'error',
        );

        setFeedback(
          error instanceof Error
            ? error.message
            : 'Erro inesperado ao enviar a newsletter.',
        );
      } finally {
        setSending(
          false,
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout =
    async () => {
      setLoggingOut(
        true,
      );

      try {
        await onLogout();
      } catch (error) {
        console.error(
          'Erro ao sair:',
          error,
        );

        setFeedbackType(
          'error',
        );

        setFeedback(
          'Não foi possível encerrar a sessão.',
        );
      } finally {
        setLoggingOut(
          false,
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="
            fixed
            inset-0
            z-[120]
            overflow-y-auto
            bg-slate-950/70
            p-3
            backdrop-blur-sm
            sm:p-6
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-panel-title"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.98,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              mx-auto
              w-full
              max-w-7xl
              overflow-hidden
              rounded-3xl
              bg-slate-50
              shadow-2xl
            "
          >
            {/* CABEÇALHO */}

            <header
              className="
                relative
                px-5
                py-7
                text-white
                sm:px-8
              "
              style={{
                background:
                  `linear-gradient(
                    135deg,
                    ${colors.primary},
                    ${colors.secondary}
                  )`,
              }}
            >
              <button
                type="button"
                onClick={
                  onClose
                }
                className="
                  absolute
                  right-4
                  top-4
                  rounded-full
                  p-2
                  text-white/80
                  transition
                  hover:bg-white/15
                  hover:text-white
                "
                aria-label="Fechar painel"
              >
                <X
                  className="
                    h-5
                    w-5
                  "
                />
              </button>

              <div
                className="
                  flex
                  items-center
                  gap-4
                  pr-10
                "
              >
                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white/15
                  "
                >
                  <LayoutDashboard
                    className="
                      h-7
                      w-7
                    "
                  />
                </div>

                <div>
                  <p
                    className="
                      text-sm
                      text-white/75
                    "
                  >
                    Painel administrativo
                  </p>

                  <h2
                    id="admin-panel-title"
                    className="
                      text-2xl
                      font-bold
                    "
                  >
                    Olá,{' '}
                    {admin?.nome ||
                      'Administrador'}
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-white/75
                    "
                  >
                    {admin?.email}
                  </p>
                </div>
              </div>
            </header>

            {/* CONTEÚDO */}

            <main
              className="
                p-4
                sm:p-8
              "
            >
              {/* RESUMO */}

              <div
                className="
                  mb-6
                  grid
                  gap-4
                  sm:grid-cols-2
                "
              >
                <SummaryCard
                  title="Inscritos"
                  value={
                    loadingSubscribers
                      ? '...'
                      : String(
                          subscribers.length,
                        )
                  }
                  description="E-mails cadastrados na newsletter"
                  icon={
                    <Users
                      className="
                        h-6
                        w-6
                      "
                    />
                  }
                  color={
                    colors.primary
                  }
                />

                <SummaryCard
                  title="Sistema"
                  value="Ativo"
                  description="Painel de envio disponível"
                  icon={
                    <Mail
                      className="
                        h-6
                        w-6
                      "
                    />
                  }
                  color={
                    colors.secondary
                  }
                />
              </div>

              {/* FEEDBACK */}

              {feedback && (
                <div
                  className="
                    mb-6
                    flex
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    p-4
                  "
                  style={{
                    backgroundColor:
                      feedbackType ===
                      'success'
                        ? '#ecfdf5'
                        : '#fef2f2',

                    borderColor:
                      feedbackType ===
                      'success'
                        ? '#a7f3d0'
                        : '#fecaca',

                    color:
                      feedbackType ===
                      'success'
                        ? '#047857'
                        : '#b91c1c',
                  }}
                >
                  {feedbackType ===
                  'success' ? (
                    <CheckCircle2
                      className="
                        mt-0.5
                        h-5
                        w-5
                        shrink-0
                      "
                    />
                  ) : (
                    <AlertCircle
                      className="
                        mt-0.5
                        h-5
                        w-5
                        shrink-0
                      "
                    />
                  )}

                  <span
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    {feedback}
                  </span>
                </div>
              )}

              {/* GRID */}

              <div
                className="
                  grid
                  gap-6
                  lg:grid-cols-[1.2fr_0.8fr]
                "
              >
                {/* ENVIO */}

                <section
                  className="
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    sm:p-7
                  "
                >
                  <div
                    className="
                      mb-6
                    "
                  >
                    <h3
                      className="
                        text-xl
                        font-bold
                        text-slate-800
                      "
                    >
                      Enviar newsletter
                    </h3>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      A mensagem será
                      enviada para todos
                      os inscritos
                      cadastrados.
                    </p>
                  </div>

                  <form
                    onSubmit={
                      handleSendNewsletter
                    }
                    className="
                      space-y-5
                    "
                  >
                    {/* ASSUNTO */}

                    <div>
                      <label
                        htmlFor="newsletter-subject"
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-slate-700
                        "
                      >
                        Assunto do e-mail
                      </label>

                      <input
                        id="newsletter-subject"
                        type="text"
                        value={
                          subject
                        }
                        onChange={(
                          event,
                        ) =>
                          setSubject(
                            event
                              .target
                              .value,
                          )
                        }
                        maxLength={
                          150
                        }
                        disabled={
                          sending
                        }
                        required
                        placeholder="Ex.: Novidades da Baruk Registra"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-slate-300
                          px-4
                          py-3
                          text-slate-800
                          outline-none
                          transition
                          focus:border-slate-500
                          focus:ring-2
                          focus:ring-slate-200
                          disabled:bg-slate-100
                        "
                      />

                      <p
                        className="
                          mt-1
                          text-right
                          text-xs
                          text-slate-400
                        "
                      >
                        {
                          subject.length
                        }
                        /150
                      </p>
                    </div>

                    {/* MENSAGEM */}

                    <div>
                      <label
                        htmlFor="newsletter-message"
                        className="
                          mb-2
                          block
                          text-sm
                          font-semibold
                          text-slate-700
                        "
                      >
                        Mensagem
                      </label>

                      <textarea
                        id="newsletter-message"
                        value={
                          message
                        }
                        onChange={(
                          event,
                        ) =>
                          setMessage(
                            event
                              .target
                              .value,
                          )
                        }
                        rows={12}
                        disabled={
                          sending
                        }
                        required
                        placeholder="Digite aqui a mensagem da newsletter..."
                        className="
                          w-full
                          resize-y
                          rounded-xl
                          border
                          border-slate-300
                          px-4
                          py-3
                          text-slate-800
                          outline-none
                          transition
                          focus:border-slate-500
                          focus:ring-2
                          focus:ring-slate-200
                          disabled:bg-slate-100
                        "
                      />

                      <p
                        className="
                          mt-1
                          text-right
                          text-xs
                          text-slate-400
                        "
                      >
                        {
                          message.length
                        }{' '}
                        caracteres
                      </p>
                    </div>

                    {/* BOTÃO */}

                    <motion.button
                      type="submit"
                      disabled={
                        sending ||
                        loadingSubscribers ||
                        subscribers.length ===
                          0
                      }
                      whileHover={
                        sending
                          ? undefined
                          : {
                              scale:
                                1.02,
                            }
                      }
                      whileTap={
                        sending
                          ? undefined
                          : {
                              scale:
                                0.98,
                            }
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        px-5
                        py-3.5
                        font-semibold
                        text-white
                        shadow-lg
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                      style={{
                        background:
                          `linear-gradient(
                            135deg,
                            ${colors.secondary},
                            ${colors.primary}
                          )`,
                      }}
                    >
                      {sending ? (
                        <Loader2
                          className="
                            h-5
                            w-5
                            animate-spin
                          "
                        />
                      ) : (
                        <Send
                          className="
                            h-5
                            w-5
                          "
                        />
                      )}

                      {sending
                        ? 'Enviando...'
                        : `Enviar para ${subscribers.length} inscrito(s)`}
                    </motion.button>
                  </form>
                </section>

                {/* INSCRITOS */}

                <section
                  className="
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    sm:p-7
                  "
                >
                  <div
                    className="
                      mb-5
                      flex
                      items-center
                      justify-between
                      gap-3
                    "
                  >
                    <div>
                      <h3
                        className="
                          text-xl
                          font-bold
                          text-slate-800
                        "
                      >
                        Inscritos
                      </h3>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-slate-500
                        "
                      >
                        E-mails
                        cadastrados no
                        site
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void loadSubscribers()
                      }
                      disabled={
                        loadingSubscribers
                      }
                      className="
                        rounded-xl
                        border
                        border-slate-200
                        p-3
                        text-slate-600
                        transition
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                      aria-label="Atualizar inscritos"
                    >
                      <RefreshCw
                        className={`h-5 w-5 ${
                          loadingSubscribers
                            ? 'animate-spin'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* CARREGANDO */}

                  {loadingSubscribers ? (
                    <div
                      className="
                        flex
                        min-h-72
                        items-center
                        justify-center
                      "
                    >
                      <div
                        className="
                          flex
                          flex-col
                          items-center
                          gap-3
                          text-slate-500
                        "
                      >
                        <Loader2
                          className="
                            h-7
                            w-7
                            animate-spin
                          "
                        />

                        <span
                          className="
                            text-sm
                          "
                        >
                          Carregando
                          inscritos...
                        </span>
                      </div>
                    </div>
                  ) : subscribers.length ===
                    0 ? (
                    /* VAZIO */

                    <div
                      className="
                        flex
                        min-h-72
                        flex-col
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-dashed
                        border-slate-300
                        p-6
                        text-center
                      "
                    >
                      <Users
                        className="
                          mb-3
                          h-10
                          w-10
                          text-slate-300
                        "
                      />

                      <p
                        className="
                          font-semibold
                          text-slate-600
                        "
                      >
                        Nenhum inscrito
                        encontrado
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          text-slate-400
                        "
                      >
                        Os e-mails
                        aparecerão aqui
                        após o cadastro
                        no site.
                      </p>
                    </div>
                  ) : (
                    /* LISTA */

                    <div
                      className="
                        max-h-[500px]
                        space-y-3
                        overflow-y-auto
                        pr-1
                      "
                    >
                      {subscribers.map(
                        (
                          subscriber,
                          index,
                        ) => (
                          <motion.div
                            key={
                              subscriber.id
                            }
                            initial={{
                              opacity:
                                0,

                              y: 8,
                            }}
                            animate={{
                              opacity:
                                1,

                              y: 0,
                            }}
                            transition={{
                              delay:
                                Math.min(
                                  index *
                                    0.03,

                                  0.3,
                                ),
                            }}
                            className="
                              flex
                              items-center
                              gap-3
                              rounded-2xl
                              border
                              border-slate-200
                              bg-slate-50
                              p-4
                            "
                          >
                            <div
                              className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                              "
                              style={{
                                color:
                                  colors.primary,

                                backgroundColor:
                                  `${colors.primary}12`,
                              }}
                            >
                              <Mail
                                className="
                                  h-5
                                  w-5
                                "
                              />
                            </div>

                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >
                              <p
                                className="
                                  break-all
                                  text-sm
                                  font-semibold
                                  text-slate-700
                                "
                              >
                                {
                                  subscriber.email
                                }
                              </p>

                              <p
                                className="
                                  mt-1
                                  text-xs
                                  text-slate-400
                                "
                              >
                                ID:{' '}
                                {
                                  subscriber.id
                                }
                              </p>
                            </div>
                          </motion.div>
                        ),
                      )}
                    </div>
                  )}
                </section>
              </div>

              {/* RODAPÉ */}

              <footer
                className="
                  mt-8
                  flex
                  flex-col
                  gap-4
                  border-t
                  border-slate-200
                  pt-6
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <p
                  className="
                    text-sm
                    text-slate-500
                  "
                >
                  Administrador
                  conectado:{' '}

                  <strong
                    className="
                      text-slate-700
                    "
                  >
                    {admin?.email}
                  </strong>
                </p>

                <motion.button
                  type="button"
                  onClick={() =>
                    void handleLogout()
                  }
                  disabled={
                    loggingOut
                  }
                  whileHover={
                    loggingOut
                      ? undefined
                      : {
                          scale:
                            1.03,
                        }
                  }
                  whileTap={
                    loggingOut
                      ? undefined
                      : {
                          scale:
                            0.97,
                        }
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-red-600
                    px-5
                    py-3
                    font-semibold
                    text-white
                    transition
                    hover:bg-red-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loggingOut ? (
                    <Loader2
                      className="
                        h-5
                        w-5
                        animate-spin
                      "
                    />
                  ) : (
                    <LogOut
                      className="
                        h-5
                        w-5
                      "
                    />
                  )}

                  {loggingOut
                    ? 'Saindo...'
                    : 'Sair da conta'}
                </motion.button>
              </footer>
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/*
|--------------------------------------------------------------------------
| Card resumo
|--------------------------------------------------------------------------
*/

type SummaryCardProps = {
  title: string;

  value: string;

  description: string;

  icon: ReactNode;

  color: string;
};

function SummaryCard({
  title,
  value,
  description,
  icon,
  color,
}: SummaryCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -3,
      }}
      className="
        rounded-3xl
        border
        bg-white
        p-5
        shadow-sm
      "
      style={{
        borderColor:
          `${color}22`,
      }}
    >
      <div
        className="
          flex
          items-center
          gap-4
        "
      >
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
          "
          style={{
            color,

            backgroundColor:
              `${color}12`,
          }}
        >
          {icon}
        </div>

        <div>
          <p
            className="
              text-sm
              font-medium
              text-slate-500
            "
          >
            {title}
          </p>

          <p
            className="
              text-2xl
              font-bold
              text-slate-800
            "
          >
            {value}
          </p>
        </div>
      </div>

      <p
        className="
          mt-3
          text-sm
          text-slate-500
        "
      >
        {description}
      </p>
    </motion.div>
  );
}