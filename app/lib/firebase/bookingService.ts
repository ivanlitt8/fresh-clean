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
    orderBy
} from 'firebase/firestore';
import { Booking, TimeSlot } from '@/app/types/booking';
import { findAvailableTimeSlots, isTimeSlotAvailable } from '@/app/lib/time-utils';

export class BookingService {
    private readonly COLLECTION_NAME = 'bookings';

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

    async createBooking(bookingData: Omit<Booking, 'id'>): Promise<string> {
        // Verificar si el horario sigue disponible
        const isAvailable = await this.verifyTimeSlotAvailability(
            bookingData.timing.date,
            bookingData.timing.startTime,
            bookingData.timing.endTime
        );

        if (!isAvailable) {
            throw new Error('El horario seleccionado ya no está disponible');
        }

        try {
            const docRef = await addDoc(collection(db, this.COLLECTION_NAME), {
                ...bookingData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'pending'
            });

            return docRef.id;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw new Error('No se pudo crear la reserva');
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