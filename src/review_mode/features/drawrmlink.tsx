import Character from "../../types/Character";
import "../../styles/styles.css";
import "../../styles/review.css";
import "../../styles/dict.css";
import Draw from "../../pages/Draw";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import React from "react";
// DO NOT  USE JUST TESTING STUFF
interface DrawReviewProps {
  setShowHeader: any;
}

const DrawRLink: React.FC<DrawReviewProps> = ({ setShowHeader }) => {

  // const [] = React.useState<boolean>(false);
  
  useEffect(() => {
    setShowHeader(false);
  }, [setShowHeader]);

  let { state } = useLocation();
//   let character: Character = state.character;

  useEffect(()=> {
    console.log("HERE")
    console.log(state);
  }, [state]);

  let meaning_len = 0;

  let font_size = 28;

//   if (character && character.english) {
//     character.english.forEach((meaning) => {
//       meaning_len += meaning.length;
//     });
//   }

  if (meaning_len > 30) {
    font_size = 20;
    if (meaning_len > 75) {
      font_size = 15;
    }
  }

  return (
    <div className="draw-review">
      {false && (
        <>
          {/* <div className="character-prompt">{character.one_word_meaning}</div> */}
          {/* <Draw character={character} allowDisplay={false} /> */}
        </>
      )}
    </div>
  );
};

export default DrawRLink;
