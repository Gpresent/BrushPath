import { initializeApp, getApps, getApp } from 'firebase/app';
import { DocumentReference } from 'firebase/firestore';// Adjust the import path as necessary
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { getFirestore } from 'firebase/firestore';
import * as FirebaseQueries from '../utils/FirebaseQueries';
import { fetchDocument } from '../utils/FirebaseQueries';


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


vi.mock('../utils/FirebaseQueries', async () => {
    const originalModule = await vi.importActual<typeof FirebaseQueries>('../utils/FirebaseQueries');
    return {
        ...originalModule,
        fetchDocument: vi.fn((collectionId: string, docId: string) =>
            Promise.resolve({ id: docId, data: () => ({ name: `Deck ${docId}` }) })
        ),
    };
});


import { getDecksFromRefs } from '../utils/FirebaseQueries'; // Adjust the path as necessary
describe('getDecksFromRefs', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
    });
    it('should fetch decks correctly for given document references', async () => {
        // Setup
        const deckRefs: DocumentReference[] = [
            { parent: { id: 'decks' }, id: 'deck1' } as DocumentReference,
            { parent: { id: 'decks' }, id: 'deck2' } as DocumentReference,
        ];

        // Action
        const result = await getDecksFromRefs(deckRefs);

        // Assertions
        expect(result.length).toBe(2);
        expect(result[0]).toEqual({ id: 'deck1', data: expect.any(Function) });
        expect(result[1]).toEqual({ id: 'deck2', data: expect.any(Function) });
        expect(vi.mocked(fetchDocument)).toHaveBeenCalledTimes(2);
        expect(vi.mocked(fetchDocument)).toHaveBeenCalledWith('decks', 'deck1');
        expect(vi.mocked(fetchDocument)).toHaveBeenCalledWith('decks', 'deck2');
    });


    afterEach(() => {
        vi.restoreAllMocks();
    });
    // Add more tests here for error handling, filtering out nulls, etc.
});