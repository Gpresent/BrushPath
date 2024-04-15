import Character from "../types/Character";
import "../styles/styles.css";
import "../styles/dict.css";
import Draw from "./Draw";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import React, { useEffect, useState} from "react";
import { CharacterFamiliarityInfo } from "../components/CharacterFamiliarityInfo";
import AddToDeckModal from "../components/AddToDeckModal";

const SingleWordView: React.FC = () => {
  let { state } = useLocation();
  let character: Character = state.character;
  const [characterinfo, setCharacterInfo] = React.useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  let meaning_len = 0;

  let font_size = 28;

  if (character && character.english) {
    character.english.forEach((meaning) => {
      meaning_len += meaning.length;
    });
  }

  if (meaning_len > 30) {
    font_size = 20;
    if (meaning_len > 75) {
      font_size = 15;
    }
  }
  let navigate = useNavigate();


  const handleAddToDeck = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="single-word-view">
        {character && (
          <>
            <div className="character-header">
              <div className="character-kanji">
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  onClick={() => navigate(-1)}
                >
                  <ArrowBackIosNewIcon/>
                </div>
                {character.unicode}
              </div>
              {character.english.length > 0 && (
                <div
                  className="character-meanings"
                  style={{ fontSize: `${font_size}px` }}
                >
                  {character.english.map((meaning, index) => {
                    return <span>{(index ? ", " : "") + meaning}</span>;
                  })}
                </div>
              )}
            </div>

            <button className="AddToDeckButton" onClick={() => handleAddToDeck()}> Add To Deck </button>

            <div className="character-info-button" onClick={() => {
                  console.log("clicked");
                  setCharacterInfo(!characterinfo);
                  document.getElementsByClassName("info")[0]?.classList.toggle("info-hidden");
                }}>
            
                {characterinfo ? <> Less Info <ExpandLess fontSize="medium"/></> : <> More Info <ExpandMore fontSize="medium"/></>}
            
            </div>
            <div className="info info-hidden">
              <div className="character-info">
                <div className="info-line">strokes: {character.stroke_count} </div>
                {character.kun.length > 0 && (
                  <div className="info-line">
                    kun:{" "}
                    {character.kun.map((kun, index) => {
                      return (index ? ", " : "") + kun;
                    })}
                  </div>
                )}
                {character.on.length > 0 && (
                  <div className="info-line">
                    on:{" "}
                    {character.on.map((on, index) => {
                      return (index ? ", " : "") + on;
                    })}
                  </div>
                )}
                {character.radicals.length > 0 && (
                  <div className="info-line">
                    radicals:{" "}
                    {character.radicals.map((radical, index) => {
                      return (index ? ", " : "") + radical;
                    })}
                  </div>
                )}
                {character.jlpt && (
                  <div className="info-line">JLPT: {character.jlpt} </div>
                )}
                {character.freq && (
                  <div className="info-line">frequency: {character.freq} </div>
                )}
                {character.grade && (
                  <div className="info-line">grade: {character.grade} </div>
                )}
              </div>
              <div className="mastery-desc">
                <CharacterFamiliarityInfo character={character} />
              </div>
            </div>
            <Draw recall={false} character={character} allowDisplay={true} />
          </>
        )}
        <AddToDeckModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        character={character}
        />
      </div>
    </>
  );
};

export default SingleWordView;
