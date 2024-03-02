import React from "react";
import '../styles/styles.css'
import Character from "../types/Character"; 
import { Link } from "react-router-dom";

interface WordCardProps {
  character: Character;
}

const WordCard: React.FC<WordCardProps> = ({ character }) => {

  return (
    <>
    <Link to={{ pathname: '/character' }} state={{character}} className="word-card">
      <p className="character">{character.unicode}</p>
      <p className="hiragana">{}</p>
      <p className="meaning">{character.english[0]}</p>
    </Link>
    </>
  );
};

export default WordCard;