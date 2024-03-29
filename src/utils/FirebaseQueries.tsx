import {
  doc,
  DocumentReference,
  runTransaction,
  getDoc,
  getDocFromCache,
} from "firebase/firestore";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";

import { db } from "./Firebase";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
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
    const deckPromises = deckRefs.map((ref) =>
      fetchDocument(ref.parent.id, ref.id)
    );

    const deckSnaps = await Promise.all(deckPromises);
    const validDecks = deckSnaps.filter((deck) => deck !== null);

    return validDecks;
  } catch (error) {
    console.error("Error fetching user decks:", error);
    throw error;
  }
};

// pagination info from google cloud

/*
const first = query(collection(db, "cities"), orderBy("population"), limit(25));
const documentSnapshots = await getDocs(first);

// Get the last visible document
const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
console.log("last", lastVisible);

// Construct a new query starting at this document,
// get the next 25 cities.
const next = query(collection(db, "cities"),
    orderBy("population"),
    startAfter(lastVisible),
    limit(25));
*/

export const getCharsFromRefs = async (
  charRefsFull: DocumentReference[],
  index: number
) => {
  let charRefs: DocumentReference[] = [];
  for (let i = 0; i < 30; i++) {
    charRefs.push(charRefsFull[index * 30 + i]);
    if (index * 30 + i > charRefsFull.length) {
      break;
    }
  }
  try {
    let charPromises;

    try {
      charPromises = charRefs.map((ref) => {
        // console.log(typeof ref);
        if (ref != null) {
          return fetchDocument(ref.parent.id, ref.id);
        }
      });
    } catch (error) {
      charPromises = charRefs.map((ref) => {
        // console.log(typeof ref);
        let str_ref = ref as unknown as string;
        if (str_ref && typeof str_ref == "string") {
          return fetchDocument(str_ref?.split("/")[0], str_ref.split("/")[1]);
        }
        // str_ref = str_ref.split('/')
      });
    }

    const charSnaps = await Promise.all(charPromises);
    // const validChars = charSnaps.filter((character) => character !== null);

    // console.log(charSnaps);
    return charSnaps;
  } catch (error) {
    console.error("Error fetching deck characters:", error);
    throw error;
  }
};

const fetchDocument = async (collectionName: string, documentId: string) => {
  const docRef = doc(db, collectionName, documentId);

  try {
    const docFromCache = await getDocFromCache(docRef);

    // console.log("Retrieved document from cache");
    return { ...docFromCache.data(), _id: docFromCache.id };
  } catch (error) {
    console.error("Document not in cache or error fetching from cache:", error);

    try {
      const docFromServer = await getDoc(docRef);
      if (docFromServer.exists()) {
        // console.log("Retrieved document from server:");
        return { ...docFromServer.data(), _id: docFromServer.id };
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
    const deckSnap = await fetchDocument("Deck", deckId);

    return deckSnap;
  } catch (error) {
    console.error("Error fetching user decks:", error);
    throw error;
  }
};
