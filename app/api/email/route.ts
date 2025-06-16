import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '@/app/lib/email-config';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Booking } from '@/app/types/booking';

const transporter = nodemailer.createTransport({
    service: EMAIL_CONFIG.service,
    auth: EMAIL_CONFIG.auth
});

function formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function generateClientEmailContent(booking: Booking): string {
    const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: es });

    return `
¡Hola ${booking.clientInfo.firstName}!

Tu reserva ha sido confirmada con éxito. Aquí están los detalles:

DETALLES DEL SERVICIO
--------------------
Tipo de servicio: ${booking.serviceDetails.serviceType}
Fecha: ${formattedDate}
Hora: ${booking.timing.startTime} - ${booking.timing.endTime}
Duración estimada: ${booking.timing.duration} horas

DETALLES DE LA PROPIEDAD
-----------------------
Niveles: ${booking.serviceDetails.levels}
Dormitorios: ${booking.serviceDetails.bedrooms}
Baños: ${booking.serviceDetails.bathrooms}
Dirección: ${booking.clientInfo.address}

PRECIO
------
Precio base: ${formatPrice(booking.pricing.basePrice)}
Descuento: ${formatPrice(booking.pricing.discount)}
Precio final: ${formatPrice(booking.pricing.finalPrice)}

${booking.serviceDetails.additionalNotes ? `\nNotas adicionales: ${booking.serviceDetails.additionalNotes}\n` : ''}

Si necesitas modificar o cancelar tu reserva, por favor contáctanos respondiendo este email o llamando al número de atención al cliente.

¡Gracias por confiar en nuestros servicios!

Saludos,
El equipo de limpieza
`;
}

function generateAdminEmailContent(booking: Booking): string {
    const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: es });

    return `
NUEVA RESERVA RECIBIDA
=====================

INFORMACIÓN DEL CLIENTE
---------------------
Nombre completo: ${booking.clientInfo.firstName} ${booking.clientInfo.lastName}
Email: ${booking.clientInfo.email}
Teléfono: ${booking.clientInfo.phone}
Dirección: ${booking.clientInfo.address}

DETALLES DEL SERVICIO
--------------------
Tipo de servicio: ${booking.serviceDetails.serviceType}
Fecha: ${formattedDate}
Hora: ${booking.timing.startTime} - ${booking.timing.endTime}
Duración estimada: ${booking.timing.duration} horas

DETALLES DE LA PROPIEDAD
-----------------------
Niveles: ${booking.serviceDetails.levels}
Dormitorios: ${booking.serviceDetails.bedrooms}
Baños: ${booking.serviceDetails.bathrooms}

PRECIO
------
Precio base: ${formatPrice(booking.pricing.basePrice)}
Descuento: ${formatPrice(booking.pricing.discount)}
Precio final: ${formatPrice(booking.pricing.finalPrice)}

${booking.serviceDetails.additionalNotes ? `\nNOTAS ADICIONALES DEL CLIENTE\n${booking.serviceDetails.additionalNotes}\n` : ''}

ESTADO DE LA RESERVA: ${booking.status.toUpperCase()}

Por favor, revisa esta reserva y asigna el personal necesario.
`;
}

async function sendEmail(options: nodemailer.SendMailOptions) {
    try {
        await transporter.sendMail(options);
        console.log('Email enviado exitosamente a:', options.to);
    } catch (error) {
        console.error('Error al enviar email a:', options.to, error);
        throw error;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { bookings } = body as { bookings: Booking[] };

        if (!bookings || !bookings.length) {
            return NextResponse.json(
                { error: 'No se proporcionaron datos de reserva' },
                { status: 400 }
            );
        }

        const mainBooking = bookings[0];
        const isRecurring = bookings.length > 1;

        // Preparar contenido del email para el cliente
        let clientEmailContent = generateClientEmailContent(mainBooking);
        if (isRecurring) {
            clientEmailContent += '\nPRÓXIMAS FECHAS PROGRAMADAS\n';
            clientEmailContent += '-------------------------\n';
            bookings.slice(1).forEach(booking => {
                const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: es });
                clientEmailContent += `${formattedDate}: ${booking.timing.startTime} - ${booking.timing.endTime}\n`;
            });
        }

        // Preparar contenido del email para el administrador
        let adminEmailContent = generateAdminEmailContent(mainBooking);
        if (isRecurring) {
            adminEmailContent += '\nRESERVAS RECURRENTES PROGRAMADAS\n';
            adminEmailContent += '------------------------------\n';
            bookings.slice(1).forEach(booking => {
                const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: es });
                adminEmailContent += `${formattedDate}: ${booking.timing.startTime} - ${booking.timing.endTime}\n`;
            });
        }

        // Enviar emails en paralelo
        await Promise.all([
            // Email al cliente
            sendEmail({
                from: EMAIL_CONFIG.from,
                to: mainBooking.clientInfo.email,
                subject: isRecurring
                    ? EMAIL_CONFIG.subjects.recurringBookingConfirmation
                    : EMAIL_CONFIG.subjects.bookingConfirmation,
                text: clientEmailContent
            }),
            // Email al administrador
            sendEmail({
                from: EMAIL_CONFIG.from,
                to: EMAIL_CONFIG.adminEmail,
                subject: isRecurring
                    ? EMAIL_CONFIG.subjects.adminNewRecurringBooking
                    : EMAIL_CONFIG.subjects.adminNewBooking,
                text: adminEmailContent
            })
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error al enviar emails:', error);
        return NextResponse.json(
            { error: 'Error al enviar los emails' },
            { status: 500 }
        );
    }
} 