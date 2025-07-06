import { Contact } from '@/app/types/contact';

export class ContactEmailService {
    private async sendEmailViaAPI(contact: Contact) {
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contact }),
            });

            console.log('Contact email API response status:', response.status);

            if (!response.ok) {
                let errorMessage = `Error HTTP: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                    console.error('Contact email error data:', errorData);
                } catch (e) {
                    console.error('Unable to parse contact email error response');
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Contact email sent successfully:', result);
            return result;
        } catch (error) {
            console.error('Error sending contact email:', error);
            throw new Error('Failed to send contact email');
        }
    }

    async sendContactNotification(contact: Contact) {
        console.log('Sending contact notification emails');
        return this.sendEmailViaAPI(contact);
    }
} 