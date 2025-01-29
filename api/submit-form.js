import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com', // Replace with your email
                pass: process.env.EMAIL_PASSWORD // Add this to your Vercel environment variables
            }
        });

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

        // Email content
        const mailOptions = {
            from: 'your-email@gmail.com', // Replace with your email
            to: 'destination@email.com', // Replace with recipient email
            subject: 'Nova Solicitação de Cotação - Eni Transportes',
            html: `
                <h2>Nova Solicitação de Cotação</h2>
                <p><strong>Nome:</strong> ${nome}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${telefone}</p>
                <p><strong>Dimensões:</strong></p>
                <ul>
                    <li>Comprimento: ${comprimento || 'Não informado'} metros</li>
                    <li>Largura: ${largura || 'Não informado'} metros</li>
                    <li>Altura: ${altura || 'Não informado'} metros</li>
                    <li>Peso: ${peso || 'Não informado'} kg</li>
                </ul>
                <p><strong>Serviço:</strong> ${servico}</p>
                <p><strong>Comentários:</strong> ${comentarios || 'Nenhum comentário'}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'Formulário enviado com sucesso! Entraremos em contato em breve.'
        });

    } catch (error) {
        console.error('Erro no servidor:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao enviar formulário. Por favor, tente novamente.'
        });
    }
}