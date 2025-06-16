import { Booking } from '@/app/types/booking';

export class EmailService {
    private async sendEmailViaAPI(bookings: Booking[]) {
        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookings }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al enviar el email');
            }

            return await response.json();
        } catch (error) {
            console.error('Error al enviar email:', error);
            throw new Error('No se pudo enviar el email de confirmación');
        }
    }

    async sendBookingConfirmation(booking: Booking) {
        return this.sendEmailViaAPI([booking]);
    }

    async sendRecurringBookingConfirmation(bookings: Booking[]) {
        if (!bookings.length) return;
        return this.sendEmailViaAPI(bookings);
    }
} 