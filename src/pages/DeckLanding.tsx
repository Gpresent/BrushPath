import React from "react";
import "../styles.css";
import DeckList from "../components/DeckList";
import HomeStats from "../components/HomeStats";
import AddIcon from '@mui/icons-material/Add';

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

const DeckLandingView: React.FC<DeckProps> = ({title}) => {
    const handleAddDeck = () => {
        console.log('Add Deck');
      };

    const handleDeckClick = (deckId:any) => {
        console.log('Deck clicked:', deckId);
    };

    return (
      <div className="home-page">
        <div className="header">
            <h2>Your Decks</h2>
            <AddIcon className="addButton" onClick={handleAddDeck}></AddIcon>
        </div>
        <input className="search-bar" />
        <HomeStats/>
        <DeckList decks={decks} onDeckClick={handleDeckClick}></DeckList>
      </div>
    );
  };
  
export default DeckLandingView;