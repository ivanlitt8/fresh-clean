import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '@/app/lib/email-config';
import { Contact } from '@/app/types/contact';

// Verificar variables de entorno requeridas
const requiredEnvVars = ['GMAIL_USER', 'GMAIL_APP_PASSWORD', 'ADMIN_EMAIL'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Environment variable ${envVar} not found`);
    }
}

const transporter = nodemailer.createTransport({
    service: EMAIL_CONFIG.service,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

function generateClientAutoResponse(contact: Contact): string {
    return `
Hello ${contact.name}!

Thank you for contacting Fresh & Clean Cleaning Services. We have received your message and will get back to you as soon as possible.

Your message:
"${contact.message}"

We typically respond within 24 hours during business days. If you need immediate assistance, please feel free to call us or send us a WhatsApp message.

Best regards,
Fresh & Clean Team
`;
}

function generateAdminNotification(contact: Contact): string {
    return `
NEW CONTACT FORM SUBMISSION
==========================

CLIENT INFORMATION
-----------------
Name: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone || 'Not provided'}
Address/Area: ${contact.address || 'Not provided'}

MESSAGE
-------
${contact.message}

CONTACT DETAILS
--------------
Submitted: ${new Date(contact.createdAt).toLocaleString()}
Status: ${contact.status.toUpperCase()}

Please respond to this inquiry as soon as possible.
`;
}

async function sendEmail(options: nodemailer.SendMailOptions) {
    try {
        await transporter.sendMail(options);
        console.log('Email sent successfully to:', options.to);
    } catch (error) {
        console.error('Detailed error sending email:', error);
        throw error;
    }
}

export async function POST(req: Request) {
    console.log('API Route /api/contact called');

    try {
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.ADMIN_EMAIL) {
            console.error('Missing required environment variables');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const body = await req.json();
        console.log('Body received:', JSON.stringify(body));

        const { contact } = body as { contact: Contact };

        if (!contact) {
            console.error('No contact data provided');
            return NextResponse.json(
                { error: 'No contact data provided' },
                { status: 400 }
            );
        }

        // Preparar contenido de los emails
        const clientEmailContent = generateClientAutoResponse(contact);
        const adminEmailContent = generateAdminNotification(contact);

        // Enviar emails en paralelo
        try {
            await Promise.all([
                // Email automático al cliente
                sendEmail({
                    from: process.env.GMAIL_USER,
                    to: contact.email,
                    subject: 'Thank you for contacting Fresh & Clean - We\'ll be in touch soon!',
                    text: clientEmailContent,
                }),
                // Notificación al administrador
                sendEmail({
                    from: process.env.GMAIL_USER,
                    to: process.env.ADMIN_EMAIL,
                    subject: `New Contact Form Submission - ${contact.name}`,
                    text: adminEmailContent,
                })
            ]);

            console.log('All emails sent successfully');
            return NextResponse.json({ success: true, message: 'Emails sent successfully' });
        } catch (emailError) {
            console.error('Error sending emails:', emailError);
            return NextResponse.json(
                { error: 'Failed to send emails' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Unexpected error in /api/contact:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 