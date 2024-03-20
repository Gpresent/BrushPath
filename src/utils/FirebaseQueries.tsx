import { doc, DocumentReference, runTransaction, getDoc } from "firebase/firestore";
import { db } from "./Firebase";


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

export const getDecksFromRefs = async (deckRefs: DocumentReference[]) => {
  try {
    const deckPromises = deckRefs.map(ref => getDoc(ref));
    const deckSnaps = await Promise.all(deckPromises);

    const decks = deckSnaps.map(snap => {
      if (snap.exists()) {
        console.log(`Data for ${snap.id} came from ${snap.metadata.fromCache ? 'cache' : 'server'}.`);
        return snap.data();
      }
      return null;
    }).filter(data => data !== null);
    console.log(decks);
    return decks;
  } catch (error) {
    console.error("Error fetching user decks:", error);
    throw error;
  }
};

//DO NOT USE UNTIL WE FIGURE OUT CACHING
export const getCharsFromRefs = async (charRefs: any) => {
  try {

    await runTransaction(db, async (transaction) => {
      let deckPromises: any[] = [];
      charRefs.forEach((ref: DocumentReference) => {
        deckPromises.push(transaction.get(ref));
      });
      const charSnaps = await Promise.all(deckPromises);

      const decks = charSnaps
        .map((snap) => (snap.exists ? snap.data() : null))
        .filter((data) => data !== null);

      console.log(decks);
      return decks;
    });
  } catch (error) {
    console.error("Error fetching user chars:", error);
    throw error;
  }
};
