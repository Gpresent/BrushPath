import React, { useContext, useEffect } from "react";
import "../styles/styles.css";
import HomeStats from "../components/HomeStats";
import HomeStudyPrompt from "../components/HomeStudyPrompt";
import DeckList from "../components/DeckList";
import { useParams } from "react-router";
import { AuthContext } from "../utils/FirebaseContext";
import { updateProfile } from "firebase/auth";
import { auth } from "../utils/Firebase";

interface HomeProps {
  message: string;
  user: string;
}

const decks = [
    {
        id: 0,
        coverImage: "../sample_deck.png",
        name: "awesome deck 1",
      },
      {
        id: 1,
        coverImage: "../sample_deck.png",
        name: "awesome deck 2",
      },
      {
        id: 2,
        coverImage: "../sample_deck.png",
        name: "another dope deck",
      }
]

const Home: React.FC<HomeProps> = (props) => {
  const handleDeckClick = (deckId:any) => {
    console.log('Deck clicked:', deckId);
  };
  //const {user} = useParams<any>();
  const {user} = useContext(AuthContext);

  return (
    <div className="home-page">
      <h2 className="home-greeting">
        {props.message}, {user?.displayName}
      </h2>
      <HomeStats />
      <HomeStudyPrompt
        newUser={false}
        suggestedDeck={{
          id: 0,
          coverImage: "../sample_deck.png",
          name: "JLPT N5"
        }}
      />
    <h2>Recent Decks</h2>
    <DeckList decks={decks} onDeckClick={handleDeckClick}></DeckList>
    </div>
  );
};

export default Home;
