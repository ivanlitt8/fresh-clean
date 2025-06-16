import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '@/app/lib/firebase/firebaseConfig';
import { BookingService } from '@/app/lib/firebase/bookingService';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export { BookingService }; 