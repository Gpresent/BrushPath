import Character from "../types/Character";
import "../styles/styles.css";
import "../styles/review.css";
import "../styles/dict.css";
import Draw from "./Draw";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
import KanjiGrade from "../types/KanjiGrade";

interface DrawReviewProps {
  // setShowHeader: any;
  char?:Character;
  handleAdvance: (arg0: Character, arg1:KanjiGrade )=> void;
  handleComplete: (arg0: Character, arg1: KanjiGrade) => void;
}

const DrawReview: React.FC<DrawReviewProps> = ({ char, handleComplete }) => {

  // const [] = React.useState<boolean>(false);

  // useEffect(() => {
  //   setShowHeader(false);
  // }, [setShowHeader]);

  let { state } = useLocation();
  let character: Character = char || state.character;

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
          <Draw handleComplete={handleComplete} character={character} allowDisplay={true} />
        </>
      )}
    </div>
  );
};

export default DrawReview;
