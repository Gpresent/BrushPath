import React, { useCallback, useContext, useEffect, useState } from "react";
import "../styles/styles.css";
import WordList from "../components/WordList";
import characterParser from "../utils/characterParser";
import AddIcon from "@mui/icons-material/Add";
import DeckEditModal from "../components/DeckEditModal";
import { Link, useParams } from "react-router-dom";
import { DocumentData } from "firebase/firestore";
import { getCharsFromRefs, getDeckFromID } from "../utils/FirebaseQueries";
import Loading from "../components/Loading";
import InfiniteScroll from "react-infinite-scroller";
import { AuthContext } from "../utils/FirebaseContext";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { CharacterSearchContext } from "../utils/CharacterSearchContext";
import MiniSearch from "minisearch";
import ArrowForward from "@mui/icons-material/ArrowForward";

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
  const {userData, getUserData} = useContext(AuthContext);

  const characterCache = useContext(CharacterSearchContext);

  const fetchChars = useCallback(async () => {
    let curCharacters = characters;

    if (deck && deck.data && deck.data.characters) {
      await getCharsFromRefs(deck.data.characters, charIndex).then(
        (fetchedChars) => {
          let charsToAdd = fetchedChars
            .map((character: any) => characterParser(character))
            .filter((elem) => elem != null && !curCharacters.includes(elem));

          // search.addAll(charsToAdd)
          curCharacters = curCharacters.concat(charsToAdd);
        }
      );
    } else {
      // console.log("deck.data or something not found, not fetching");
    }
    setCharIndex(charIndex + 1);
    setCharacters(curCharacters);
  }, [charIndex, deck, characters]);

  let { id } = useParams();

  useEffect(() => {
    if (!userData) {
      getUserData();
    }
  }, []);

  useEffect(() => {
    if (userData && id) {
      getDeckFromID(id).then((deckData) => {
        if (deckData) {
          setDeck({ data: deckData, loading: false, error: "" });
        } else {
          setDeck({ data: null, loading: false, error: "Deck not found" });
        }
        console.log(deckData);
      });
    } else {
      setDeck({ data: null, loading: false, error: "No url parameter" });
    }
  }, [userData]);

  const handleEditDeck = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  let navigate = useNavigate();

  return (
    <div className="deck-landing">
      {deck.loading ? (
        <Loading />
      ) : deck.data === null ? (
        <div> {deck.error}</div>
      ) : (
        <>
          <div className="deck-header-wrapper">
            <div className="deck-header">
              <div className="deck-title-back">
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => navigate("/")}
                >
                  <ArrowBackIosNewIcon
                    style={{ fontSize: "18px" }}
                  ></ArrowBackIosNewIcon>
                </div>
                <p className="my-words">{deck.data?.name}</p>
              </div>
              {(userData?.email === deck.data?.userRef.id) && (
                <AddIcon className="addButton" onClick={handleEditDeck} />
              )}
            </div>
            <div
              className="page-cover-image"
              style={{ backgroundImage: `url(${deck.data.image as string})` }}
            ></div>

            <div
              className="learn-deck-prompt"
              onClick={() => {
                navigate(`/deck/${id}/learn`);
              }}
            >
              <span>Practice this Deck</span> <ArrowForward />
            </div>
            {/* <input className="search-bar" /> */}
          </div>

          <div
          // style={{ maxHeight: "70vh", overflow: "auto" }}
          >
            <InfiniteScroll
              pageStart={0}
              loadMore={fetchChars}
              hasMore={charIndex * 30 <= deck.data?.characters.length}
              loader={<></>}
              useWindow={false}
            >
              {<WordList style={{ maxHeight: "48vh"}} words={characters} />}
            </InfiniteScroll>
          </div>

          {isEditModalOpen && (
            <DeckEditModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              characterCache={characterCache}
              deckName={title}
              charRefs={deck.data.characters}
              deckId={deck.data._id}
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
