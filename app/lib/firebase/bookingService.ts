import { db } from '@/app/lib/firebase/index';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    Timestamp,
    orderBy,
    writeBatch,
} from 'firebase/firestore';
import { Booking, TimeSlot } from '@/app/types/booking';
import { findAvailableTimeSlots, isTimeSlotAvailable } from '@/app/lib/time-utils';
import { addWeeks, addMonths, format, parse, addDays } from 'date-fns';

export class BookingService {
    private readonly COLLECTION_NAME = 'bookings';

    private calculateRecurrenceDates(
        startDate: string,
        frequency: string,
        startTime: string,
        duration: number
    ): { date: string; startTime: string; endTime: string }[] {
        const dates: { date: string; startTime: string; endTime: string }[] = [];
        const start = parse(startDate, 'yyyy-MM-dd', new Date());
        let occurrences = 0;

        // Determinar número de ocurrencias basado en la frecuencia
        switch (frequency) {
            case 'Semanal':
                occurrences = 4; // 1 mes de servicios semanales
                break;
            case 'Quincenal':
                occurrences = 4; // 2 meses de servicios quincenales
                break;
            case 'Mensual':
                occurrences = 3; // 3 meses de servicios mensuales
                break;
            default:
                occurrences = 1; // Una vez
                break;
        }

        // Calcular todas las fechas
        for (let i = 0; i < occurrences; i++) {
            let currentDate = start;

            switch (frequency) {
                case 'Semanal':
                    currentDate = addWeeks(start, i);
                    break;
                case 'Quincenal':
                    currentDate = addWeeks(start, i * 2);
                    break;
                case 'Mensual':
                    currentDate = addMonths(start, i);
                    break;
                default:
                    break;
            }

            // Calcular hora de finalización
            const endTime = this.calculateEndTime(startTime, duration);

            dates.push({
                date: format(currentDate, 'yyyy-MM-dd'),
                startTime,
                endTime,
            });
        }

        return dates;
    }

    private calculateEndTime(startTime: string, duration: number): string {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration * 60;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    }

    async getBookingsForDate(date: string): Promise<Booking[]> {
        const bookingsRef = collection(db, this.COLLECTION_NAME);
        const q = query(
            bookingsRef,
            where('timing.date', '==', date),
            orderBy('timing.startTime')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Booking));
    }

    async checkAvailability(date: string, duration: number): Promise<TimeSlot[]> {
        const existingBookings = await this.getBookingsForDate(date);
        return findAvailableTimeSlots({ date, duration, existingBookings });
    }

    async verifyTimeSlotAvailability(
        date: string,
        startTime: string,
        endTime: string
    ): Promise<boolean> {
        const existingBookings = await this.getBookingsForDate(date);
        const timeSlots = existingBookings.map(booking => ({
            startTime: booking.timing.startTime,
            endTime: booking.timing.endTime
        }));

        return isTimeSlotAvailable(
            { startTime, endTime },
            timeSlots
        );
    }

    async createBooking(bookingData: Omit<Booking, 'id'>): Promise<string[]> {
        const batch = writeBatch(db);
        const bookingIds: string[] = [];

        try {
            // Calcular fechas recurrentes
            const dates = this.calculateRecurrenceDates(
                bookingData.timing.date,
                bookingData.serviceDetails.frequency,
                bookingData.timing.startTime,
                bookingData.timing.duration
            );

            // Verificar disponibilidad para todas las fechas
            for (const date of dates) {
                const isAvailable = await this.verifyTimeSlotAvailability(
                    date.date,
                    date.startTime,
                    date.endTime
                );

                if (!isAvailable) {
                    throw new Error(`El horario para la fecha ${date.date} no está disponible`);
                }
            }

            // Crear todas las reservas
            const pattern = this.frequencyToPattern(bookingData.serviceDetails.frequency);
            const endDate = dates[dates.length - 1].date;

            // Crear la reserva principal
            const mainBookingData = {
                ...bookingData,
                timing: {
                    ...bookingData.timing,
                    date: dates[0].date,
                    endTime: dates[0].endTime,
                }
            };

            // Solo agregar el campo recurrence si no es una reserva única
            if (pattern !== 'once') {
                mainBookingData['recurrence'] = {
                    pattern,
                    occurrenceNumber: 1,
                    totalOccurrences: dates.length,
                    endDate,
                };
            }

            const mainBookingRef = await addDoc(collection(db, this.COLLECTION_NAME), mainBookingData);
            bookingIds.push(mainBookingRef.id);

            // Crear las reservas recurrentes si es necesario
            if (pattern !== 'once' && dates.length > 1) {
                for (let i = 1; i < dates.length; i++) {
                    const recurrentBookingData = {
                        ...bookingData,
                        timing: {
                            ...bookingData.timing,
                            date: dates[i].date,
                            endTime: dates[i].endTime,
                        },
                        recurrence: {
                            parentBookingId: mainBookingRef.id,
                            pattern,
                            occurrenceNumber: i + 1,
                            totalOccurrences: dates.length,
                            endDate,
                        }
                    };

                    const recurrentBookingRef = await addDoc(collection(db, this.COLLECTION_NAME), recurrentBookingData);
                    bookingIds.push(recurrentBookingRef.id);
                }
            }

            return bookingIds;
        } catch (error) {
            console.error('Error creating recurring bookings:', error);
            throw new Error('No se pudieron crear las reservas recurrentes');
        }
    }

    private frequencyToPattern(frequency: string): 'once' | 'weekly' | 'biweekly' | 'monthly' {
        switch (frequency) {
            case 'Semanal':
                return 'weekly';
            case 'Quincenal':
                return 'biweekly';
            case 'Mensual':
                return 'monthly';
            default:
                return 'once';
        }
    }

    async updateBookingStatus(
        bookingId: string,
        status: Booking['status']
    ): Promise<void> {
        const bookingRef = doc(db, this.COLLECTION_NAME, bookingId);

        try {
            await updateDoc(bookingRef, {
                status,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating booking status:', error);
            throw new Error('No se pudo actualizar el estado de la reserva');
        }
    }
} 