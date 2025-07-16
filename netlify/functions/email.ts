import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
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
    <title>New booking received via web</title>
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
                                        New booking received via web
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
                                                                <p>Please review the following booking and assign the necessary staff:</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 20px 0 5px 0;">
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; border-collapse: collapse;">
                                                                    <tr>
                                                                        <td width="60%" style="padding: 10px; border-right: 1px solid #e0e0e0; vertical-align: top; font-size: 14px;">
                                                                            <strong>Client information:</strong><br>
                                                                            Full Name: $USER_FULL_NAME<br>
                                                                            Email: $USER_EMAIL<br>
                                                                            Phone: $USER_PHONE<br>
                                                                            Address: $USER_ADDRESS
                                                                        </td>
                                                                        <td width="40%" style="padding: 10px; vertical-align: top;">
                                                                            <strong>Room details:</strong><br>
                                                                            Total Rooms: $TOTAL_ROOMS<br>
                                                                            Bedrooms: $BEDROOMS<br>
                                                                            Bathrooms: $BATHROOMS
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
                                                                            <strong>Service details:</strong><br>
                                                                            Service: $SERVICE_TYPE<br>
                                                                            Date: $DATE<br>
                                                                            Time: $TIME<br>
                                                                            Estimated time: $ESTIMATED_TIME
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 20px 0;">
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                                                    <tr style="background-color: #f0f0f0;">
                                                                        <th align="left" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Description</th>
                                                                        <th align="center" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Hours</th>
                                                                        <th align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Price</th>
                                                                        <th align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Discount</th>
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
                                                                            <strong>Discount:</strong>
                                                                        </td>
                                                                        <td align="right" style="padding: 6px 10px;">$TOTAL_FEES</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="2" style="padding: 6px 10px;"></td>
                                                                        <td align="right" style="padding: 6px 10px; white-space: nowrap;">
                                                                            <strong>Total Amount:</strong>
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
                                                                <p>In case there is any conflict with availability or adjustments are needed, contact the client to coordinate directly.</p>
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
    <title>Cleaning booking confirmation</title>
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
                                        Cleaning booking confirmation
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
                                                                <p>Hello $USER_FULL_NAME, <br>
                                                                    Your booking has been successfully confirmed. Here are the details:</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 20px 0 5px 0;">
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e0e0e0; border-collapse: collapse;">
                                                                    <tr>
                                                                        <td width="60%" style="padding: 10px; border-right: 1px solid #e0e0e0; vertical-align: top; font-size: 14px;">
                                                                            <strong>Service details:</strong><br>
                                                                            Date: $DATE<br>
                                                                            Time: $TIME<br>
                                                                            Estimated duration: $ESTIMATED_TIME
                                                                        </td>
                                                                        <td width="40%" style="padding: 10px; vertical-align: top;">
                                                                            <strong>Room details:</strong><br>
                                                                            Total Rooms: $TOTAL_ROOMS<br>
                                                                            Bedrooms: $BEDROOMS<br>
                                                                            Bathrooms: $BATHROOMS
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="padding: 20px 0;">
                                                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                                                                    <tr style="background-color: #f0f0f0;">
                                                                        <th align="left" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Description</th>
                                                                        <th align="center" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Hours</th>
                                                                        <th align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Price</th>
                                                                        <th align="right" style="padding: 10px; border-bottom: 1px solid #e0e0e0;">Discount</th>
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
                                                                            <strong>Discount:</strong>
                                                                        </td>
                                                                        <td align="right" style="padding: 6px 10px;">$TOTAL_FEES</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="2" style="padding: 6px 10px;"></td>
                                                                        <td align="right" style="padding: 6px 10px; white-space: nowrap;">
                                                                            <strong>Total Amount:</strong>
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
                                                                <p>The value is estimated and may be adjusted based on unforeseen conditions on site.</p>
                                                                <p>If you need to modify or cancel your booking, please contact us by replying to this email or writing to us.</p>
                                                                <p style="text-align: center;">Thank you for trusting our services!</p>
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
                                        If you need help at any time, our team is available to assist you. You can contact us here.
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="text-align: center;">
                                        <a href="https://wa.me/1234567890" style="display: inline-block; background-color: #25D366; color: #ffffff; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 20px;">
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
                        Fresh & Clean
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
        const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: enUS });

        // Calcular impuestos como la diferencia entre el precio final y (precio base - descuento)
        const calculatedTax = booking.pricing.finalPrice - (booking.pricing.basePrice - booking.pricing.discount);

        // Calcular total de ambientes
        const totalRooms = (parseInt(booking.serviceDetails.bedrooms) || 0) +
                          (parseInt(booking.serviceDetails.bathrooms) || 0) +
                          (parseInt(booking.serviceDetails.kitchens) || 0) +
                          (parseInt(booking.serviceDetails.livingRooms) || 0) +
                          (parseInt(booking.serviceDetails.otherSpaces) || 0);

        const variables = {
            USER_FULL_NAME: `${booking.clientInfo.firstName} ${booking.clientInfo.lastName}`,
            USER_EMAIL: booking.clientInfo.email,
            USER_PHONE: booking.clientInfo.phone,
            USER_ADDRESS: booking.clientInfo.address,
            POSTAL_CODE: booking.clientInfo.postalCode,
            TOTAL_ROOMS: totalRooms.toString(),
            BEDROOMS: booking.serviceDetails.bedrooms,
            BATHROOMS: booking.serviceDetails.bathrooms,
            KITCHENS: booking.serviceDetails.kitchens,
            LIVING_ROOMS: booking.serviceDetails.livingRooms,
            OTHER_SPACES: booking.serviceDetails.otherSpaces,
            SERVICE_TYPE: booking.serviceDetails.serviceType,
            DATE: formattedDate,
            TIME: `${booking.timing.startTime} - ${booking.timing.endTime}`,
            ESTIMATED_TIME: `${booking.timing.duration} hours`,
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
        const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: enUS });

        // Calcular impuestos como la diferencia entre el precio final y (precio base - descuento)
        const calculatedTax = booking.pricing.finalPrice - (booking.pricing.basePrice - booking.pricing.discount);

        // Calcular total de ambientes
        const totalRooms = (parseInt(booking.serviceDetails.bedrooms) || 0) +
                          (parseInt(booking.serviceDetails.bathrooms) || 0) +
                          (parseInt(booking.serviceDetails.kitchens) || 0) +
                          (parseInt(booking.serviceDetails.livingRooms) || 0) +
                          (parseInt(booking.serviceDetails.otherSpaces) || 0);

        const variables = {
            USER_FULL_NAME: `${booking.clientInfo.firstName} ${booking.clientInfo.lastName}`,
            USER_EMAIL: booking.clientInfo.email,
            USER_PHONE: booking.clientInfo.phone,
            USER_ADDRESS: booking.clientInfo.address,
            POSTAL_CODE: booking.clientInfo.postalCode,
            TOTAL_ROOMS: totalRooms.toString(),
            BEDROOMS: booking.serviceDetails.bedrooms,
            BATHROOMS: booking.serviceDetails.bathrooms,
            KITCHENS: booking.serviceDetails.kitchens,
            LIVING_ROOMS: booking.serviceDetails.livingRooms,
            OTHER_SPACES: booking.serviceDetails.otherSpaces,
            SERVICE_TYPE: booking.serviceDetails.serviceType,
            DATE: formattedDate,
            TIME: `${booking.timing.startTime} - ${booking.timing.endTime}`,
            ESTIMATED_TIME: `${booking.timing.duration} hours`,
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
    const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: enUS });

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
Total rooms: ${(parseInt(booking.serviceDetails.bedrooms) || 0) + (parseInt(booking.serviceDetails.bathrooms) || 0) + (parseInt(booking.serviceDetails.kitchens) || 0) + (parseInt(booking.serviceDetails.livingRooms) || 0) + (parseInt(booking.serviceDetails.otherSpaces) || 0)}
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

    return `
NEW BOOKING RECEIVED
===================

CLIENT INFORMATION
-----------------
Full name: ${booking.clientInfo.firstName} ${booking.clientInfo.lastName}
Email: ${booking.clientInfo.email}
Phone: ${booking.clientInfo.phone}
Address: ${booking.clientInfo.address}

SERVICE DETAILS
--------------
Service type: ${booking.serviceDetails.serviceType}
Date: ${formattedDate}
Time: ${booking.timing.startTime} - ${booking.timing.endTime}
Estimated duration: ${booking.timing.duration} hours

ROOM DETAILS
-----------
Total rooms: ${(parseInt(booking.serviceDetails.bedrooms) || 0) + (parseInt(booking.serviceDetails.bathrooms) || 0) + (parseInt(booking.serviceDetails.kitchens) || 0) + (parseInt(booking.serviceDetails.livingRooms) || 0) + (parseInt(booking.serviceDetails.otherSpaces) || 0)}
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

export const handler: Handler = async (event) => {
    // Solo permitir método POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Verificar variables de entorno
        if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.ADMIN_EMAIL) {
            console.error('Missing required environment variables');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        // Parsear el cuerpo de la solicitud
        const { bookings } = JSON.parse(event.body || '{}');
        console.log('Data received:', JSON.stringify(bookings, null, 2));

        if (!bookings || !bookings.length) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No booking data provided' })
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
                const formattedDate = format(new Date(booking.timing.date), "PPP", { locale: enUS });
                return `${formattedDate}: ${booking.timing.startTime} - ${booking.timing.endTime}`;
            }).join('\n');

            const recurringSection = `\nUPCOMING SCHEDULED DATES\n------------------------\n${recurringDates}\n`;
            clientEmailContent += recurringSection;
            adminEmailContent += `\nSCHEDULED RECURRING BOOKINGS\n----------------------------\n${recurringDates}\n`;
        }

        // Enviar emails
        await Promise.all([
            // Email al cliente
            transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: mainBooking.clientInfo.email,
                subject: isRecurring ? 'Recurring cleaning bookings confirmation' : 'Cleaning booking confirmation',
                html: clientEmailHtml || undefined,
                text: clientEmailContent // Fallback si falla el HTML
            }),
            // Email al administrador
            transporter.sendMail({
                from: process.env.GMAIL_USER,
                to: process.env.ADMIN_EMAIL,
                subject: isRecurring ? 'New recurring booking received' : 'New booking received',
                html: adminEmailHtml || undefined,
                text: adminEmailContent // Fallback si falla el HTML
            })
        ]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Emails sent successfully'
            })
        };
    } catch (error) {
        console.error('Server error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error processing request',
                details: error instanceof Error ? error.message : 'Unknown error'
            })
        };
    }
}; 