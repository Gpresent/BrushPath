import React, { useCallback, useEffect, useState } from "react";
import "../styles/styles.css";
import WordList from "../components/WordList";
import characterParser from "../utils/characterParser";
import AddIcon from "@mui/icons-material/Add";
import DeckEditModal from "../components/DeckEditModal";
import { useParams } from "react-router-dom";
import { DocumentData } from "firebase/firestore";
import { getCharsFromRefs, getDeckFromID } from "../utils/FirebaseQueries";
import Loading from "../components/Loading";
import InfiniteScroll from "react-infinite-scroller";

interface DeckProp {
  title: string;
}

type RetrievableData = {
  data: DocumentData | null;
  loading: boolean;
  error: string;
};

const SingleDeckView: React.FC<DeckProp> = ({ title }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deck, setDeck] = useState<RetrievableData>({
    data: null,
    loading: true,
    error: "",
  });
  const [characters, setCharacters] = useState<any>([]);
  const [charIndex, setCharIndex] = useState<number>(0);

  const fetchChars = useCallback(async () => {
    let curCharacters = characters;

    if (deck && deck.data && deck.data.characters) {

      await getCharsFromRefs(
        deck.data.characters,
        charIndex
      ).then((fetchedChars) => {
        curCharacters = curCharacters.concat(
          fetchedChars
            .map((character: any) => characterParser(character))
            .filter((elem) => elem != null && !curCharacters.includes(elem))
        );
      });

    } else {
      // console.log("deck.data or something not found, not fetching");
    }
    setCharIndex(charIndex + 1);
    setCharacters(curCharacters);
  }, [charIndex, deck, characters]);

  let { id } = useParams();

  useEffect(() => {
    if (id) {
      getDeckFromID(id).then((deckData) => {
        if (deckData) {
          setDeck({ data: deckData, loading: false, error: "" });
        } else {
          setDeck({ data: null, loading: false, error: "Deck not found" });
        }
      });
    } else {
      setDeck({ data: null, loading: false, error: "No url parameter" });
    }
  }, []);

  const handleEditDeck = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  return (
    <div className="deck-landing">
      {deck.loading ? (
        <Loading />
      ) : deck.data === null ? (
        <div> {deck.error}</div>
      ) : (
        <>
          <div className="deck-header">
            <p className="my-words">{deck.data?.name}</p>
            <AddIcon className="addButton" onClick={handleEditDeck} />
          </div>
          <input className="search-bar" />
          <div
            style={{ maxHeight: "70vh", overflow: "auto" }}
          >
            <InfiniteScroll
              pageStart={0}
              loadMore={fetchChars}
              hasMore={charIndex * 30 <= deck.data?.characters.length}
              loader={<></>}
              useWindow={false}
            >
              {<WordList words={characters} />}
            </InfiniteScroll>
          </div>

          {isEditModalOpen && (
            <DeckEditModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              kanjiList={jlptN5Kanji_temp}
              deckName={title}
            />
          )}
        </>
      )}
    </div>
  );
};

const jlptN5Kanji_temp: any = [
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

export default SingleDeckView;
