import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    try {
        // Log para debug
        console.log('Requisição recebida:', req.method);
        console.log('Corpo da requisição:', req.body);
        console.log('Variáveis de ambiente:', {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
            toEmail: process.env.TO_EMAIL
        });

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
            host: 'smtp.office365.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false
            }
        });

        const mailData = {
            from: process.env.SMTP_USER,
            to: process.env.TO_EMAIL,
            subject: "Nova Cotação de Serviço de Logística",
            html: `
                <h2>Nova Cotação de Serviço de Logística</h2>
                <p><strong>Nome:</strong> ${req.body.nome}</p>
                <p><strong>Email:</strong> ${req.body.email}</p>
                <p><strong>Telefone:</strong> ${req.body.telefone}</p>
                <p><strong>Dimensões da Carga:</strong> ${req.body.comprimento}m x ${req.body.largura}m x ${req.body.altura}m</p>
                <p><strong>Peso:</strong> ${req.body.peso}kg</p>
                <p><strong>Serviço Principal:</strong> ${req.body.servico}</p>
                <p><strong>Comentários:</strong> ${req.body.comentarios}</p>
            `
        };

        // Log para debug
        console.log('Configuração do email:', mailData);

        try {
            await transporter.verify();
            console.log('Verificação do transportador bem-sucedida');
            
            const info = await transporter.sendMail(mailData);
            console.log('Email enviado:', info);

            return res.status(200).json({
                success: true,
                message: 'Cotação enviada com sucesso!'
            });
        } catch (emailError) {
            console.error('Erro ao enviar email:', emailError);
            throw emailError;
        }

    } catch (error) {
        console.error('Erro detalhado:', {
            message: error.message,
            code: error.code,
            command: error.command,
            stack: error.stack
        });

        return res.status(500).json({
            success: false,
            message: `Erro ao enviar email: ${error.message}`,
            error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        });
    }
}