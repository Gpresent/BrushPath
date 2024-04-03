import React from "react";
import '../styles/styles.css'
import Character from "../../types/Character";
import { Link } from "react-router-dom";

interface WordCardProps {
  character: Character;
}

const ReviewWordCard: React.FC<WordCardProps> = ({ character }) => {
  // console.log(character)
  return (
    <>
      <Link to={{ pathname: '/review/character' }} state={{ character }} className="word-card">
        <p className="character">{character.unicode}</p>
        <p className="hiragana">{ }</p>
        <p className="meaning">{character.one_word_meaning}</p>
      </Link>
    </>
  );
};

export default ReviewWordCard;
// convert the word card into a version for the word_list