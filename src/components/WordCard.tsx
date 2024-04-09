import React from "react";
import '../styles/styles.css'
import Character from "../types/Character";
import { Link } from "react-router-dom";

interface WordCardProps {
  character: Character;
  selectable?: boolean;
  handleClick?: (character: Character) =>void;
}

const WordCard: React.FC<WordCardProps> = ({ character, selectable, handleClick}) => {
  if(selectable) {
    return (
      <>
        <div onClick={() => {if(handleClick) {handleClick(character)}}} className={`word-card ${character.selected? "selected":""}`}>
          <p className="character">{character.unicode}</p>
          <p className="hiragana">{ }</p>
          <p className="meaning">{character.one_word_meaning}</p>
        </div>
      </>
    );
  }
  return (
    <>
      <Link to={{ pathname: '/character' }} state={{ character }} className="word-card">
        <p className="character">{character.unicode}</p>
        <p className="hiragana">{ }</p>
        <p className="meaning">{character.one_word_meaning}</p>
      </Link>
    </>
  );
};

export default WordCard;