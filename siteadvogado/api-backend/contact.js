import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://barukregistra.com.br');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { name, whatsapp, email, service, message } = req.body || {};

  if (!name || !whatsapp || !email || !service) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    await resend.emails.send({
      from: 'Baruk Registro <contato@barukregistra.com.br>',', // após verificar domínio
      to: 'torres.almeida95@gmail.com',
      reply_to: email,
      subject: `Nova consulta pelo site - ${service}`,
      html: `<p><b>Nome:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>WhatsApp:</b> ${whatsapp}</p><p><b>Serviço:</b> ${service}</p><p><b>Mensagem:</b> ${message || 'Não informado'}</p>`,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao enviar email.' });
  }
}