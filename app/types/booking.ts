export interface Booking {
    id: string;
    clientInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        postalCode: string;
    };
    serviceDetails: {
        serviceType: string;
        bedrooms: string;
        bathrooms: string;
        kitchens: string;
        livingRooms: string;
        otherSpaces: string;
        frequency: string;
        additionalNotes: string;
    };
    timing: {
        date: string;        // Formato ISO
        startTime: string;   // Formato HH:mm
        endTime: string;     // Formato HH:mm
        duration: number;    // En horas
    };
    recurrence?: {
        parentBookingId?: string;  // ID de la reserva principal (null si es la principal)
        pattern: 'once' | 'weekly' | 'biweekly' | 'monthly';
        occurrenceNumber: number;  // Número de ocurrencia en la serie
        totalOccurrences: number;  // Total de ocurrencias planificadas
        endDate: string;          // Fecha de finalización de la recurrencia
    };
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    pricing: {
        basePrice: number;
        discount: number;
        finalPrice: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

export interface AvailabilityCheck {
    date: string;
    duration: number;
    existingBookings: Booking[];
} 