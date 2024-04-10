// // Genererated test for get decks from ref IN CHATGPT
import { signInWithEmailAndPassword } from "firebase/auth";
import { setLogLevel } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { auth } from "../utils/Firebase";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

    apiKey: "AIzaSyD6UNA2liqzgCkt4vWUi600Gfbs4GWIpw4",

    authDomain: "zenji-1e015.firebaseapp.com",

    projectId: "zenji-1e015",

    storageBucket: "zenji-1e015.appspot.com",

    messagingSenderId: "703184918088",

    appId: "1:703184918088:web:22574b6beddfcc3e276a7d",

    measurementId: "G-QX9F8XPZN1"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);





const offline_db = initializeFirestore(app,
    {
        localCache:
            persistentLocalCache(/*settings*/{ tabManager: persistentMultipleTabManager() }),
        experimentalForceLongPolling: true

    });




export const db = offline_db;

const userCredential = signInWithEmailAndPassword(auth, 'zenjiapp@gmail.com', 'T4aleC4pst0ne!');


// // // jest.setTimeout(10000); // 10 seconds
// // setLogLevel("debug");
// // describe('Firebase Auth Sign-In', () => {

// //     it('successfully signs in a user', async () => {
// //         jest.setTimeout(30000); // Extend timeout for this test
// //         const auth = getAuth();

// //         let user = null;
// //         try {
// //             // Perform the sign-in operation and wait for it to complete
// //             const userCredential = await signInWithEmailAndPassword(auth, 'zenjiapp@gmail.com', 'T4aleC4pst0ne!');
// //             user = userCredential.user;
// //         } catch (error) {
// //             console.error(`Sign in failed:`);
// //             // Fail the test if an error occurs
// //             expect(error).toBeNull();
// //         }

// //         // Assert that the user is signed in successfully
// //         expect(user).not.toBeNull();
// //         expect(user?.email).toBe('zenjiapp@gmail.com');
// //     });

// //     // Other tests go here
// //     // Note: Each test will need to handle its own sign-in if required
// // });

//     // });

// //     it('should fetch decks from references', async () => {
// //         // Ensure this runs only if user is signed in
// //         if (!user) {
// //             throw new Error('User not signed in, cannot proceed with test');
// //         }

// //         // Arrange
// //         const mockDeckRefs = [doc(db, "Deck/JLPT_1"), doc(db, "Deck/JLPT_2")];
// //         const mockDecks = [{ name: 'JLPT 1' }, { name: 'JLPT 2' }];

// //         (fetchDocument as jest.Mock).mockImplementation((ref) =>
// //             Promise.resolve(mockDecks.find(deck => `Deck/${deck.name.split(' ')[1]}` === ref.path))
// //         );

// //         // Act
// //         const decks = await getDecksFromRefs(mockDeckRefs);

// //         // Assert
// //         expect(fetchDocument).toHaveBeenCalledTimes(mockDeckRefs.length);
// //         mockDeckRefs.forEach(ref => {
// //             expect(fetchDocument).toHaveBeenCalledWith(ref);
// //         });
// //         expect(decks).toEqual(mockDecks);
// //     });
// // });
// ///TESTING Get DEck from ID


// // describe('getDeckFromID', () => {
// //     it('successfully retrieves a deck', async () => {
// //         const mockDeckId = "JLPT_1";
// //         const mockDeckData = { name: 'JPLT 1', id: mockDeckId };
// //         // Mock fetchDocument to resolve with mockDeckData

// //         (fetchDocument as jest.Mock).mockImplementation((collectionName, id) =>
// //             Promise.resolve(id === mockDeckId ? mockDeckData : null)
// //         );

// //         const result = await getDeckFromID(mockDeckId);

// //         expect(fetchDocument).toHaveBeenCalledTimes(1);
// //         expect(fetchDocument).toHaveBeenCalledWith("Deck", mockDeckId);
// //         expect(result).toEqual(mockDeckData);
// //     });

// //     it('throws an error when fetchDocument fails', async () => {
// //         const mockDeckId = 'JLPT_92';
// //         const mockError = new Error('Failed to fetch deck');
// //         // Mock fetchDocument to reject with mockError
// //         await expect(getDeckFromID(mockDeckId)).rejects.toThrow(mockError);
// //         expect(fetchDocument).toHaveBeenCalledWith('Deck', mockDeckId);
// //     });
// // });

