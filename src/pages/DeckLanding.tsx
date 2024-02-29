import React, { useState } from 'react';
import "../styles.css";
import DeckList from "../components/DeckList";
import HomeStats from "../components/HomeStats";
import AddIcon from '@mui/icons-material/Add';
import KanjiModal from '../components/KanjiModal';
import Character from '../types/Character';

interface DeckProps {
    //message: string;
    title: string;
  }

const decks = [
    {
        id: 0,
        coverImage:
          "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dywxv8qwvzp-497%3A24178?alt=media&token=84fb6b9c-9a3a-4b4d-ab33-bbdbe677272b",
        name: "Test Deck 1",
      },
      {
        id: 1,
        coverImage:
          "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dywxv8qwvzp-497%3A24178?alt=media&token=84fb6b9c-9a3a-4b4d-ab33-bbdbe677272b",
        name: "Test Deck 2",
      },
      {
        id: 2,
        coverImage:
          "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dywxv8qwvzp-497%3A24178?alt=media&token=84fb6b9c-9a3a-4b4d-ab33-bbdbe677272b",
        name: "Test Deck 3",
      },
      {
        id: 3,
        coverImage:
          "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dywxv8qwvzp-497%3A24178?alt=media&token=84fb6b9c-9a3a-4b4d-ab33-bbdbe677272b",
        name: "Test Deck 4",
      }
      ,
      {
        id: 4,
        coverImage:
          "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dywxv8qwvzp-497%3A24178?alt=media&token=84fb6b9c-9a3a-4b4d-ab33-bbdbe677272b",
        name: "Test Deck 5",
      },
      {
        id: 5,
        coverImage:
          "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dywxv8qwvzp-497%3A24178?alt=media&token=84fb6b9c-9a3a-4b4d-ab33-bbdbe677272b",
        name: "Test Deck 6",
      }
]

const jlptN5Kanji: Character[] = [
  { id: 1, unicode: '一', hiragana: 'いち', english: 'one' },
  { id: 2, unicode: '二', hiragana: 'に', english: 'two' },
  { id: 3, unicode: '三', hiragana: 'さん', english: 'three' },
  { id: 4, unicode: '四', hiragana: 'し/よん', english: 'four' },
  { id: 5, unicode: '五', hiragana: 'ご', english: 'five' },
  { id: 6, unicode: '六', hiragana: 'ろく', english: 'six' },
  { id: 7, unicode: '七', hiragana: 'しち/なな', english: 'seven' },
  { id: 8, unicode: '八', hiragana: 'はち', english: 'eight' },
  { id: 9, unicode: '九', hiragana: 'きゅう/く', english: 'nine' },
  { id: 10, unicode: '十', hiragana: 'じゅう', english: 'ten' },
  { id: 11, unicode: '百', hiragana: 'ひゃく', english: 'hundred' },
  { id: 12, unicode: '千', hiragana: 'せん', english: 'thousand' },
  { id: 13, unicode: '円', hiragana: 'えん', english: 'yen' },
  { id: 14, unicode: '日', hiragana: 'にち/ひ', english: 'day/sun' },
  { id: 15, unicode: '月', hiragana: 'げつ/がつ', english: 'month/moon' },
  { id: 16, unicode: '火', hiragana: 'か', english: 'fire' },
  { id: 17, unicode: '水', hiragana: 'すい', english: 'water' },
  { id: 18, unicode: '木', hiragana: 'もく', english: 'tree' },
  { id: 19, unicode: '金', hiragana: 'きん/こん', english: 'gold/metal' },
  { id: 20, unicode: '土', hiragana: 'ど/と', english: 'earth' },
];


const DeckLandingView: React.FC<DeckProps> = ({ title }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAddDeck = () => {
      setModalOpen(true);
  };

  const handleCloseModal = () => {
      setModalOpen(false);
  };

  const handleDeckClick = (deckId:any) => {
    console.log('Deck clicked:', deckId);
};

  return (
    <div className="home-page">
      <div className="header">
          <h2>Your Decks</h2>
          <AddIcon className="addButton" onClick={handleAddDeck} />
      </div>
      <input className="search-bar" />
      <HomeStats/>
      <DeckList decks={decks} onDeckClick={handleDeckClick} />
      <KanjiModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        kanjiList={jlptN5Kanji} 
      />
    </div>
  );
};

export default DeckLandingView;