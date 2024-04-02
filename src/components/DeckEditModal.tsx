import React, { useEffect, useMemo, useState } from "react";
import "../styles/styles.css";
import IndexedDBCaching, {
  IndexedDBCachingResult,
} from "../utils/useIndexedDBCaching";
import characterParser from "../utils/characterParser";
import Character from "../types/Character";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { updateUserDeck } from "../utils/FirebaseQueries";

interface Kanji {
  id: number;
  unicode: string;
  hiragana: string;
  english: string;
  isSelected: boolean;
}

interface DeckEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterCache: IndexedDBCachingResult | null;
  kanjiList?: Kanji[]; //Not needed?
  deckName: string;
  deckId: string;
  charRefs: DocumentReference[];
}

const DeckEditModal: React.FC<DeckEditModalProps> = ({
  isOpen,
  onClose,
  kanjiList,
  characterCache,
  deckName,
  deckId,
  charRefs
}) => {
  const createInitialSelectedKanji = (refs: DocumentReference[]) => {
    if (!characterCache?.data) {
      return [] as Character[];
    }
    return (
      characterCache.data
        .filter((characterCacheData: DocumentData) =>
          charRefs.some(
            (charRef: DocumentReference) =>
              charRef.id === characterCacheData._id
          )
        )
        .map((characterData: DocumentData | null) =>
          characterParser(characterData)
        )
        .filter((nullableChar) => nullableChar !== null) as Character[] || ([] as Character[])
    );
  };
  //TODO: Optimize?
  const [selectedKanji, setSelectedKanji] = useState<Character[]>(
    []
  );
  const characters: Character[] | undefined = useMemo(() => {
    //return characterCache?.data?.map((docData) => characterParser(docData) ).filter((character) => character!==null)
    return (characterCache?.data || [])
      .map((docData) => characterParser(docData))
      .filter((character): character is Character => character !== null);
  }, [characterCache?.data]);

  useEffect(() => {
    setSelectedKanji(createInitialSelectedKanji(charRefs))
  }, [])

  const toggleKanjiSelection = (kanji: Character) => {
    const isAlreadySelected = selectedKanji.some(
      (k) => k.unicode === kanji?.unicode
    );
    if (isAlreadySelected) {
      setSelectedKanji(
        selectedKanji.filter((k) => k.unicode !== kanji?.unicode)
      );
    } else {
      setSelectedKanji([...selectedKanji, kanji]);
    }
  };

  const handleSubmit = () => {
    //TODO Change desc.
    updateUserDeck(deckId, selectedKanji, "", deckName, "")
    setSelectedKanji([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedKanji([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <div className="deck-title-display">
          <h2>{deckName}</h2>
        </div>
        <ul className="add-word-list">
          {characters?.map((kanji) => (
            <li key={kanji?.unicode_str}>
              <input
                type="checkbox"
                checked={selectedKanji.some(
                  (k) => k.unicode === kanji?.unicode
                )}
                onChange={() => toggleKanjiSelection(kanji)}
              />
              {kanji?.unicode} - { } - {kanji?.one_word_meaning}
            </li>
          ))}
        </ul>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default DeckEditModal;
