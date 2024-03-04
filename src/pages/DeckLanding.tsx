import React, { useState } from "react";
import "../styles/styles.css";
import DeckList from "../components/DeckList";
import HomeStats from "../components/HomeStats";
import AddIcon from "@mui/icons-material/Add";
import KanjiModal from "../components/KanjiModal";
import Character from "../types/Character";

interface DeckProps {
  //message: string;
  title: string;
}

const decks = [
  {
    id: 0,
    coverImage: "../sample_deck.png",
    name: "JLPT N5",
  },
  {
    id: 1,
    coverImage: "../deck-covers/sample1.jpeg",
    name: "JLPT N4",
  },
  {
    id: 2,
    coverImage: "../deck-covers/sample2.jpeg",
    name: "JLPT N3",
  },
  {
    id: 3,
    coverImage: "../deck-covers/sample3.jpeg",
    name: "JLPT N2",
  },
  {
    id: 4,
    coverImage: "../deck-covers/sample4.jpeg",
    name: "JLPT N1",
  },
  {
    id: 5,
    coverImage: "../deck-covers/sample5.jpeg",
    name: "Custom Deck",
  },
];

const DeckLandingView: React.FC<DeckProps> = ({ title }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAddDeck = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDeckClick = (deckId: any) => {
    console.log("Deck clicked:", deckId);
  };

  return (
    <div className="deck-landing">
      <div className="deck-header">
        <h2 className="deck-title">My Decks</h2>
        <AddIcon className="addButton" onClick={handleAddDeck} />
      </div>
      <input className="search-bar" />
      {/* <HomeStats /> */}
      <div className="deck-list-container">
        <DeckList decks={decks} onDeckClick={handleDeckClick} />
      </div>
      <KanjiModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        kanjiList={jlptN5Kanji}
      />
    </div>
  );
};

const jlptN5Kanji: any = [
  { id: 1, unicode: "一", hiragana: "いち", english: "one" },
  { id: 2, unicode: "二", hiragana: "に", english: "two" },
  { id: 3, unicode: "三", hiragana: "さん", english: "three" },
  { id: 4, unicode: "四", hiragana: "し/よん", english: "four" },
  { id: 5, unicode: "五", hiragana: "ご", english: "five" },
  { id: 6, unicode: "六", hiragana: "ろく", english: "six" },
  { id: 7, unicode: "七", hiragana: "しち/なな", english: "seven" },
  { id: 8, unicode: "八", hiragana: "はち", english: "eight" },
  { id: 9, unicode: "九", hiragana: "きゅう/く", english: "nine" },
  { id: 10, unicode: "十", hiragana: "じゅう", english: "ten" },
  { id: 11, unicode: "百", hiragana: "ひゃく", english: "hundred" },
  { id: 12, unicode: "千", hiragana: "せん", english: "thousand" },
  { id: 13, unicode: "円", hiragana: "えん", english: "yen" },
  { id: 14, unicode: "日", hiragana: "にち/ひ", english: "day/sun" },
  { id: 15, unicode: "月", hiragana: "げつ/がつ", english: "month/moon" },
  { id: 16, unicode: "火", hiragana: "か", english: "fire" },
  { id: 17, unicode: "水", hiragana: "すい", english: "water" },
  { id: 18, unicode: "木", hiragana: "もく", english: "tree" },
  { id: 19, unicode: "金", hiragana: "きん/こん", english: "gold/metal" },
  { id: 20, unicode: "土", hiragana: "ど/と", english: "earth" },
];

export default DeckLandingView;
