import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Backend rodando com sucesso.' });
});

app.post('/contact', async (req, res) => {
  try {
    const { name, whatsapp, email, service, message } = req.body || {};

    if (!name || !whatsapp || !email || !service) {
      return res.status(400).json({
        error: 'Preencha todos os campos obrigatórios.',
      });
    }

    const result = await resend.emails.send({
      from: 'Site <onboarding@resend.dev>',
      to: process.env.CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `Nova consulta pelo site - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>Nova consulta recebida</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Serviço:</strong> ${service}</p>
          <p><strong>Mensagem:</strong></p>
          <div style="padding: 12px; background: #f5f5f5; border-radius: 8px;">
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
      result,
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);

    return res.status(500).json({
      error: 'Erro interno ao enviar email.',
    });
  }
});

app.listen(port, () => {
  console.log(`Backend rodando em http://localhost:${port}`);
});