import { useState } from 'react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback('');

    try {
      const response = await fetch('/contato.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newsletter: true,
          email,
        }),
      });

      const text = await response.text();

      console.log('STATUS:', response.status);
      console.log('RESPOSTA DO PHP:', text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        setFeedback('O PHP não retornou JSON. Veja o console.');
        return;
      }

      if (data.success) {
        setFeedback('Email cadastrado com sucesso!');
        setEmail('');
      } else {
        setFeedback(data.error || 'Erro ao cadastrar email.');
      }
    } catch (error) {
      console.error('ERRO FETCH:', error);
      setFeedback('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 px-4 bg-[#446c94] text-white">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm uppercase tracking-widest text-blue-100 mb-3">
          Newsletter
        </p>

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Receba novidades e conteúdos jurídicos
        </h2>

        <p className="text-blue-100 mb-8">
          Cadastre seu email para receber informações, atualizações e conteúdos importantes.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-3 max-w-xl mx-auto"
        >
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-lg px-4 py-3 text-slate-900 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-white px-6 py-3 font-semibold text-[#446c94] hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        {feedback && (
          <p className="mt-4 text-sm text-white">
            {feedback}
          </p>
        )}
      </div>
    </section>
  );
}