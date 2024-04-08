import React from 'react';

interface Props {}

const IndexDBButton: React.FC<Props> = () => {
    const createIndexedDB = () => {
        const indexedDB = window.indexedDB;
        const request = indexedDB.open("MyDatabase", 1);

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;

            // Create an object store
            const objectStore = db.createObjectStore("MyObjectStore", { keyPath: "id", autoIncrement: true });

            console.log("Object store created successfully!");
        };

        request.onerror = (event: any) => {
            console.error("Database creation error:", event.target.errorCode);
        };

        request.onsuccess = (event: any) => {
            console.log("Database created successfully!");
        };
    };

    return (
        <button onClick={createIndexedDB}>Create IndexedDB</button>
    );
};

export default IndexDBButton;
