import { doc, DocumentReference, runTransaction, getDoc, getDocFromCache } from "firebase/firestore";
import { db } from "./Firebase";
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { FirebaseError } from "firebase/app";


//Sam code

// export const getDecksFromRefs = async (deckRefs: any) => {
//   try {

//     // Ensure each reference in deckRefs has a get() method
//     // const invalidRefs = deckRefs.filter((ref:any) => typeof ref.get !== 'function');
//     // if (invalidRefs.length > 0) {
//     //     console.error("Invalid references found:", invalidRefs);
//     //     throw new Error("Invalid Firestore references");
//     // }
//     const decks = await runTransaction(db, async (transaction) => {
//       let deckPromises: any[] = [];
//       deckRefs.forEach((ref: DocumentReference) => {
//         deckPromises.push(transaction.get(ref));
//       });
//       const deckSnaps = await Promise.all(deckPromises);

//       const decks = deckSnaps
//         .map((snap) => (snap.exists ? snap.data() : null))
//         .filter((data) => data !== null);

//       console.log(decks);
//       return decks;
//     });
//     console.log(decks);
//     return decks;

//   } catch (error) {
//     console.error("Error fetching user decks:", error);
//     throw error;
//     return [];
//   }
// };


// Fetching system will first hit the cache to see if deck exists 
// Else it will then fetch from Firebase
// In case of Character Refs, need to find a way to effeicently store characters in cache, paginate store them all at once? 

export const getDecksFromRefs = async (deckRefs: DocumentReference[]) => {
  try {
    const deckPromises = deckRefs.map(ref =>
      fetchDocument(ref.parent.id, ref.id)
    );

    const deckSnaps = await Promise.all(deckPromises);
    const validDecks = deckSnaps.filter(deck => deck !== null);

    return validDecks;
  } catch (error) {
    console.error("Error fetching user decks:", error);
    throw error;
  }
};


export const getCharsFromRefs = async (charRefs: DocumentReference[]) => {
  try {
    const charPromises = charRefs.map(ref =>
      fetchDocument(ref.parent.id, ref.id)
    );

    const charSnaps = await Promise.all(charPromises);
    const validChars = charSnaps.filter(character => character !== null);

    return validChars;
  } catch (error) {
    console.error("Error fetching deck characters:", error);
    throw error;
  }
};

const fetchDocument = async (collectionName: string, documentId: string) => {
  const docRef = doc(db, collectionName, documentId);

  try {

    const docFromCache = await getDocFromCache(docRef);

    console.log("Retrieved document from cache");
    return {...docFromCache.data(), _id:docFromCache.id};
  } catch (error) {
    console.error("Document not in cache or error fetching from cache:", error);


    try {
      const docFromServer = await getDoc(docRef);
      if (docFromServer.exists()) {

        console.log("Retrieved document from server:");
        return {...docFromServer.data(), _id:docFromServer.id};

      } else {
        console.log("Document does not exist in Firestore.");
        return null;
      }
    } catch (serverError) {
      console.error("Error fetching document from server:", serverError);
      return null;
    }
  }
};

// Fetching system will first hit the cache to see if deck exists 
// Else it will then fetch from Firebase
// In case of Character Refs, need to find a way to effeicently store characters in cache, paginate store them all at once? 

export const getDeckFromID = async (deckId: string) => {
  try {

    const deckSnap = await fetchDocument("Deck",deckId)

    return deckSnap;
  } catch (error) {
    console.error("Error fetching user decks:", error);
    throw error;
  }
};




