export const EMAIL_CONFIG = {
    // Configuración del servicio de Gmail
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD // Contraseña de aplicación de Gmail
    },
    // Configuración del remitente
    from: process.env.GMAIL_USER,
    // Email del administrador
    adminEmail: process.env.ADMIN_EMAIL,
    // Asuntos de los emails
    subjects: {
        // Para clientes
        bookingConfirmation: 'Cleaning booking confirmation',
        recurringBookingConfirmation: 'Recurring cleaning bookings confirmation',
        // Para administrador
        adminNewBooking: 'New booking received',
        adminNewRecurringBooking: 'New recurring booking received'
    }
}; 