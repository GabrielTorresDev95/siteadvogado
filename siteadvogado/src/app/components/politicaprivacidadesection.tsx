import { X } from 'lucide-react';

type PoliticaPrivacidadeSectionProps = {
  onClose: () => void;
};

export function PoliticaPrivacidadeSection({
  onClose,
}: PoliticaPrivacidadeSectionProps) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center px-4"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl relative max-h-[85vh] overflow-y-auto p-6 md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Fechar política de privacidade"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
          Política de Privacidade
        </h2>

        <p className="text-gray-700 mb-4">
          Esta Política de Privacidade explica como coletamos, usamos e protegemos
          as informações fornecidas pelos usuários deste site.
        </p>

        <h3 className="text-lg font-bold mt-6 mb-2 text-gray-900">
          1. Coleta de informações
        </h3>
        <p className="text-gray-700">
          Podemos coletar dados como nome, e-mail, telefone e mensagem enviados por
          meio dos formulários de contato disponíveis no site.
        </p>

        <h3 className="text-lg font-bold mt-6 mb-2 text-gray-900">
          2. Uso das informações
        </h3>
        <p className="text-gray-700">
          As informações são utilizadas apenas para contato, atendimento e retorno
          de solicitações relacionadas aos serviços oferecidos.
        </p>

        <h3 className="text-lg font-bold mt-6 mb-2 text-gray-900">
          3. Compartilhamento de dados
        </h3>
        <p className="text-gray-700">
          Não vendemos, alugamos ou compartilhamos dados pessoais com terceiros,
          exceto quando necessário para cumprimento de obrigações legais.
        </p>

        <h3 className="text-lg font-bold mt-6 mb-2 text-gray-900">
          4. Segurança dos dados
        </h3>
        <p className="text-gray-700">
          Adotamos medidas para proteger as informações enviadas contra acesso não
          autorizado, alteração ou divulgação indevida.
        </p>

        <h3 className="text-lg font-bold mt-6 mb-2 text-gray-900">
          5. Contato
        </h3>
        <p className="text-gray-700">
          Para dúvidas, entre em contato pelo e-mail:
          contato@barukregistra.com.br
        </p>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}