
import {openDB} from 'idb';

const dbName = "Zenji";


export const createStoreInDB = async (store: string) => {
  // Opens the first version of the 'test-db1' database.
  // If the database does not exist, it will be created.
  return await openDB(dbName, 1,
    {
        upgrade (db) {
          console.log('Creating a new object store...');
    
          // Checks if the object store exists:
          if (!db.objectStoreNames.contains(store)) {
            // If the object store does not exist, create it:
            const objectStore =db.createObjectStore(store, {keyPath: "id"});

            objectStore.createIndex('literal_index', 'literal', {unique: true});
          }
        }
      });

}


export const addToStore = async (store:string, objects:Object[]) => {

    const db = await createStoreInDB(store)
    
    // Create a transaction on the store in read/write mode:
  const tx = db.transaction(store, 'readwrite');

  // Add multiple items to the store in a single transaction:
  await Promise.all([objects.map((object) => {
    return tx.store.add(object)
  }), tx.done]);

}
export const searchStore = async (store:string, searchText:string) => {

    const db = await openDB(dbName, 1);
  
    // Get a value from the object store by its primary key value:
    const value = await db.get(store,searchText);
    console.log(value);
  }

  export const getAllItemsFromStore = async (store: string) => {
    const db = await createStoreInDB(store);
  
    // Get all values from the designated object store:
    const allValues = await db.getAll(store);
  
    console.dir(allValues);
    return allValues;
  }
  

  
  

