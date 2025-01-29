import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    try {
        console.log('Requisição recebida:', {
            method: req.method,
            body: req.body
        });

        // Simples teste de resposta
        return res.status(200).json({
            success: true,
            message: 'Formulário recebido com sucesso!',
            data: req.body
        });

    } catch (error) {
        console.error('Erro:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
}