import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { DocumentSnapshot, DocumentData, SnapshotMetadata } from 'firebase/firestore';
import { fetchDocument } from '../utils/FirebaseQueries'; // Adjust the import path as necessary
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { initializeFirestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getDeckFromID } from '../utils/FirebaseQueries'; // Adjust the path as necessary


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
// Mock fetchDocument directly if it's not already globally mocked
vi.mock('../utils/FirebaseQueries', async () => {
    const originalModule = await vi.importActual('../utils/FirebaseQueries'); // Correct usage of importActual
    return {
        ...originalModule,
        fetchDocument: vi.fn(() => Promise.resolve({ title: 'Mocked Title', _id: 'mockedId' })), // Example mock implementation
    };
});

describe('getDeckFromID', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // it('should successfully retrieve a deck by ID', async () => {
    //     const mockDeckData = { title: 'JLPT_1', _id: 'JLPT_1' };
    //     vi.mocked(fetchDocument).mockResolvedValue(mockDeckData);

    //     const result = await getDeckFromID('JLPT_1');
    //     console.log(result)

    //     // expect(result).toEqual(mockDeckData);
    //     expect(vi.mocked(fetchDocument)).toHaveBeenCalledWith("Deck", "JLPT_1");
    // });

    it('should throw an error when fetching the deck fails', async () => {
        const mockError = new Error('Failed to get document from cache. (However, this document may exist on the server. Run again without setting \'source\' in the GetOptions to attempt to retrieve the document from the server.)');
        vi.mocked(fetchDocument).mockRejectedValue(mockError);

        await expect(getDeckFromID('deckFail')).rejects.toThrow("Error fetching user decks");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });
});
