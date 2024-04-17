import React, { useEffect, useState, useContext } from "react";
import "../styles/styles.css";
import DeckList from "../components/DeckList";
import HomeStats from "../components/HomeStats";
import AddIcon from "@mui/icons-material/Add";
import KanjiModal from "../components/KanjiModal";
import Character from "../types/Character";
import { AuthContext } from "../utils/FirebaseContext";
import { getDecksFromRefs } from "../utils/FirebaseQueries";
import LoadingSpinner from "../components/LoadingSpinner";
import { CharacterSearchContext } from "../utils/CharacterSearchContext";
import { useDecks } from "../utils/DeckContext";



interface DeckProps {
  //message: string;
  title: string;
  kanjiList: Character[];
  lastRef: string;
}


const DeckLandingView: React.FC<DeckProps> = ({ title, kanjiList, lastRef }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { userData, getUserData, user } = useContext(AuthContext);
  const characterCache = useContext(CharacterSearchContext);
  const { decks, fetchDecks } = useDecks();


  // useEffect(() => {
  //   // const fetchDecks = async () => {
  //   //   if (userData && userData.decks) {
  //   //     const fetchedDecks = await getDecksFromRefs(userData.decks);
  //   //     setDecks(fetchedDecks);
  //   //   }
  //   // };


  // }, [userData]);

  // useEffect(() => {
  //   if (userData?.decks) {
  //     console.log("Fetching decks")
  //     // fetchDecks();  // Only fetch decks if userData is not null and decks are available
  //   }
  // }, [userData?.decks]);


  const handleAddDeck = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="deck-landing">
      <div className="deck-header-wrapper">
        <div className="deck-header">
          <h2 className="deck-title">My Decks</h2>
          <AddIcon className="addButton" onClick={handleAddDeck} />
        </div>
        <input className="search-bar" />
      </div>

      {/* <HomeStats /> */}
      <div className="deck-list-container">

        {
          !userData ? <LoadingSpinner /> : <DeckList decks={decks}
            user={userData} length={decks.length} />
        }
      </div >
      <KanjiModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        kanjiList={jlptN5Kanji}
        characterCache={characterCache}
        userData={userData}
        user={user}
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
