import React, { useState } from "react";
import "../styles.css";

interface Kanji {
    id: number;
    unicode: string;
    hiragana: string;
    english: string;
    isSelected?: boolean;
}

interface KanjiModalProps {
    isOpen: boolean;
    onClose: () => void;
    kanjiList: Kanji[];
}
  
  
const KanjiModal: React.FC<KanjiModalProps> = ({ isOpen, onClose, kanjiList }) => {
    const [selectedKanji, setSelectedKanji] = useState<Kanji[]>([]);
    const [deckTitle, setDeckTitle] = useState("");
  
    const toggleKanjiSelection = (kanji: Kanji) => {
      const isAlreadySelected = selectedKanji.some((k) => k.id === kanji.id);
      if (isAlreadySelected) {
        setSelectedKanji(selectedKanji.filter((k) => k.id !== kanji.id));
      } else {
        setSelectedKanji([...selectedKanji, kanji]);
      }
    };
  
    const handleSubmit = () => {
      // add logic :)
  
      setSelectedKanji([]);
      setDeckTitle("");
      onClose();
    };
  
    const handleClose = () => {
      setSelectedKanji([]);
      setDeckTitle("");
      onClose();
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={handleClose}>&times;</span>
          <div className="deck-title-input">
            <label htmlFor="deckTitle">Enter Deck Name:</label>
            <input
              type="text"
              id="deckTitle"
              value={deckTitle}
              onChange={(e) => setDeckTitle(e.target.value)}
            />
          </div>
          <ul>
            {kanjiList.map(kanji => (
              <li key={kanji.id}>
                <input 
                  type="checkbox" 
                  checked={selectedKanji.some((k) => k.id === kanji.id)}
                  onChange={() => toggleKanjiSelection(kanji)}
                />
                {kanji.unicode} - {kanji.hiragana} - {kanji.english}
              </li>
            ))}
          </ul>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    );
};
  
  export default KanjiModal;