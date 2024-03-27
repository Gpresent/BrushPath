import { useState, useEffect } from "react";
import { openDB, DBSchema, IDBPDatabase } from "idb";
import { collection, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db as firestoreDB } from "./Firebase";
import MiniSearch from 'minisearch';


export type IndexedDBCaching = {

  data: DocumentData[] | null;
  loading: boolean;
  search: MiniSearch<any>

}

interface MyDBSchema extends DBSchema {
  'Character': {
    key: string;
    value: DocumentData;
  };
}

const DATABASE_NAME = 'zenji-cache';
const OBJECT_STORE_NAME = 'Character';

const useIndexedDBCaching = () => {
  const [data, setData] = useState<DocumentData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<MiniSearch<any>>(new MiniSearch({
    fields: ["on", "unicode_str", "one_word_meaning", "compounds", "literal", "meanings", "parts", "nanori", "kun", "radicals"], // fields to index for full-text search
    storeFields: ["id", "_id", "on", "stroke_count", "unicode_str", "one_word_meaning", "compounds", "jlpt", "freq", "codepoints", "totalLengths", "grade", "literal", "readings", "meanings", "parts", "nanori", "meanings_str", "kun", "coords", "radicals"] // fields to return with search results
  }));


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching Data")


        // Fetch data from Firebase
        const snapshot = await getDocs(collection(firestoreDB, "Character"));;
        console.log("Snapshot got")
        console.log(snapshot);

        // Extract data from the snapshot
        const newData = snapshot.docs.map((doc) => { return { _id: doc.id, ...doc.data() } });

        // Open the IndexedDB database
        const db = await openDB<MyDBSchema>(DATABASE_NAME, 1, {
          upgrade(db) {
            // Create an object store named 'Character'

            if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {

              db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
            }
          },
        });


        // Store the fetched data in the 'Character' object store

        const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
        const store = tx.objectStore(OBJECT_STORE_NAME);
        //   store.put({id:1, le: "Bruh"});
        newData.forEach((item, index) => {
          store.put({ id: index, ...item });
        });
        await tx.done;
        db.close();

        //   console.log(newData);

        // Set the data state to the fetched data
        //   setData(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Check if data exists in IndexedDB
    const checkCache = async () => {
      const db = await openDB(DATABASE_NAME, 1, {
        upgrade(db) {
          // Check if the object store already exists
          if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
            // Create the object store with a keyPath
            console.log("Created in check")
            const objectStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
          }
        }
      });


      const transaction = db.transaction(OBJECT_STORE_NAME, 'readonly');
      const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
      const cachedData = await objectStore.getAll();
      console.log("CachedData.length" + cachedData.length)
      if (cachedData.length > 0) {
        // If data exists in IndexedDB, set the data state to the cached data
        setData(cachedData);

        //Index Search
        let indexedSearch = search;
        indexedSearch.removeAll();
        indexedSearch.addAll(cachedData);
        setSearch(indexedSearch);


      } else {
        // If data doesn't exist in IndexedDB, fetch it
        console.log("No Documents")
        await fetchData();
      }

      db.close();
      setLoading(false);
    };

    // Call the function to check cache
    checkCache();
  }, []);

  return { data, loading, search };
};

export default useIndexedDBCaching;