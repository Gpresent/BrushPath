// Import the necessary Firebase modules and Vitest functions
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { doc, getDoc, getDocFromCache } from 'firebase/firestore'; // Import doc and getDoc

// Mock Firebase modules
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(),
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({
        currentUser: { uid: 'testUser', email: 'test@example.com' },
        onAuthStateChanged: vi.fn(),
    })),
    signInWithEmailAndPassword: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
    initializeFirestore: vi.fn(),
    getDocFromCache: vi.fn(),
}));


vi.mock('firebase/firestore', () => ({
    initializeFirestore: vi.fn(),
    doc: vi.fn(), // Mock doc function
    getDoc: vi.fn(() => Promise.resolve({ // Mock getDoc function to return a promise of a mocked doc snapshot
        exists: () => true,
        data: () => ({ title: 'Test Document', content: 'This is a test.' }),
    })),
}));


const app = initializeApp({});
const auth = getAuth(app);
const db = initializeFirestore(app, {});


describe('Firebase Auth in Vitest', () => {
    beforeEach(async () => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Simulate user sign-in
        await signInWithEmailAndPassword(auth, 'test@example.com', 'password');
    });

    it('should be signed in with mock user', () => {
        expect(auth.currentUser).toBeDefined();
        expect(auth.currentUser?.email).toBe('test@example.com');
    });


    it('should retrieve document from Firestore', async () => {
        const docRef = doc(db, 'collectionName', 'docId'); // Use mocked doc function to create a reference
        const docSnap = await getDoc(docRef); // Use mocked getDoc function to simulate fetching the document

        expect(docSnap.exists()).toBe(true); // Check if document exists
        expect(docSnap.data()).toEqual({ title: 'Test Document', content: 'This is a test.' }); // Verify document data
    });



});




