import { initializeApp, getApps, getApp } from 'firebase/app';
import { DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { fetchDocument } from '../utils/FirebaseQueries'; // Adjust the import path as necessary
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getFirestore } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore'; // Import doc and getDoc

const firebaseConfig = {
    apiKey: "AIzaSyD6UNA2liqzgCkt4vWUi600Gfbs4GWIpw4",

    authDomain: "zenji-1e015.firebaseapp.com",

    projectId: "zenji-1e015",

    storageBucket: "zenji-1e015.appspot.com",

    messagingSenderId: "703184918088",

    appId: "1:703184918088:web:22574b6beddfcc3e276a7d",

    measurementId: "G-QX9F8XPZN1"
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp(); // Get the already initialized Firebase app
}

const db = getFirestore(app);


vi.mock('firebase/firestore', async (importOriginal) => {
    const originalFirestore = await importOriginal<typeof import('firebase/firestore')>();

    return {
        ...originalFirestore, // Use original implementation for most exports
        getDoc: vi.fn()
        // No need to mock initializeFirestore specifically unless you want to change its behavior
    };
});


describe('fetchDocument', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should retrieve document', async () => {

        const mockDocumentData = { title: 'JLPT_1', name: 'JLPT N1' };
        const mockDocumentId = 'JLPT_1';

        vi.mocked(getDoc).mockResolvedValue({
            exists: () => true,
            data: () => mockDocumentData,
            id: mockDocumentId,
            metadata: {},
            get: (fieldPath: string) => mockDocumentData[fieldPath as keyof typeof mockDocumentData],
            ref: {},
        } as unknown as DocumentSnapshot<DocumentData>);

        const document = await fetchDocument('Deck', 'JLPT_1');
        expect(document).toEqual({ ...mockDocumentData, _id: 'JLPT_1' });
    });

    it('should handle non-existent documents', async () => {
        // Mock `getDoc` to simulate fetching a non-existent document
        vi.mocked(getDoc).mockResolvedValue({
            exists: () => false,
            data: () => undefined,
            id: 'nonExistentDocId',
            metadata: {}, // Add a stub for metadata
            get: (fieldPath: string) => undefined, // Add a stub for get method
            ref: {}, // Add a stub for ref, adjust as needed
        } as unknown as DocumentSnapshot<DocumentData>)

        const document = await fetchDocument('Deck', 'POOP_NAN');
        expect(document).toBeNull(); // Assuming your function returns null for non-existent documents
    });
});