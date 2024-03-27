import Character from "../types/Character";
import "../styles/styles.css";
import "../styles/review.css";
import "../styles/dict.css";
import Draw from "./Draw";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

interface DrawReviewProps {
  setShowHeader: any;
}

const DrawReview: React.FC<DrawReviewProps> = ({ setShowHeader }) => {
  // (document.getElementsByClassName('header-wrapper')[0]as any).style.visibility = 'none';
  useEffect(() => {
    setShowHeader(false);
  }, [setShowHeader]);

  let { state } = useLocation();
  let character: Character = state.character;

  let meaning_len = 0;

  let font_size = 28;

  if (character && character.english) {
    character.english.forEach((meaning) => {
      meaning_len += meaning.length;
    });
  }

  if (meaning_len > 30) {
    font_size = 20;
    if (meaning_len > 75) {
      font_size = 15;
    }
  }

  return (
    <div className="draw-review">
      {character && (
        <>
          <div className="character-prompt">{character.one_word_meaning}</div>
          <Draw character={character} allowDisplay={false} />
        </>
      )}
    </div>
  );
};

export default DrawReview;
