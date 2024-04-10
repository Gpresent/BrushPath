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

import { getDecksFromRefs, getDeckFromID, getCharacterScoreData, getCharacterScoreCount } from "../utils/FirebaseQueries";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { channel } from "diagnostics_channel";



type RetrievableData = {
  data: DocumentData[] | null;
  loading: boolean;
  error: string;
};

type RetrievableCount = {
  data: number | null;
  loading: boolean;
  error: string;
};

const Home: React.FC = (props) => {

  const navigate = useNavigate();

  //const {user} = useParams<any>();
  const { user, userData, getUserData, initalGetUserData } = useContext(AuthContext);

  const [decks, setDecks] = useState<any>([]);

  const [userCharacterScoreData, setUserCharacterScoreData] = useState<RetrievableData>({ data: null, loading: true, error: "" });
  const [userCharacterScoreCount, setUserCharacterScoreCount] = useState<RetrievableCount>({ data: -1, loading: true, error: "" });

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
      initalGetUserData();
    }
  }, []);

  useEffect(() => {
    const fetchDecks = async () => {
      const decksResult = await getDecksFromRefs(userData?.decks)
      setDecks(decksResult);
      setLoading(false);
    }

    //TODO: Maybe this should just get the count. Let's see if its slow on prod
    // const fetchScores = async () => {
    //   if(!userData?.email) {
    //     setUserCharacterScoreData({...userCharacterScoreData, loading:false, error: "No email found"})
    //   }
    //   const characterScoreData = await getCharacterScoreData(userData?.email)
    //   if(characterScoreData === null || characterScoreData === undefined) {
    //     setUserCharacterScoreData({...userCharacterScoreData, loading:false, error: "Error fetching character scores"})
    //   }
    //   console.log(characterScoreData)
    //   setUserCharacterScoreData({data: characterScoreData, loading: false, error:""})
    // }

    //Works faster but doesn't work offline
    const fetchScoreCount = async () => {
      if (!userData?.email) {
        setUserCharacterScoreCount({ ...userCharacterScoreCount, loading: false, error: "No email found" })
      }
      const characterScoreCount = await getCharacterScoreCount(userData?.email)
      if (characterScoreCount === null || characterScoreCount === undefined) {
        setUserCharacterScoreCount({ ...userCharacterScoreCount, loading: false, error: "Error fetching character scores" })
      }
      setUserCharacterScoreCount({ data: characterScoreCount, loading: false, error: "" })
    }

    if (userData) {
      fetchDecks();
      fetchScoreCount();
    }

  }, [userData]);





  // const character: Character = characterParser(charData);

  return (
    <div className="home-page">
      <h2 className="home-greeting">
        Hello, {user?.displayName}
      </h2>
      {/* <HomeStats /> */}
      {(decks === null || decks === undefined || userData === null) ? <LoadingSpinner /> : <HomeStudyPrompt
        newUser={userData}
        suggestedDeck={{
          ...decks[0],
          id: 0
        }}
      />}
      <div className="deck-title">Review Mode</div>

      {userCharacterScoreCount.loading ? <LoadingSpinner /> :
        userCharacterScoreCount.error || userCharacterScoreCount.data === null ? <p>error: {userCharacterScoreCount.error}</p> :
          userCharacterScoreCount.data > 0 ?
            <button onClick={() => { navigate("/review") }}>
              Study words so far
            </button>
            :
            userCharacterScoreCount.data === 0 ?
              <div>Learn some kanji before using review mode.</div> :
              <div>Review Mode is currently not available offline.</div>
      }

      <div className="deck-title">Recent Decks</div>
      {(loading || decks === null || decks === undefined || userData === null) ? <LoadingSpinner /> : <DeckList length={3} user={userData} decks={decks} ></DeckList>}
      {/* {JSON.stringify(userData)}
    {JSON.stringify(decks)} */}
    </div >
  );
};

export default Home;