export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    message: string;
    status: 'pending' | 'responded' | 'closed';
    createdAt: string;
    updatedAt: string;
}

export interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    address: string;
    message: string;
} 