const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Certifique-se de que res.json() só é chamado uma vez
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                message: 'Método não permitido'
            });
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
            port: parseInt(process.env.SMTP_PORT),
            secure: false, // TLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verifica conexão primeiro
        await transporter.verify();

        // Envia o email
        const mailResponse = await transporter.sendMail({
            from: process.env.SMTP_USER, // Para Office 365, usar o mesmo email da autenticação
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
            `
        });

        return res.status(200).json({
            success: true,
            message: 'Cotação enviada com sucesso!'
        });

    } catch (error) {
        console.error('Erro:', error);

        // Garante que sempre enviamos um JSON válido
        return res.status(500).json({
            success: false,
            message: 'Erro ao processar sua solicitação. Tente novamente mais tarde.'
        });
    }
}