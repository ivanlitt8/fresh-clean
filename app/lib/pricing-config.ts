// Configuración de servicios base
export const SERVICES_CONFIG = {
    "Deep Cleaning": {
        baseTime: 3, // horas
        pricePerHour: 35, // USD
        description: "Limpieza profunda de todas las áreas",
    },
    "Regular Cleaning": {
        baseTime: 2,
        pricePerHour: 30,
        description: "Limpieza regular de mantenimiento",
    },
    "Move In/Out Cleaning": {
        baseTime: 4,
        pricePerHour: 40,
        description: "Limpieza completa para mudanzas",
    },
    "Post Construction Cleaning": {
        baseTime: 5,
        pricePerHour: 45,
        description: "Limpieza especializada post construcción",
    },
    "Office Cleaning": {
        baseTime: 3,
        pricePerHour: 35,
        description: "Limpieza de oficinas y espacios comerciales",
    },
} as const;

// Factores adicionales de tiempo
export const TIME_FACTORS = {
    levels: {
        "1": 0,      // No añade tiempo extra
        "2": 0.5,    // Añade 30 minutos
        "3": 1,      // Añade 1 hora
        "4": 1.5,    // Añade 1 hora y 30 minutos
        "5+": 2,     // Añade 2 horas
    },
    bedrooms: {
        "1": 0.5,    // Añade 30 minutos
        "2": 1,      // Añade 1 hora
        "3": 1.5,    // Añade 1 hora y 30 minutos
        "4": 2,      // Añade 2 horas
        "5+": 2.5,   // Añade 2 horas y 30 minutos
    },
    bathrooms: {
        "1": 0.5,    // Añade 30 minutos
        "2": 1,      // Añade 1 hora
        "3": 1.5,    // Añade 1 hora y 30 minutos
        "4": 2,      // Añade 2 horas
        "5+": 2.5,   // Añade 2 horas y 30 minutos
    },
} as const;

// Descuentos por frecuencia
export const FREQUENCY_DISCOUNTS = {
    "Una vez": 0,          // Sin descuento
    "Semanal": 0.15,      // 15% de descuento
    "Quincenal": 0.10,    // 10% de descuento
    "Mensual": 0.05,      // 5% de descuento
} as const;

// Función para calcular el tiempo total del servicio
export function calculateTotalTime(
    service: keyof typeof SERVICES_CONFIG,
    levels: keyof typeof TIME_FACTORS.levels,
    bedrooms: keyof typeof TIME_FACTORS.bedrooms,
    bathrooms: keyof typeof TIME_FACTORS.bathrooms,
): number {
    const baseTime = SERVICES_CONFIG[service].baseTime;
    const additionalTime =
        TIME_FACTORS.levels[levels] +
        TIME_FACTORS.bedrooms[bedrooms] +
        TIME_FACTORS.bathrooms[bathrooms];

    return baseTime + additionalTime;
}

// Función para calcular el precio total
export function calculatePrice(
    service: keyof typeof SERVICES_CONFIG,
    levels: keyof typeof TIME_FACTORS.levels,
    bedrooms: keyof typeof TIME_FACTORS.bedrooms,
    bathrooms: keyof typeof TIME_FACTORS.bathrooms,
    frequency: keyof typeof FREQUENCY_DISCOUNTS,
): {
    totalTime: number;
    basePrice: number;
    discount: number;
    finalPrice: number;
} {
    const totalTime = calculateTotalTime(service, levels, bedrooms, bathrooms);
    const pricePerHour = SERVICES_CONFIG[service].pricePerHour;
    const basePrice = totalTime * pricePerHour;
    const discountRate = FREQUENCY_DISCOUNTS[frequency];
    const discount = basePrice * discountRate;
    const finalPrice = basePrice - discount;

    return {
        totalTime,
        basePrice,
        discount,
        finalPrice,
    };
} 