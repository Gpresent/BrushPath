import React from "react";
import "../styles.css";
import Character from "../types/Character"; 

interface WordCardProps {
  character: Character;
}

const WordCard: React.FC<WordCardProps> = ({ character }) => {
  return (
    <>
    <div className="word-card">
      <p className="character">{character.unicode}</p>
      <p className="hiragana">{character.hiragana}</p>
      <p className="meaning">{character.english}</p>
    </div>
    </>
  );
};

export default WordCard;
