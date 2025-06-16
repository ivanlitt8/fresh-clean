import { TimeSlot, AvailabilityCheck } from "../types/booking";
import { parse, format } from "date-fns";
// import { es } from "date-fns/locale";

export const BUSINESS_HOURS = {
    start: "08:00",
    end: "17:00",
    bufferMinutes: 30
};

export function parseTime(timeString: string): Date {
    return parse(timeString, "HH:mm", new Date());
}

export function formatTime(date: Date): string {
    return format(date, "HH:mm");
}

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

function findSlotsIfFits({
    start,
    end,
    duration
}: {
    start: string;
    end: string;
    duration: number;
}): TimeSlot[] {
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    const durationMinutes = duration * 60;
    const bufferMinutes = BUSINESS_HOURS.bufferMinutes;
    const slots: TimeSlot[] = [];

    // Iterar sobre posibles horarios de inicio con intervalos de 1 hora
    for (let currentMinutes = startMinutes; currentMinutes + durationMinutes + bufferMinutes <= endMinutes; currentMinutes += 60) {
        slots.push({
            startTime: minutesToTime(currentMinutes),
            endTime: minutesToTime(currentMinutes + durationMinutes)
        });
    }

    return slots;
}

export function findAvailableTimeSlots({
    date,
    duration,
    existingBookings
}: AvailabilityCheck): TimeSlot[] {
    // Filtrar reservas del día seleccionado
    const dayBookings = existingBookings.filter(booking =>
        booking.timing.date === date
    );

    // Ordenar reservas por hora de inicio
    const sortedBookings = dayBookings.sort((a, b) =>
        a.timing.startTime.localeCompare(b.timing.startTime)
    );

    const availableSlots: TimeSlot[] = [];
    let currentTime = BUSINESS_HOURS.start;

    // Encontrar slots disponibles entre reservas
    sortedBookings.forEach(booking => {
        const slotsBeforeBooking = findSlotsIfFits({
            start: currentTime,
            end: booking.timing.startTime,
            duration
        });

        availableSlots.push(...slotsBeforeBooking);
        currentTime = booking.timing.endTime;
    });

    // Verificar slots después de la última reserva
    const finalSlots = findSlotsIfFits({
        start: currentTime,
        end: BUSINESS_HOURS.end,
        duration
    });

    availableSlots.push(...finalSlots);

    return availableSlots;
}

export function isTimeSlotAvailable(
    timeSlot: TimeSlot,
    existingBookings: TimeSlot[]
): boolean {
    const slotStart = timeToMinutes(timeSlot.startTime);
    const slotEnd = timeToMinutes(timeSlot.endTime);

    return !existingBookings.some(booking => {
        const bookingStart = timeToMinutes(booking.startTime);
        const bookingEnd = timeToMinutes(booking.endTime);

        return (
            (slotStart >= bookingStart && slotStart < bookingEnd) ||
            (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
            (slotStart <= bookingStart && slotEnd >= bookingEnd)
        );
    });
} 