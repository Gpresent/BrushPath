import React, { useContext } from "react";
import '../styles/styles.css'
import Deck from "../types/Deck";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/FirebaseContext";
import { DocumentData } from "firebase/firestore";
import { updateUserRecentDeck } from "../utils/FirebaseQueries";

interface HomeStudyPromptProps {
  newUser: DocumentData;
  suggestedDeck: Deck;
}

const HomeStudyPrompt: React.FC<HomeStudyPromptProps> = ({ newUser, suggestedDeck }) => {
  const navigate = useNavigate();
  const { getUserData } = useContext(AuthContext);

  console.log(suggestedDeck);
  const handleDeckClick = (deckId: any) => {
    console.log('Deck clicked:', suggestedDeck);
    if (suggestedDeck._id) {
      //console.log(suggestedDeck._id)
      updateUserRecentDeck(newUser.email, suggestedDeck._id);
      getUserData();
    }
    navigate(`/deck/${suggestedDeck._id}`);

  };

  return (
    <div className="deck-prompt">
      <div className="word-group">
        {newUser ? (
          <p className="continue-prompt">Start a new study session</p>
        ) : (
          <p className="continue-prompt">Continue your last study session</p>
        )}
        {newUser ? (
          <p className="deck-name-prompt">Jump into {suggestedDeck.name}</p>
        ) : (
          <p className="deck-name-prompt">
            You were learning {suggestedDeck.name}
          </p>
        )}
      </div>
      <div
        className="image-wrapper"
        style={{ backgroundImage: `url(${suggestedDeck.image})` }}
        onClick={handleDeckClick}
      >
        <div />
      </div>
    </div>
  );
};

export default HomeStudyPrompt;