import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Booking } from '@/app/types/booking';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

// Plantilla de email para administrador
const ADMIN_EMAIL_TEMPLATE = `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Nueva reserva recibida vía web</title>
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
                                            alt="Fresh & Clean" width="300" style="display: block;" />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-family: Arial, sans-serif; font-size: 24px; font-weight: normal; color: #333333; padding-bottom: 10px;">
                                        Nueva reserva recibida vía web
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
                                                                <p>Por favor revisa la siguiente reserva y asigna el personal necesario:</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 20px 0 5px 0;">
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; border-collapse: collapse;">
                                                                    <tr>
                                                                        <td width="60%" style="padding: 10px; border-right: 1px solid #e0e0e0; vertical-align: top; font-size: 14px;">
                                                                            <strong>Información del cliente:</strong><br>
                                                                            Nombre Completo: $USER_FULL_NAME<br>
                                                                            Email: $USER_EMAIL<br>
                                                                            Teléfono: $USER_PHONE<br>
                                                                            Dirección: $USER_ADDRESS
                                                                        </td>
                                                                        <td width="40%" style="padding: 10px; vertical-align: top;">
                                                                            <strong>Detalles:</strong><br>
                                                                            Niveles: $LEVELS<br>
                                                                            Dormitorios: $BEDROOMS<br>
                                                                            Baños: $BATHROOMS
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; border-collapse: collapse;">
                                                                    <tr>
                                                                        <td width="100%" style="padding: 10px; border-right: 1px solid #e0e0e0; vertical-align: top; font-size: 14px;">
                                                                            <strong>Detalles del servicio:</strong><br>
                                                                            Servicio: $SERVICE_TYPE<br>
                                                                            Fecha: $DATE<br>
                                                                            Hora: $TIME<br>
                                                                            Tiempo estimado: $ESTIMATED_TIME
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 20px 0;">
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                                                    <tr style="background-color: #f0f0f0;">
                                                                        <th align="left" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Descripción</th>
                                                                        <th align="center" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Horas</th>
                                                                        <th align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Precio</th>
                                                                        <th align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">IVA</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">$SERVICE_NAME</td>
                                                                        <td align="center" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">x $ESTIMATED_TIME</td>
                                                                        <td align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">$SERVICE_PRICE</td>
                                                                        <td align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">$SERVICE_FEE</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="2" style="padding: 12px 10px 6px 10px;"></td>
                                                                        <td align="right" style="padding: 12px 10px 6px 10px; white-space: nowrap;">
                                                                            <strong>Subtotal:</strong>
                                                                        </td>
                                                                        <td align="right" style="padding: 12px 10px 6px 10px;">
                                                                            $SUBTOTAL
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="2" style="padding: 6px 10px;"></td>
                                                                        <td align="right" style="padding: 6px 10px; white-space: nowrap;">
                                                                            <strong>Impuestos:</strong>
                                                                        </td>
                                                                        <td align="right" style="padding: 6px 10px;">$TOTAL_FEES</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="2" style="padding: 6px 10px;"></td>
                                                                        <td align="right" style="padding: 6px 10px; white-space: nowrap;">
                                                                            <strong>Monto Total:</strong>
                                                                        </td>
                                                                        <td align="right" style="padding: 6px 10px;">
                                                                            <strong>$TOTAL_AMOUNT</strong>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #666666; padding-top: 20px;">
                                                                <p>En caso de que haya algún conflicto con la disponibilidad o se requiera ajustar algo, contactá al cliente para coordinar directamente.</p>
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

// Plantilla de email para cliente
const CLIENT_EMAIL_TEMPLATE = `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Confirmación de tu reserva de limpieza</title>
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
                                            alt="Fresh & Clean" width="300" style="display: block;" />
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="font-family: Arial, sans-serif; font-size: 24px; font-weight: normal; color: #333333; padding-bottom: 10px;">
                                        Confirmación de tu reserva de limpieza
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
                                                                <p>Hola $USER_FULL_NAME, <br>
                                                                    Tu reserva ha sido confirmada con éxito. Aquí están los detalles:</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 20px 0 5px 0;">
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; border-collapse: collapse;">
                                                                    <tr>
                                                                        <td width="60%" style="padding: 10px; border-right: 1px solid #e0e0e0; vertical-align: top; font-size: 14px;">
                                                                            <strong>Detalles del servicio:</strong><br>
                                                                            Fecha: $DATE<br>
                                                                            Hora: $TIME<br>
                                                                            Duración estimada: $ESTIMATED_TIME
                                                                        </td>
                                                                        <td width="40%" style="padding: 10px; vertical-align: top;">
                                                                            <strong>Detalles:</strong><br>
                                                                            Niveles: $LEVELS<br>
                                                                            Dormitorios: $BEDROOMS<br>
                                                                            Baños: $BATHROOMS
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 20px 0;">
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                                                    <tr style="background-color: #f0f0f0;">
                                                                        <th align="left" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Descripción</th>
                                                                        <th align="center" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Horas</th>
                                                                        <th align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Precio</th>
                                                                        <th align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">IVA</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">$SERVICE_NAME</td>
                                                                        <td align="center" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">x $ESTIMATED_TIME</td>
                                                                        <td align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">$SERVICE_PRICE</td>
                                                                        <td align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">$SERVICE_FEE</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="2" style="padding: 12px 10px 6px 10px;"></td>
                                                                        <td align="right" style="padding: 12px 10px 6px 10px; white-space: nowrap;">
                                                                            <strong>Subtotal:</strong>
                                                                        </td>
                                                                        <td align="right" style="padding: 12px 10px 6px 10px;">$SUBTOTAL</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="2" style="padding: 6px 10px;"></td>
                                                                        <td align="right" style="padding: 6px 10px; white-space: nowrap;">
                                                                            <strong>Impuestos:</strong>
                                                                        </td>
                                                                        <td align="right" style="padding: 6px 10px;">$TOTAL_FEES</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="2" style="padding: 6px 10px;"></td>
                                                                        <td align="right" style="padding: 6px 10px; white-space: nowrap;">
                                                                            <strong>Monto Total:</strong>
                                                                        </td>
                                                                        <td align="right" style="padding: 6px 10px;">
                                                                            <strong>$TOTAL_AMOUNT</strong>
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #666666; padding-top: 20px;">
                                                                <p>El valor es estimado y puede ajustarse según condiciones no previstas en el lugar.</p>
                                                                <p>Si necesitas modificar o cancelar tu reserva, por favor contáctanos respondiendo este email o escribiendo.</p>
                                                                <p style="text-align: center;">¡Gracias por confiar en nuestros servicios!</p>
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
                                        ¿Necesitas ayuda? Contactanos
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-family: Arial, sans-serif; font-size: 14px; color: #666666; padding-bottom: 15px; text-align: center;">
                                        Si en algún momento necesitas ayuda, nuestro equipo está disponible para asistirte. Podes contactarnos aquí.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="text-align: center;">
                                        <a href="https://wa.me/1234567890" style="display: inline-block; background-color: #25D366; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 20px;">
                                            Contactate con nosotros
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
                        Fresh & Clean
                    </td>
                </tr>
                <tr>
                    <td align="center" style="font-family: Arial, sans-serif; font-size: 12px; color: #999999; padding-top: 5px;">
                        Copyright © 2024 Todos los derechos reservados
                    </td>
                </tr>
            </table>
        </td>
    </table>
</body>
</html>`;

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

function replaceTemplateVariables(template: string, variables: Record<string, string | number>): string {
    return Object.entries(variables).reduce((html, [key, value]) => {
        const regex = new RegExp(`\\$${key}`, 'g');
        return html.replace(regex, String(value));
    }, template);
}

async function generateAdminEmailHtml(booking: Booking): Promise<string> {
    try {
        const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: es });

        // Calcular impuestos como la diferencia entre el precio final y (precio base - descuento)
        const calculatedTax = booking.pricing.finalPrice - (booking.pricing.basePrice - booking.pricing.discount);

        const variables = {
            USER_FULL_NAME: `${booking.clientInfo.firstName} ${booking.clientInfo.lastName}`,
            USER_EMAIL: booking.clientInfo.email,
            USER_PHONE: booking.clientInfo.phone,
            USER_ADDRESS: booking.clientInfo.address,
            LEVELS: booking.serviceDetails.levels,
            BEDROOMS: booking.serviceDetails.bedrooms,
            BATHROOMS: booking.serviceDetails.bathrooms,
            SERVICE_TYPE: booking.serviceDetails.serviceType,
            DATE: formattedDate,
            TIME: `${booking.timing.startTime} - ${booking.timing.endTime}`,
            ESTIMATED_TIME: `${booking.timing.duration} horas`,
            SERVICE_NAME: booking.serviceDetails.serviceType,
            SERVICE_PRICE: formatPrice(booking.pricing.basePrice),
            SERVICE_FEE: formatPrice(booking.pricing.discount),
            SUBTOTAL: formatPrice(booking.pricing.basePrice - booking.pricing.discount),
            TOTAL_FEES: formatPrice(calculatedTax),
            TOTAL_AMOUNT: formatPrice(booking.pricing.finalPrice)
        };

        return replaceTemplateVariables(ADMIN_EMAIL_TEMPLATE, variables);
    } catch (error) {
        console.error('Error generating admin email HTML:', error);
        throw error;
    }
}

async function generateClientEmailHtml(booking: Booking): Promise<string> {
    try {
        const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: es });

        // Calcular impuestos como la diferencia entre el precio final y (precio base - descuento)
        const calculatedTax = booking.pricing.finalPrice - (booking.pricing.basePrice - booking.pricing.discount);

        const variables = {
            USER_FULL_NAME: `${booking.clientInfo.firstName} ${booking.clientInfo.lastName}`,
            LEVELS: booking.serviceDetails.levels,
            BEDROOMS: booking.serviceDetails.bedrooms,
            BATHROOMS: booking.serviceDetails.bathrooms,
            DATE: formattedDate,
            TIME: `${booking.timing.startTime} - ${booking.timing.endTime}`,
            ESTIMATED_TIME: `${booking.timing.duration} horas`,
            SERVICE_NAME: booking.serviceDetails.serviceType,
            SERVICE_PRICE: formatPrice(booking.pricing.basePrice),
            SERVICE_FEE: formatPrice(booking.pricing.discount),
            SUBTOTAL: formatPrice(booking.pricing.basePrice - booking.pricing.discount),
            TOTAL_FEES: formatPrice(calculatedTax),
            TOTAL_AMOUNT: formatPrice(booking.pricing.finalPrice)
        };

        return replaceTemplateVariables(CLIENT_EMAIL_TEMPLATE, variables);
    } catch (error) {
        console.error('Error generating client email HTML:', error);
        throw error;
    }
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
        let adminEmailHtml: string;
        let clientEmailHtml: string;

        try {
            adminEmailHtml = await generateAdminEmailHtml(mainBooking);
            clientEmailHtml = await generateClientEmailHtml(mainBooking);
        } catch (error) {
            console.error('Error generating HTML emails, falling back to text:', error);
            adminEmailHtml = '';
            clientEmailHtml = '';
        }

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
                html: clientEmailHtml || undefined,
                text: clientEmailContent // Fallback si falla el HTML
            }),
            // Email al administrador
            transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: process.env.ADMIN_EMAIL,
                subject: isRecurring ? 'Nueva reserva recurrente recibida' : 'Nueva reserva recibida',
                html: adminEmailHtml || undefined,
                text: adminEmailContent // Fallback si falla el HTML
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