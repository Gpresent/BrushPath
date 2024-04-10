import React, { useContext, useEffect, useState } from "react";
import "../styles/styles.css";
import HomeStats from "../components/HomeStats";
import HomeStudyPrompt from "../components/HomeStudyPrompt";
import DeckList from "../components/DeckList";
import { useParams } from "react-router";
import { AuthContext } from "../utils/FirebaseContext";
import { updateProfile } from "firebase/auth";
import { auth } from "../utils/Firebase";
import characterParser from "../utils/characterParser";
import Character from "../types/Character";
import SingleWordView from "./SingleWord";
import LoadingSpinner from "../components/LoadingSpinner";
import { userInfo } from "os";
import { getDecksFromRefs, getDeckFromID } from "../utils/FirebaseQueries";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";


const Home: React.FC = () => {
  //const {user} = useParams<any>();
  const { user, userData, getUserData } = useContext(AuthContext);

  const [decks, setDecks] = useState<any>([]);
  const [recentDeck, setRecentDeck] = useState<any>()

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

      const recentDeck = getDeckFromID(userData.last_deck_studied.id).then((result) => { setRecentDeck(result); });


    }


  }, []);

  useEffect(() => {
    const fetchDecks = async () => {
      if (userData) {
        return await getDecksFromRefs(userData.decks);
      }
    }

    fetchDecks().then((decksResult) => {
      // console.log(decksResult);
      setDecks(decksResult);
      setLoading(false);
    });
    if(userData) {
      
    } 
    






  }, [userData]);
  let navigate = useNavigate()


  // const character: Character = characterParser(charData);

  return (
    <div className="home-page">
      <h2 className="home-greeting">
        Hello, {user?.displayName}
      </h2>
      {/* <HomeStats /> */}
      <HomeStudyPrompt
        newUser={userData}
        suggestedDeck={{
          id: 0,
          image: "../sample_deck.png",
          name: recentDeck?.name || ""
        }}
      />
      <h2>Review Mode</h2>
      <button onClick={()=> {navigate("/review")}}>
        {/* <Link to={{pathname:"/review"}}> */}
          Study words so far
        {/*</Link> */}
      </button>
      
      <h2>Recent Decks</h2>
      {(loading || decks === null || decks === undefined || userData === null) ? <LoadingSpinner /> : <DeckList length={3} user={userData} decks={decks} ></DeckList>}
      {/* {JSON.stringify(userData)}
    {JSON.stringify(decks)} */}
    </div >
  );
};

export default Home;