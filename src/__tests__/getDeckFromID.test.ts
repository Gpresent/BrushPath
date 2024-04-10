import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { DocumentSnapshot, DocumentData, SnapshotMetadata } from 'firebase/firestore';
import { fetchDocument } from '../utils/FirebaseQueries'; // Adjust the import path as necessary
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { initializeFirestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getDeckFromID } from '../utils/FirebaseQueries'; // Adjust the path as necessary
import Deck from '../types/Deck';



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
        fetchDocument: vi.fn((collectionName: string, documentId: string) => Promise.resolve({ name: 'JLPT N1', _id: 'JLPT_1' })),
    };
});

describe('getDeckFromID', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully retrieve a deck by ID', async () => {
        // Assuming the mock is setup globally, no need to mock fetchDocument here again

        //FirebaseQueries.fetchDocument.mockResolvedValue(mockReturn);
        // Call `getDeckFromID` with the expected ID
        const result = await getDeckFromID('JLPT_1') as Deck;
        expect(result._id).toBe('JLPT_1')
        expect(result.name).toBe('JLPT N1')


        //expect(FirebaseQueries.fetchDocument).toHaveBeenCalledWith(expectedCollection, expectedDocId);
    });


    it('should throw an error when fetching the deck fails', async () => {
        const mockError = new Error("Error fetching user decks");
        vi.mocked(fetchDocument).mockRejectedValueOnce(mockError); // Use mockRejectedValueOnce for a more specific control

        await expect(getDeckFromID('deckFail')).rejects.toThrow("Error fetching user decks");
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });
});
