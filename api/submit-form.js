import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Primeiro, teste simples para verificar se a API está funcionando
    try {
        // Log básico
        console.log('Method:', req.method);
        console.log('Body:', req.body);

        // Retorna uma resposta simples
        return res.status(200).json({
            success: true,
            message: 'API funcionando!',
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