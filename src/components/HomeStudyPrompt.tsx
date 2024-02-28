import React from "react";
import '../styles/styles.css'
import Deck from "../types/Deck";

interface HomeStudyPromptProps {
  newUser: boolean;
  suggestedDeck: Deck;
}

const HomeStudyPrompt: React.FC<HomeStudyPromptProps> = ({
  newUser,
  suggestedDeck,
}) => {
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
        style={{ backgroundImage: `url(${suggestedDeck.coverImage})` }}
      >
        <div />
      </div>
    </div>
  );
};

export default HomeStudyPrompt;
