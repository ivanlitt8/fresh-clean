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
    return `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Thank you for contacting us.</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 16px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600"
                    style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style=" height: 8px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="background-color: #2E1175; width: 80%; height: 10px; border-top-left-radius: 8px;"></td>
                                    <td style="background-color: #83B5BC; width: 20%; height: 10px; border-top-right-radius: 8px;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <img src="https://fnelqwybbuyqbopedfhc.supabase.co/storage/v1/object/public/images//FreshAndCleanName.png"
                                            alt="Helping Crew" width="300" style="display: block;" />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-family: Arial, sans-serif; font-size: 24px; font-weight: normal; color: #333333; padding-bottom: 10px;">
                                        Thank you for contacting us.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f9f9f9; border-radius: 8px; padding: 30px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="font-family: Arial, sans-serif; color: #666666; font-size: 14px; line-height: 1.4; padding-top: 10px; padding-bottom: 10px; ">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #666666;">
                                                                <p>Hello ${contact.name}, <br>
                                                                   Thank you for contacting Helping Crew Cleaning Services. We have received your message and will get back to you as soon as possible.
                                                                </p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #666666;">
                                                                <p>
                                                                    <strong>Your message:</strong><br />
                                                                    "${contact.message}"
                                                                </p>
                                                                <p>
                                                                    We typically respond within 24 hours during business days. If you need immediate assistance, please feel free to call us or send us a WhatsApp message.
                                                                </p>
                                                                <p style="text-align: center;">
                                                                    Best regards, <br>
                                                                    Helping Crew Team
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding-top: 20px;">
                                <tr>
                                    <td style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #333333; padding-bottom: 10px; text-align: center;">
                                        Need help? Contact us
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; padding-bottom: 15px; text-align: center;">
                                        If you need help at any time, our team is available to assist you. <br> You can contact us here.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="text-align: center;">
                                        <a href="https://wa.me/61426459726" style="display: inline-block; background-color: #25D366; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 20px;">
                                            Contact us
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style=" height: 8px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="background-color: #83B5BC; width: 80%; height: 10px; border-bottom-left-radius: 8px;"></td>
                                    <td style="background-color: #2E1175; width: 20%; height: 10px; border-bottom-right-radius: 8px;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <td style="padding: 0 0 20px 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding-top: 20px;">
                <tr>
                    <td align="center" style="font-family: Arial, sans-serif; font-size: 14px; color: #666666;">
                        Helping Crew
                    </td>
                </tr>
                <tr>
                    <td align="center" style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; padding-top: 5px;">
                        Copyright © 2024 All rights reserved
                    </td>
                </tr>
            </table>
        </td>
    </table>
</body>
</html>`;
}

function generateAdminNotification(contact: Contact): string {
    // Plantilla HTML de admin-contact-confirmation
    let html = `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>New contact form submission</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 16px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600"
                    style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="height: 8px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="background-color: #2E1175; width: 80%; height: 10px; border-top-left-radius: 8px;"></td>
                                    <td style="background-color: #83B5BC; width: 20%; height: 10px; border-top-right-radius: 8px;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <img src="https://fnelqwybbuyqbopedfhc.supabase.co/storage/v1/object/public/images//FreshAndCleanName.png"
                                            alt="Helping Crew" width="300" style="display: block;" />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-family: Arial, sans-serif; font-size: 24px; font-weight: normal; color: #333333; padding-bottom: 10px;">
                                        New contact form submission
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f9f9f9; border-radius: 8px; padding: 30px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td style="font-family: Arial, sans-serif; color: #666666; font-size: 14px; line-height: 1.4; padding-top: 10px; padding-bottom: 10px;">
                                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                        <tr>
                                                            <td style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.4; color: #666666;">
                                <span style="font-weight: bold;">Client information:</span>
                                <hr style="border: none; border-top: 1px solid #ccc; margin: 8px 0;" />
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr><td>Name:</td><td>${contact.name}</td></tr>
                                    <tr><td>Email:</td><td>${contact.email}</td></tr>
                                    <tr><td>Phone:</td><td>${contact.phone || 'Not provided'}</td></tr>
                                    <tr><td>Address/Area:</td><td>${contact.address || 'Not provided'}</td></tr>
                                </table>
                                <br />
                                <span style="font-weight: bold;">Message:</span>
                                <hr style="border: none; border-top: 1px solid #ccc; margin: 8px 0;" />
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr><td>${contact.message}</td></tr>
                                </table>
                                <br />
                                <span style="font-weight: bold;">Contact Details:</span>
                                <hr style="border: none; border-top: 1px solid #ccc; margin: 8px 0;" />
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr><td>Submitted:</td><td>${new Date(contact.createdAt).toLocaleString()}</td></tr>
                                    <tr><td>Status:</td><td>${contact.status.toUpperCase()}</td></tr>
                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #666666; padding-top: 20px;">
                                <p>Please respond to this inquiry as soon as possible.</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="height: 8px;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="background-color: #83B5BC; width: 80%; height: 10px; border-bottom-left-radius: 8px;"></td>
                                    <td style="background-color: #2E1175; width: 20%; height: 10px; border-bottom-right-radius: 8px;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
    return html;
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
                // Email automático al cliente (HTML)
                sendEmail({
                    from: process.env.GMAIL_USER,
                    to: contact.email,
                    subject: 'Thank you for contacting Helping Crew - We\'ll be in touch soon!',
                    html: clientEmailContent,
                    text: '', // opcional: puedes poner un fallback plano si lo deseas
                }),
                // Notificación al administrador (HTML)
                sendEmail({
                    from: process.env.GMAIL_USER,
                    to: process.env.ADMIN_EMAIL,
                    subject: `New Contact Form Submission - ${contact.name}`,
                    html: adminEmailContent,
                    text: '', // opcional: puedes poner un fallback plano si lo deseas
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