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
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
// interface HomeProps {
//   message: string;
//   user: string;
// }


// also will be pulled from api
// const decks = [
//      {
//         id: 0,
//         coverImage: "../sample_deck.png",
//         name: "JLPT N5",
//       },
//       {
//         id: 1,
//         coverImage: "../deck-covers/sample1.jpeg",
//         name: "JLPT N4",
//       },
//       {
//         id: 2,
//         coverImage: "../deck-covers/sample2.jpeg",
//         name: "JLPT N3",
//       }
// ]


const charData = {
  readings: [
    { type: 'ja_on', value: 'ボク' },
    { type: 'ja_kun', value: 'ほう' },
    { type: 'ja_kun', value: 'ほお' },
    { type: 'ja_kun', value: 'えのき' }
  ],
  nanori: [],
  radicals: [{ rad_type: 'classical', value: '75' }],
  grade: '8',
  jlpt: '1',
  freq: '1626',
  codepoints: [
    { cp_type: 'ucs', value: '6734' },
    { cp_type: 'jis208', value: '1-43-49' }
  ],
  compounds: { '素朴': ['simple', 'artless', 'naive', 'unsophisticated'] },
  meanings: ['crude', 'simple', 'plain', 'docile'],
  stroke_count: '6',
  literal: '朴'
}


const Home: React.FC = (props) => {

  const navigate = useNavigate();
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