import {
  doc,
  DocumentReference,
  runTransaction,
  getDoc,
  getDocFromCache,
  addDoc,
  arrayUnion,
  updateDoc,
  getDocsFromCache,
} from "firebase/firestore";
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";

import { db } from "./Firebase";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import { FirebaseError } from "firebase/app";
import Character from "../types/Character";

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
    // console.error("Document not in cache or error fetching from cache:", error);

    try {
      const docFromServer = await getDoc(docRef);
      if (docFromServer.exists()) {
        // console.log("Retrieved document from server:");
        return { ...docFromServer.data(), _id: docFromServer.id };
      } else {

        return null;
      }
    } catch (serverError) {
      console.error("Error fetching document from server:", serverError);
      return null;
    }
  }
};

export const fetchAllCharacters = async (skipRef:string, take: number) => {

  // console.log("skipRef is: " + skipRef)

  try {
    if(skipRef === "poop") {
      throw "Query finished";
    }
    // console.log("Fetching Data")
    
    // Fetch data from Firebase
    // const snapshot = await getDocs(collection(firestoreDB, "Character"));
    let paginatedQuery;
    //Beginning case, unicode_str = ""
    if(skipRef === "") {
      //TODO Order by created date
      paginatedQuery = query(collection(db, "Character"),
      // orderBy("unicode_str"),
      limit(take));
    }
    //Middle case, unicode_str = something
    else {
      //TODO Order by created date
      // console.log("startAfter: ",{unicode_str: skipRef});
      let lastDocumentSnapshot
      try {
        lastDocumentSnapshot = await getDocFromCache(doc(collection(db, "Character"), skipRef));
      }catch{
        lastDocumentSnapshot = await getDoc(doc(collection(db, "Character"), skipRef));
      }
      // console.log(lastDocumentSnapshot)

      paginatedQuery = query(collection(db, "Character"),
      // orderBy("unicode_str"),
      startAfter(lastDocumentSnapshot),
      limit(take));
    }

    //TODO Try to get from cache
    // console.log("getting from cache")
    let snapshot = await getDocsFromCache(paginatedQuery);
    // console.log("got from cache")
    if(snapshot.empty){
      // console.log("getting from server")
      snapshot = await getDocs(paginatedQuery)
    }
    
    // debugger;
    // console.log("done with cache")

     
    // Extract data from the snapshot
    // console.log("extracting data")
    const newData = snapshot.docs.map((doc) => { return { _id: doc.id, ...doc.data() } });
    // console.log("extracted")

    // Set the data state to the fetched data
    //   setData(newData);
    // console.log("Fetch data:",newData)

    //Fix stop case
    const newSkipRef = newData.length ? newData[newData.length-1]._id:"poop"
    // console.log("Fetched (starting at ",newSkipRef, cachedData.length)

    // setIndex(index+batch)
    // setIndexID(newData.length ? newData[newData.length-1]._id:"")
    return {skipRef: newSkipRef, cachedData: newData};


  } catch (error) {
    console.error("Error fetching data:", error);
    return {skipRef: "poop", cachedData:[]}
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

//TODO add image and public bool
export const addUserDeck = async (userId: string, characters: Character[], desc: string, deckTitle: string) => {
  try {
    // const userSnap = await fetchDocument("User", userId);
    const userRef = doc(db, "User", userId);


    const characterPromises = characters.map((char) => doc(db, "Character", char.unicode_str));
    const characterRefs = await Promise.all(characterPromises)
    //TODO Filter Nulls?

    const userDeck = {
      name: deckTitle,
      desc: desc,
      public: false,
      userRef: userRef,
      image: "",
      characters: characterRefs,
    };
    //TODO add transaction to prevent concurrency issues

    //Create Doc
    const deckRef = await addDoc(collection(db, 'Deck'), userDeck);
    console.log("Post document added with ID: ", deckRef.id);

    //Add Ref to user
    const userUpdateData = {
      decks: arrayUnion(deckRef)
      // 'newReference' is the reference you want to add to the array
    };

    await updateDoc(userRef, userUpdateData);

    // console.log(deckRef);
    // return await fetchDocument("Deck",deckRef.id);
  } catch (error) {
    console.error("Error creating deck:", error);
    throw error;
  }

};

export const updateUserDeck = async (deckId: string, characters: Character[], desc: string, deckTitle: string, imageUrl: string) => {
  try {
    const deckRef = doc(db, "Deck", deckId);


    const characterPromises = characters.map((char) => doc(db, "Character", char.unicode_str));
    const characterRefs = await Promise.all(characterPromises)
    //TODO Filter Nulls?

    const userDeck = {
      name: deckTitle,
      desc: desc,
      image: "",
      characters: characterRefs,
    };
    //TODO add transaction to prevent concurrency issues

    //Create Doc
    await updateDoc(deckRef, userDeck);
    console.log("Post document added with ID: ", deckRef.id);

  } catch (error) {
    console.error("Error creating deck:", error);
    throw error;
  }

};


//update user recent used deck  and move array inside table ?


export const updateUserRecentDeck = async (userID: string, deckID: string, decks: DocumentReference[]) => {
  try {
    const deckRef = doc(db, "Deck", deckID);
    const userRef = doc(db, "User", userID);

    const existingIndex = decks.findIndex((ref) => ref.id === deckID);

    if (existingIndex === 0) {
      //console.log("already recent")
      return;
    }

    //update recent 
    // await updateDoc(userRef, {
    //   last_deck_studied: deckRef
    // });


    if (existingIndex > -1) {
      decks.splice(existingIndex, 1);
    }


    decks.unshift(deckRef);

    await updateDoc(userRef, {
      last_deck_studied: deckRef,
      decks: decks
    });
    // console.log("Post: Successfully updated Recent Deck and shifted to front: ", deckRef.id);
  } catch (error) {
    console.error("Error creating deck:", error);
    throw error;
  }

};




//User name update
export const updateUserName = async (newName: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    try {
      await updateProfile(user, {
        displayName: newName,
      });
      //console.log("User display name updated successfully.");

      await user.reload();
      //console.log("User profile reloaded successfully.");
      return true;
    } catch (error) {
      console.error("Error updating user display name:", error);
      return false;
    }
  } else {
    return false;
  }
};