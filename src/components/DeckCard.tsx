import React, { useContext } from "react";
import "../styles/styles.css";
import Deck from "../types/Deck";
import { Link, useNavigate } from "react-router-dom";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { updateUserRecentDeck } from "../utils/FirebaseQueries";
import { AuthContext } from "../utils/FirebaseContext";
import {
  refEqual
} from "firebase/firestore";

interface DeckCardProps {
  deck: Deck;
  user: DocumentData
}


const DeckCard: React.FC<DeckCardProps> = ({ deck, user }) => {
  const navigate = useNavigate();
  const { userData, getUserData } = useContext(AuthContext);



  const handleDeckClick = (deckId: any) => {
    //console.log('Deck clicked:', deckId);
    // console.log(deck)
    if (deck._id) {
      console.log(user.decks[0].id)
      console.log("deck being swapped", deck)


      updateUserRecentDeck(user.email, deck._id, userData?.decks);
      // getUserData();

    }
    navigate(`/deck/${deck._id}`);

  };

  return (
    <div className="deck-card clip-contents" onClick={handleDeckClick}>
      <div className="cover-image" style={{ backgroundImage: `url(${deck.image})` }}>
      </div>
      <p className="title">{deck.name}</p>
    </div>
  );
};

export default DeckCard;
