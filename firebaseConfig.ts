// Temporal: Debug de variables de entorno
console.log('Firebase Config:', {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '**EXISTS**' : 'MISSING',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '**EXISTS**' : 'MISSING',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '**EXISTS**' : 'MISSING',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '**EXISTS**' : 'MISSING',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '**EXISTS**' : 'MISSING',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '**EXISTS**' : 'MISSING',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? '**EXISTS**' : 'MISSING',
});

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    throw new Error('Firebase API Key is missing');
}

export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};