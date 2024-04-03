
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { openDB, DBSchema, IDBPDatabase } from "idb";
import { useMutex } from 'react-context-mutex';
import { collection, doc, getDocs, getDoc, runTransaction, orderBy, startAfter, limit, query, DocumentData, DocumentReference, getDocsFromCache, getCountFromServer } from 'firebase/firestore';
import MiniSearch from 'minisearch';

import { auth, db,db as firestoreDB } from './Firebase'; // Assuming './Firebase' contains the Firebase initialization


export type IndexedDBCachingResult = {

  data: DocumentData[] | null;
  loading: boolean;
  search: MiniSearch<any>|null,


}

interface MyDBSchema extends DBSchema {
  'Character': {
    key: string;
    value: DocumentData;
  };
}
const DATABASE_NAME = 'zenji-cache';
const OBJECT_STORE_NAME = 'Character';

//Initialize Context
export const CharacterSearchContext = createContext<IndexedDBCachingResult>({data:null,loading:true,search:null});

export const useAuth = () => {
  return useContext(CharacterSearchContext)
};



export const CharacterSearchProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DocumentData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [numChars, setNumChars] = useState<number>(-1);
  const [counter, setCounter] = useState<number>(1);
  const batch = 250;

  const [search, setSearch] = useState<MiniSearch<any>>(new MiniSearch({
    fields: ["on", "unicode_str", "one_word_meaning", "compounds", "literal", "meanings", "parts", "nanori", "kun"], // fields to index for full-text search
    storeFields: ["id", "_id", "on", "stroke_count", "unicode_str", "one_word_meaning", "compounds", "jlpt", "freq", "codepoints", "totalLengths", "grade", "literal", "readings", "meanings", "parts", "nanori", "meanings_str", "kun", "coords", "radicals"] // fields to return with search results
  }));



  const fetchData = async (skipRef:string,take:number = batch) => {
    try {
      if(skipRef === "poop") {
        throw "Query finished";
      }
      console.log("Fetching Data")
      


      // Fetch data from Firebase
      // const snapshot = await getDocs(collection(firestoreDB, "Character"));
      let paginatedQuery;
      //Beginning case, unicode_str = ""
      if(skipRef === "") {
        //TODO Order by created date
        paginatedQuery = query(collection(firestoreDB, "Character"),
        orderBy("unicode_str"),
        limit(take));
      }
      //Middle case, unicode_str = something
      else {
        //TODO Order by created date
        console.log("startAfter: ",{unicode_str: skipRef});
        const lastDocumentSnapshot = await getDoc(doc(collection(firestoreDB, "Character"), skipRef));
        
        console.log(lastDocumentSnapshot)

        paginatedQuery = query(collection(firestoreDB, "Character"),
        orderBy("unicode_str"),
        startAfter(lastDocumentSnapshot),
        limit(take));
      }

      //TODO Try to get from cache
      const snapshot = await getDocs(paginatedQuery);
      // debugger;

       
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
      let cachedData: {id:number, _id:string}[] = [];
      // await newData.forEach((item, index) => {
      //   store.put({ id: index, ...item });
      //   cachedData.push({ id: index, ...item });
      // });
      //TODO look for batching for indexxedb
      for (let index = 0; index <  newData.length; index++) {
        const item = newData[index];
        await store.put({ id: parseInt(item._id,16), ...item });
        cachedData.push({ id: parseInt(item._id,16), ...item });
        // debugger;
      }

      //Debugging
      let objCheck = await store.getAll();
      console.log("Items in store:", objCheck)

      
      await tx.done;
      db.close();

      //   console.log(newData);

      // Set the data state to the fetched data
      //   setData(newData);
      console.log("Fetch data:",newData)

      //Fix stop case
      const newSkipRef = newData.length ? newData[newData.length-1]._id:"poop"
      console.log("Fetched (starting at ",newSkipRef, cachedData.length)

      // setIndex(index+batch)
      // setIndexID(newData.length ? newData[newData.length-1]._id:"")
      return {skipRef: newSkipRef, cachedData: cachedData};


    } catch (error) {
      console.error("Error fetching data:", error);
      return {skipRef: "poop", cachedData:[]}
    }
  };

  const populateCache = async (initialData:DocumentData[],startIndex:number,numChars: number) => {
      let lastRef = "";
      let prevCachedData:DocumentData[] = initialData;

      for(let i = startIndex; i < numChars; i+= batch) {
        console.log("i", i);
        console.log("numChars", numChars)
        console.log("Attempting to fetchData(lastRef,batch)", lastRef,batch)
        if(prevCachedData.length) {
          lastRef = prevCachedData[prevCachedData.length-1]._id;
        }
        else if(data?.length) {
          lastRef = data[data.length-1]._id;
        }
        else {
          lastRef ="";
        }
        // debugger;
        let fetchResponse = await fetchData(lastRef,batch);
        if(fetchResponse.cachedData) {
          setData(prevData => { 
            return prevData? [...fetchResponse.cachedData, ...prevData]:  fetchResponse.cachedData;
          } )
        } 
        else {
          break;
        }
        // lastRef = fetchResponse.skipRef
        prevCachedData = [...prevCachedData,...fetchResponse.cachedData];

        //Index Search
        // indexedSearch.removeAll();

        //As its pulling, this should update the search
        
        setSearch(indexedSearch => {
          // debugger;
          indexedSearch.removeAll();
          indexedSearch.addAll(prevCachedData);
          return indexedSearch;
        });
        // debugger;

      }
  }

  // Check if data exists in IndexedDB
  const checkCache = async (numChars:number) => {
    const db = await openDB(DATABASE_NAME, 1, {
      upgrade(db) {
        // Check if the object store already exists
        if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
          // Create the object store with a keyPath
          // console.log("Created in check")
          const objectStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
        }
      }
    });


    const transaction = db.transaction(OBJECT_STORE_NAME, 'readonly');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);
    let cachedData = await objectStore.getAll();

    console.log("Before fetch CachedData.length" + cachedData.length)
    console.log(cachedData.length < 2136);
    console.log(numChars);


    setData(cachedData);
    let indexedSearch = search;
    //TODO look into this
      

      //Should update search
      setSearch(indexedSearch => {

        indexedSearch.removeAll();

        console.log(cachedData)
        indexedSearch.addAll(cachedData);
        console.log(data);
        return indexedSearch;
      });
    if(cachedData.length < numChars) {
      //set data initally if some has been loaded previously
      

      console.log("Populating Cache")
      await populateCache(cachedData,cachedData.length,numChars);
    }

    //Redundant?
    // cachedData = await objectStore.getAll();
    console.log("After fetch...",search.toJSON())

    // If data exists in IndexedDB, set the data state to the cached data
    // setData(cachedData);

    //Index Search
    // indexedSearch = search;
    // indexedSearch.removeAll();
    // indexedSearch.addAll(cachedData);
    // setSearch(indexedSearch);

    db.close();
    // setLoading(false);
  };

  

  const startCache = async () => {
    
    //Get size
    if(numChars == -1) {
      const coll = collection(db, "Character");
      const snapshot = getCountFromServer(coll).then((snapshot)=> {
        setNumChars(snapshot.data().count);
        console.log("Document count",snapshot.data().count);
        checkCache(snapshot.data().count);
      });
      
    }
    else {
      // Call the function to check cache
      checkCache(numChars);
    }
    

    
    
  };
    const MutexRunner = useMutex();
    const mutex = new MutexRunner('caching');
  
    const handleCacheAsync = async () => {
       mutex.lock();
      startCache();
      mutex.unlock(); 
    }
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser != null) {
          
          handleCacheAsync();
        }

      });
  
      return unsubscribe;
    }, []);
  
  
  
    const value = {
      data, loading, search
    }
  
    return (<CharacterSearchContext.Provider value={value}>
      {children}
    </CharacterSearchContext.Provider>)
  }
  
  