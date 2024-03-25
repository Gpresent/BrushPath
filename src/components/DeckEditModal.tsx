import React, { useState } from "react";
import "../styles/styles.css";

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
    kanjiList: Kanji[];
    deckName: string; 
}

const DeckEditModal: React.FC<DeckEditModalProps> = ({ isOpen, onClose, kanjiList, deckName }) => {
    const [selectedKanji, setSelectedKanji] = useState<Kanji[]>([]);

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
                <span className="close" onClick={handleClose}>&times;</span>
                <div className="deck-title-display">
                    <h2>{deckName}</h2> 
                </div>
                <ul className="add-word-list">
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

export default DeckEditModal;
