import React, { useContext, useEffect, useState } from "react";
import "../styles/styles.css";
import HomeStudyPrompt from "../components/HomeStudyPrompt";
import DeckList from "../components/DeckList";
import { AuthContext } from "../utils/FirebaseContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { getDecksFromRefs, getDeckFromID } from "../utils/FirebaseQueries";


const Home: React.FC = () => {
  //const {user} = useParams<any>();
  const { user, userData, getUserData } = useContext(AuthContext);

  const [decks, setDecks] = useState<any>([]);


  const [loading, setLoading] = useState<boolean>(true);

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
    

      
  }

  useEffect(() => {
    if (!userData) {
      getUserData();

    }
    else {
      getUserData();


    }
  }, []);

  useEffect(() => {
    const fetchDecks = async () => {
      if (userData) {


        return await getDecksFromRefs(userData.decks);
      }
    };

    fetchDecks().then((decksResult) => {

      setDecks(decksResult);
      setLoading(false);
    });
  }, [userData]);

  // const character: Character = characterParser(charData);

  return (
    <div className="home-page">
      <h2 className="home-greeting">
        Hello, {user?.displayName}
      </h2>
      {/* <HomeStats /> */}
      {(loading || userData === null || decks === undefined || decks === null) ? (
        <LoadingSpinner />
      ) : (
        <HomeStudyPrompt
          newUser={userData}
          suggestedDeck={{
            _id: decks[0]?._id || "",
            id: decks[0]?.id || 0,
            image: decks[0]?.image || "../sample_deck.png",
            name: decks[0]?.name || ""
          }}
        />
      )}
      <h2>Recent Decks</h2>
      {(loading || decks === null || decks === undefined || userData === null) ? <LoadingSpinner /> : <DeckList length={3} user={userData} decks={decks} ></DeckList>}
      {/* {JSON.stringify(userData)}
    {JSON.stringify(decks)} */}
    </div>
  );
};

export default Home;
