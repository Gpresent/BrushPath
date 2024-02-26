import React from "react";
import "../styles.css";
import HomeStats from "../components/HomeStats";
import HomeStudyPrompt from "../components/HomeStudyPrompt";
import DeckList from "../components/DeckList";
import { useParams } from "react-router";

interface HomeProps {
  message: string;
  user: string;
}

const decks = [
    {
        id: 0,
        coverImage: "./sample_deck.png",
        name: "awesome deck 1",
      },
      {
        id: 1,
        coverImage: "./sample_deck.png",
        name: "awesome deck 2",
      },
      {
        id: 2,
        coverImage: "./sample_deck.png",
        name: "another dope deck",
      }
]

const Home: React.FC<HomeProps> = (props) => {
  const {user} = useParams<any>();
  return (
    <div className="home-page">
      <h2 className="home-greeting">
        {props.message}, {user}
      </h2>
      <HomeStats />
      <HomeStudyPrompt
        newUser={false}
        suggestedDeck={{
          id: 0,
          coverImage: "./sample_deck.png",
          name: "JLPT N5"
        }}
      />
    <h2>Recent Decks</h2>
    <DeckList decks={decks}></DeckList>
    </div>
  );
};

export default Home;
