import { useState, useEffect } from "react";
import { openDB, DBSchema, IDBPDatabase } from "idb";
import { collection, getDocs, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db as firestoreDB } from "./Firebase";


export type IndexedDBCaching = {
    
        data: DocumentData[] | null;
        loading: boolean;
    
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
  
    useEffect(() => {
      const fetchData = async () => {
        try {
            console.log("Fetching Data")
          
  
          // Fetch data from Firebase
          const snapshot = await getDocs(collection(firestoreDB, "Character"));;
          console.log("Snapshot got")
          console.log(snapshot);
  
          // Extract data from the snapshot
          const newData = snapshot.docs.map((doc) => {return {_id: doc.id, ...doc.data()}});
  
          // Open the IndexedDB database
          const db = await openDB<MyDBSchema>(DATABASE_NAME, 1, {
            upgrade(db) {
              // Create an object store named 'Character'
              
              if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
                console.log("Created in fetch")
                db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
              }
            },
          });

  
          // Store the fetched data in the 'Character' object store
          
          console.log("Getting data")
          const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
          const store = tx.objectStore(OBJECT_STORE_NAME);
        //   store.put({id:1, le: "Bruh"});
          newData.forEach((item,index) => {
            store.put({id:index, ...item});
          });
          await tx.done;
          db.close();

        //   console.log(newData);
  
          // Set the data state to the fetched data
        //   setData(newData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
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
        } else {
          // If data doesn't exist in IndexedDB, fetch it
          console.log("No Documents")
          setLoading(true);
          fetchData();
        }
        db.close();
      };
  
      // Call the function to check cache
      checkCache();
    }, []);
  
    return { data, loading };
  };
  
  export default useIndexedDBCaching;