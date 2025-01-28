
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { 
        nome, 
        email, 
        telefone, 
        comprimento, 
        largura, 
        altura, 
        peso, 
        servico, 
        comentarios 
    } = req.body;

    // Basic validation
    if (!nome || !email || !telefone || !servico) {
        return res.status(400).json({ 
            message: 'Por favor, preencha todos os campos obrigatórios.' 
        });
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: process.env.TO_EMAIL,
            subject: "Nova Cotação de Serviço de Logística",
            html: `
                <h2>Nova Cotação de Serviço de Logística</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${telefone}</p>
                <p><strong>Dimensões da Carga:</strong> ${comprimento}m x ${largura}m x ${altura}m</p>
                <p><strong>Peso:</strong> ${peso}kg</p>
                <p><strong>Serviço Principal:</strong> ${servico}</p>
                <p><strong>Comentários:</strong> ${comentarios}</p>
            `,
        });

        res.status(200).json({ message: 'Cotação enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ 
            message: 'Erro ao enviar a cotação. Por favor, tente novamente.' 
        });
    }
}