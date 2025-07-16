// Configuración de servicios base - NUEVA ESTRUCTURA DE PRECIOS
export const SERVICES_CONFIG = {
    "Airbnb Cleaning": {
        timePerRoom: 0.5, // 30 minutos por ambiente
        pricePerHour: 60, // USD
        description: "Limpieza especializada para propiedades Airbnb",
    },
    "Builders/Construction": {
        timePerRoom: 1, // 1 hora por ambiente
        pricePerHour: 70, // USD
        description: "Limpieza post construcción especializada",
    },
    "End of Lease Cleaning": {
        timePerRoom: 1, // 1 hora por ambiente
        pricePerHour: 70, // USD
        description: "Limpieza completa de fin de arrendamiento",
    },
    "Deep Cleaning": {
        timePerRoom: 0.75, // 45 minutos por ambiente
        pricePerHour: 60, // USD
        description: "Limpieza profunda de todas las áreas",
    },
    "Carpet Cleaning": {
        timePerRoom: 1.75, // 1.5-2 horas por ambiente (casos especiales)
        pricePerHour: 60, // USD
        description: "Limpieza especializada de alfombras y tapetes",
    },
    "Commercial Cleaning": {
        timePerRoom: 0.5, // 30 minutos por ambiente
        pricePerHour: 60, // USD
        description: "Limpieza comercial para negocios",
    },
    "Office Cleaning": {
        timePerRoom: 0.33, // 20 minutos por ambiente
        pricePerHour: 60, // USD
        description: "Limpieza de oficinas y espacios de trabajo",
    },
    "Residential Cleaning": {
        timePerRoom: 0.5, // 30 minutos por ambiente
        pricePerHour: 60, // USD
        description: "Limpieza residencial regular",
    },
    "Strata Cleaning": {
        timePerRoom: 0.5, // 30 minutos por ambiente
        pricePerHour: 60, // USD
        description: "Limpieza de áreas comunes de estratos",
    },
} as const;

// Descuentos por frecuencia
export const FREQUENCY_DISCOUNTS = {
    "One time": 0,          // Sin descuento
    "Weekly": 0.10,         // 10% de descuento
    "Bi-weekly": 0,         // Sin descuento
    "Monthly": 0,           // Sin descuento
} as const;

// Función para calcular el total de ambientes
export function calculateTotalRooms(
    bedrooms: string,
    bathrooms: string,
    kitchens: string,
    livingRooms: string,
    otherSpaces: string
): number {
    const bedroomCount = parseInt(bedrooms.replace('+', '')) || 0;
    const bathroomCount = parseInt(bathrooms.replace('+', '')) || 0;
    const kitchenCount = parseInt(kitchens.replace('+', '')) || 0;
    const livingRoomCount = parseInt(livingRooms.replace('+', '')) || 0;
    const otherSpaceCount = parseInt(otherSpaces.replace('+', '')) || 0;
    
    return bedroomCount + bathroomCount + kitchenCount + livingRoomCount + otherSpaceCount;
}

// Función para calcular el tiempo total del servicio
export function calculateTotalTime(
    service: keyof typeof SERVICES_CONFIG,
    bedrooms: string,
    bathrooms: string,
    kitchens: string,
    livingRooms: string,
    otherSpaces: string
): number {
    const totalRooms = calculateTotalRooms(bedrooms, bathrooms, kitchens, livingRooms, otherSpaces);
    const timePerRoom = SERVICES_CONFIG[service].timePerRoom;
    return timePerRoom * totalRooms;
}

// Función para calcular el precio total
export function calculatePrice(
    service: keyof typeof SERVICES_CONFIG,
    bedrooms: string,
    bathrooms: string,
    kitchens: string,
    livingRooms: string,
    otherSpaces: string,
    frequency: keyof typeof FREQUENCY_DISCOUNTS,
    totalDiscountRate: number = FREQUENCY_DISCOUNTS[frequency]
): {
    totalTime: number;
    basePrice: number;
    discount: number;
    finalPrice: number;
} {
    const totalTime = calculateTotalTime(service, bedrooms, bathrooms, kitchens, livingRooms, otherSpaces);
    const pricePerHour = SERVICES_CONFIG[service].pricePerHour;
    const basePrice = totalTime * pricePerHour;
    const discount = basePrice * totalDiscountRate;
    const finalPrice = basePrice - discount;

    return {
        totalTime,
        basePrice,
        discount,
        finalPrice,
    };
}