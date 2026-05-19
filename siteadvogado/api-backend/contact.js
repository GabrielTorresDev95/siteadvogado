import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { name, whatsapp, email, service, message } = req.body || {};

    if (!name || !whatsapp || !email || !service) {
      return res.status(400).json({
        error: 'Preencha todos os campos obrigatórios.',
      });
    }

    await resend.emails.send({
      from: 'Baruk Registro <contato@barukregistra.com.br>', // padrão gratuito
      to: process.env.CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `Nova consulta pelo site - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Nova consulta recebida</h2>
          
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Serviço:</strong> ${service}</p>
          
          <p><strong>Mensagem:</strong></p>
          <div style="background:#f5f5f5;padding:10px;border-radius:8px;">
            ${message ? message.replace(/\n/g, '<br>') : 'Não informado'}
          </div>
        </div>
      `,
      text: `
Nova consulta recebida

Nome: ${name}
Email: ${email}
WhatsApp: ${whatsapp}
Serviço: ${service}
Mensagem: ${message || 'Não informado'}
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Email enviado com sucesso.',
    });

  } catch (error) {
    console.error('Erro ao enviar email:', error);

    return res.status(500).json({
      error: 'Erro interno ao enviar email.',
    });
  }
}