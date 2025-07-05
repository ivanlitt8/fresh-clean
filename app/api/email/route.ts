import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '@/app/lib/email-config';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Booking } from '@/app/types/booking';

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

function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function generateClientEmailContent(booking: Booking): string {
    const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: enUS });

    // Calcular total de ambientes
    const totalRooms = (parseInt(booking.serviceDetails.bedrooms) || 0) +
                      (parseInt(booking.serviceDetails.bathrooms) || 0) +
                      (parseInt(booking.serviceDetails.kitchens) || 0) +
                      (parseInt(booking.serviceDetails.livingRooms) || 0) +
                      (parseInt(booking.serviceDetails.otherSpaces) || 0);

    return `
Hello ${booking.clientInfo.firstName}!

Your booking has been successfully confirmed. Here are the details:

SERVICE DETAILS
--------------
Service type: ${booking.serviceDetails.serviceType}
Date: ${formattedDate}
Time: ${booking.timing.startTime} - ${booking.timing.endTime}
Estimated duration: ${booking.timing.duration} hours

ROOM DETAILS
-----------
Total rooms: ${totalRooms}
Bedrooms: ${booking.serviceDetails.bedrooms}
Bathrooms: ${booking.serviceDetails.bathrooms}
Kitchens: ${booking.serviceDetails.kitchens}
Living rooms: ${booking.serviceDetails.livingRooms}
Other spaces: ${booking.serviceDetails.otherSpaces}
Address: ${booking.clientInfo.address}
Postal code: ${booking.clientInfo.postalCode}

PRICING
-------
Base price: ${formatPrice(booking.pricing.basePrice)}
Discount: ${formatPrice(booking.pricing.discount)}
Final price: ${formatPrice(booking.pricing.finalPrice)}

${booking.serviceDetails.additionalNotes ? `\nAdditional notes: ${booking.serviceDetails.additionalNotes}\n` : ''}

If you need to modify or cancel your booking, please contact us by replying to this email or calling our customer service number.

Thank you for trusting our services!

Best regards,
The cleaning team
`;
}

function generateAdminEmailContent(booking: Booking): string {
    const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: enUS });

    // Calcular total de ambientes
    const totalRooms = (parseInt(booking.serviceDetails.bedrooms) || 0) +
                      (parseInt(booking.serviceDetails.bathrooms) || 0) +
                      (parseInt(booking.serviceDetails.kitchens) || 0) +
                      (parseInt(booking.serviceDetails.livingRooms) || 0) +
                      (parseInt(booking.serviceDetails.otherSpaces) || 0);

    return `
NEW BOOKING RECEIVED
===================

CLIENT INFORMATION
-----------------
Full name: ${booking.clientInfo.firstName} ${booking.clientInfo.lastName}
Email: ${booking.clientInfo.email}
Phone: ${booking.clientInfo.phone}
Address: ${booking.clientInfo.address}
Postal code: ${booking.clientInfo.postalCode}

SERVICE DETAILS
--------------
Service type: ${booking.serviceDetails.serviceType}
Date: ${formattedDate}
Time: ${booking.timing.startTime} - ${booking.timing.endTime}
Estimated duration: ${booking.timing.duration} hours

ROOM DETAILS
-----------
Total rooms: ${totalRooms}
Bedrooms: ${booking.serviceDetails.bedrooms}
Bathrooms: ${booking.serviceDetails.bathrooms}
Kitchens: ${booking.serviceDetails.kitchens}
Living rooms: ${booking.serviceDetails.livingRooms}
Other spaces: ${booking.serviceDetails.otherSpaces}

PRICING
-------
Base price: ${formatPrice(booking.pricing.basePrice)}
Discount: ${formatPrice(booking.pricing.discount)}
Final price: ${formatPrice(booking.pricing.finalPrice)}

${booking.serviceDetails.additionalNotes ? `\nADDITIONAL CLIENT NOTES\n${booking.serviceDetails.additionalNotes}\n` : ''}

BOOKING STATUS: ${booking.status.toUpperCase()}

Please review this booking and assign the necessary staff.
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
    console.log('API Route /api/email called');

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

        const { bookings } = body as { bookings: Booking[] };

        if (!bookings || !bookings.length) {
            console.error('No booking data provided');
            return NextResponse.json(
                { error: 'No booking data provided' },
                { status: 400 }
            );
        }

        const mainBooking = bookings[0];
        const isRecurring = bookings.length > 1;

        // Preparar contenido del email para el cliente
        let clientEmailContent = generateClientEmailContent(mainBooking);
        if (isRecurring) {
            clientEmailContent += '\nUPCOMING SCHEDULED DATES\n';
            clientEmailContent += '------------------------\n';
            bookings.slice(1).forEach(booking => {
                const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: enUS });
                clientEmailContent += `${formattedDate}: ${booking.timing.startTime} - ${booking.timing.endTime}\n`;
            });
        }

        // Preparar contenido del email para el administrador
        let adminEmailContent = generateAdminEmailContent(mainBooking);
        if (isRecurring) {
            adminEmailContent += '\nSCHEDULED RECURRING BOOKINGS\n';
            adminEmailContent += '----------------------------\n';
            bookings.slice(1).forEach(booking => {
                const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: enUS });
                adminEmailContent += `${formattedDate}: ${booking.timing.startTime} - ${booking.timing.endTime}\n`;
            });
        }

        // Enviar emails en paralelo
        try {
            await Promise.all([
                // Email al cliente
                sendEmail({
                    from: process.env.GMAIL_USER,
                    to: mainBooking.clientInfo.email,
                    subject: isRecurring
                        ? EMAIL_CONFIG.subjects.recurringBookingConfirmation
                        : EMAIL_CONFIG.subjects.bookingConfirmation,
                    text: clientEmailContent
                }),
                // Email al administrador
                sendEmail({
                    from: process.env.GMAIL_USER,
                    to: process.env.ADMIN_EMAIL,
                    subject: isRecurring
                        ? EMAIL_CONFIG.subjects.adminNewRecurringBooking
                        : EMAIL_CONFIG.subjects.adminNewBooking,
                    text: adminEmailContent
                })
            ]);

            console.log('Emails sent successfully');
            return NextResponse.json({
                success: true,
                message: 'Emails sent successfully'
            });
        } catch (emailError) {
            console.error('Error sending emails:', emailError);
            return NextResponse.json(
                { error: 'Error sending emails', details: emailError },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error },
            { status: 500 }
        );
    }
} 