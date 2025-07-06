import { db } from '@/app/lib/firebase/index';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Contact } from '@/app/types/contact';

export class ContactService {
    private readonly COLLECTION_NAME = 'contacts';

    async createContact(contactData: Omit<Contact, 'id'>): Promise<string> {
        try {
            const contactRef = await addDoc(collection(db, this.COLLECTION_NAME), {
                ...contactData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            console.log('Contact created successfully with ID:', contactRef.id);
            return contactRef.id;
        } catch (error) {
            console.error('Error creating contact:', error);
            throw new Error('Failed to create contact');
        }
    }
} 