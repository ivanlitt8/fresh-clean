export interface Booking {
    id: string;
    clientInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
    };
    serviceDetails: {
        serviceType: string;
        levels: string;
        bedrooms: string;
        bathrooms: string;
        frequency: string;
        additionalNotes: string;
    };
    timing: {
        date: string;        // Formato ISO
        startTime: string;   // Formato HH:mm
        endTime: string;     // Formato HH:mm
        duration: number;    // En horas
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