import { Booking } from '@/app/types/booking';

export class EmailService {
    private getApiUrl() {
        // En desarrollo local con Netlify CLI
        if (process.env.NEXT_PUBLIC_NETLIFY_DEV) {
            return 'http://localhost:8888/.netlify/functions/email';
        }
        // En desarrollo local sin Netlify CLI
        if (process.env.NODE_ENV === 'development') {
            return '/api/email'; // Usar Next.js API Route
        }
        // En producción
        return '/.netlify/functions/email';
    }

    private async sendEmailViaAPI(bookings: Booking[]) {
        try {
            const apiUrl = this.getApiUrl();
            console.log('Intentando enviar email usando:', apiUrl);
            console.log('Datos de la reserva:', JSON.stringify(bookings, null, 2));

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookings }),
            });

            console.log('Estado de la respuesta:', response.status);
            console.log('Headers de la respuesta:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                let errorMessage = `Error HTTP: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                    console.error('Datos del error:', errorData);
                } catch (e) {
                    console.error('No se pudo parsear la respuesta de error');
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Respuesta exitosa:', result);
            return result;
        } catch (error) {
            console.error('Error completo al enviar email:', error);
            throw new Error('No se pudo enviar el email de confirmación');
        }
    }

    async sendBookingConfirmation(booking: Booking) {
        console.log('Iniciando envío de confirmación de reserva única');
        return this.sendEmailViaAPI([booking]);
    }

    async sendRecurringBookingConfirmation(bookings: Booking[]) {
        if (!bookings.length) {
            console.log('No hay reservas para enviar');
            return;
        }
        console.log('Iniciando envío de confirmación de reservas recurrentes');
        return this.sendEmailViaAPI(bookings);
    }
} 