import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors({
  origin: [
    'https://barukregistra.com.br',
    'https://www.barukregistra.com.br'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'Backend rodando com sucesso.',
  });
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
      from: 'Baruk Registro <contato@barukregistra.com.br>',
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Nova consulta pelo site - ${service}`,
      html: `
        <div>
          <h2>Nova consulta recebida</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>WhatsApp:</strong> ${whatsapp}</p>
          <p><strong>Serviço:</strong> ${service}</p>
          <p><strong>Mensagem:</strong> ${message || 'Não informado'}</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
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
  console.log(`Servidor rodando na porta ${port}`);
});