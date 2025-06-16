import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Booking } from '@/app/types/booking';

// Configuración del transportador de email
const transporter = nodemailer.createTransport({
    service: 'gmail',
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

export const handler: Handler = async (event) => {
    // Solo permitir método POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método no permitido' })
        };
    }

    try {
        // Verificar variables de entorno
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.ADMIN_EMAIL) {
            console.error('Faltan variables de entorno necesarias');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Error de configuración del servidor' })
            };
        }

        // Parsear el cuerpo de la solicitud
        const { bookings } = JSON.parse(event.body || '{}');
        console.log('Datos recibidos:', JSON.stringify(bookings, null, 2));

        if (!bookings || !bookings.length) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No se proporcionaron datos de reserva' })
            };
        }

        const mainBooking = bookings[0];
        const isRecurring = bookings.length > 1;

        // Preparar contenido de emails
        let clientEmailContent = generateClientEmailContent(mainBooking);
        let adminEmailContent = generateAdminEmailContent(mainBooking);

        // Agregar información de reservas recurrentes si existen
        if (isRecurring) {
            const recurringDates = bookings.slice(1).map((booking: Booking) => {
                const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: es });
                return `${formattedDate}: ${booking.timing.startTime} - ${booking.timing.endTime}`;
            }).join('\n');

            const recurringSection = `\nPRÓXIMAS FECHAS PROGRAMADAS\n-------------------------\n${recurringDates}\n`;
            clientEmailContent += recurringSection;
            adminEmailContent += `\nRESERVAS RECURRENTES PROGRAMADAS\n------------------------------\n${recurringDates}\n`;
        }

        // Enviar emails
        await Promise.all([
            // Email al cliente
            transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: mainBooking.clientInfo.email,
                subject: isRecurring ? 'Confirmación de tus reservas recurrentes de limpieza' : 'Confirmación de tu reserva de limpieza',
                text: clientEmailContent
            }),
            // Email al administrador
            transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: process.env.ADMIN_EMAIL,
                subject: isRecurring ? 'Nueva reserva recurrente recibida' : 'Nueva reserva recibida',
                text: adminEmailContent
            })
        ]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Emails enviados correctamente'
            })
        };
    } catch (error) {
        console.error('Error en el servidor:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error al procesar la solicitud',
                details: error instanceof Error ? error.message : 'Error desconocido'
            })
        };
    }
}; 