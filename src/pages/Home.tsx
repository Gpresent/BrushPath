import React, { useContext, useEffect, useState } from "react";
import "../styles/styles.css";
import HomeStudyPrompt from "../components/HomeStudyPrompt";
import DeckList from "../components/DeckList";
import { AuthContext } from "../utils/FirebaseContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { getDecksFromRefs, getDeckFromID } from "../utils/FirebaseQueries";


const Home: React.FC = () => {
  //const {user} = useParams<any>();
  const { user, userData, getUserData } = useContext(AuthContext);

  const [decks, setDecks] = useState<any>([]);
  const [recentDeck, setRecentDeck] = useState<any>();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userData) {
      getUserData();
    } else {
      const recentDeck = getDeckFromID(userData.last_deck_studied.id).then(
        (result) => {
          setRecentDeck(result);
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchDecks = async () => {
      if (userData) {
        return await getDecksFromRefs(userData.decks);
      }
    };

    fetchDecks().then((decksResult) => {
      // console.log(decksResult);
      setDecks(decksResult);
      setLoading(false);
    });
  }, [userData]);

  // const character: Character = characterParser(charData);

  return (
    <div className="home-page">
      <h2 className="home-greeting">Hello, {user?.displayName}</h2>
      {/* <HomeStats /> */}
      <HomeStudyPrompt
        newUser={false}
        suggestedDeck={{
          id: 0,
          image: "../sample_deck.png",
          name: recentDeck?.name || "",
        }}
      />
      <h2>Recent Decks</h2>
      {loading || decks === null || decks === undefined || userData === null ? (
        <LoadingSpinner />
      ) : (
        <DeckList user={userData} decks={decks}></DeckList>
      )}
      {/* {JSON.stringify(userData)}
    {JSON.stringify(decks)} */}
    </div>
  );
};

export default Home;
