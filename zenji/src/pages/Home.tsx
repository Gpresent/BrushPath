import React from "react";
import "../styles.css";
import HomeStats from "../components/HomeStats";
import HomeStudyPrompt from "../components/HomeStudyPrompt";
import DeckList from "../components/DeckList";

interface HomeProps {
  message: string;
  user: string;
}

const decks = [
    {
        id: 0,
        coverImage:
          "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dywxv8qwvzp-497%3A24178?alt=media&token=84fb6b9c-9a3a-4b4d-ab33-bbdbe677272b",
        name: "awesome deck 2",
      },
      {
        id: 1,
        coverImage:
          "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dywxv8qwvzp-497%3A24178?alt=media&token=84fb6b9c-9a3a-4b4d-ab33-bbdbe677272b",
        name: "awesome deck 2",
      },
      {
        id: 2,
        coverImage:
          "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dywxv8qwvzp-497%3A24178?alt=media&token=84fb6b9c-9a3a-4b4d-ab33-bbdbe677272b",
        name: "another dope deck",
      }
]

const Home: React.FC<HomeProps> = (props) => {
  return (
    <div className="home-page">
      <h2 className="home-greeting">
        {props.message}, {props.user}
      </h2>
      <HomeStats />
      <HomeStudyPrompt
        newUser={false}
        suggestedDeck={{
          id: 0,
          coverImage:
            "https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dywxv8qwvzp-497%3A24178?alt=media&token=84fb6b9c-9a3a-4b4d-ab33-bbdbe677272b",
          name: "le epic deck",
        }}
      />
    <h2>Recent Decks</h2>
    <DeckList decks={decks}></DeckList>
    </div>
  );
};

export default Home;
