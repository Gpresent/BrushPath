import { useState, useEffect } from "react";
import { openDB, DBSchema, IDBPDatabase } from "idb";
import { collection, getDocs, QuerySnapshot, DocumentData, getCountFromServer, query, orderBy, startAfter, limit, getDocsFromServer, DocumentReference, getDoc, doc, getDocsFromCache } from "firebase/firestore";
import { db, db as firestoreDB } from "./Firebase";
import MiniSearch from 'minisearch';


export type IndexedDBCachingResult = {

  data: DocumentData[] | null;
  loading: boolean;
  search: MiniSearch<any>
  startCache: () => {},


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
  const [numChars, setNumChars] = useState<number>(-1);
  const batch = 100;

  const [search, setSearch] = useState<MiniSearch<any>>(new MiniSearch({
    fields: ["on", "unicode_str", "one_word_meaning", "compounds", "literal", "meanings", "parts", "nanori", "kun"], // fields to index for full-text search
    storeFields: ["id", "_id", "on", "stroke_count", "unicode_str", "one_word_meaning", "compounds", "jlpt", "freq", "codepoints", "totalLengths", "grade", "literal", "readings", "meanings", "parts", "nanori", "meanings_str", "kun", "coords", "radicals"] // fields to return with search results
  }));



  const fetchData = async (skipRef:string, i: number,take:number = batch) => {
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
      const snapshot = await getDocsFromCache(paginatedQuery);

       
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

  const populateCache = async (startIndex:number) => {
      let lastRef = "";
      let prevCachedData:any[] = [];

      for(let i = startIndex; i < 2136; i+= batch) {
        console.log("i", i);
        console.log("numChars", numChars)
        console.log("Attempting to fetchData(lastRef,batch)", lastRef,batch)

        let fetchResponse = await fetchData(lastRef,i,batch);
        if(fetchResponse.cachedData) {
          setData(data? [...fetchResponse.cachedData, ...data]:  fetchResponse.cachedData);
        } 
        else {
          break;
        }
        lastRef = fetchResponse.skipRef
        // prevCachedData = [,...fetchResponse.cachedData];

        //Index Search
        let indexedSearch = search;
        // indexedSearch.removeAll();
        console.log(prevCachedData)

        //As its pulling, this should update the search
        indexedSearch.addAll(prevCachedData);
        console.log(data);
        setSearch(indexedSearch);
        // debugger;

      }
  }

  // Check if data exists in IndexedDB
  const checkCache = async () => {
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
      indexedSearch.removeAll();

      console.log(cachedData)
      indexedSearch.addAll(cachedData);
      console.log(data);

      //Should update search
      setSearch(indexedSearch);
    if(cachedData.length < 2136) {
      //set data initally if some has been loaded previously
      

      console.log("Populating Cache")
      await populateCache(cachedData.length);
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
        checkCache();
      });
      
    }
    else {
      // Call the function to check cache
      checkCache();
    }
    

    
    
  };
  useEffect(() => {
    // startCache();
      
      
      
    }, []);

    // useEffect(() => {
    //   if(index < 500 && index > 0) {
    //     console.log("Fetching... Index = ",index)
    //     checkCache()
    //   }
    //   else {
    //     console.log("Not Fetching... Index = ",index)
    //   }
        
        
        
    //   }, [index]);

  

  return { data, loading, search,startCache };
};

export default useIndexedDBCaching;