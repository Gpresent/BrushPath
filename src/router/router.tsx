import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DictionaryView from '../pages/Dictionary';
import Home from '../pages/Home';
import Draw from '../pages/Draw';
import Layout from '../Layout'
import Deck from '../types/Deck';
import SingleWordView from '../pages/SingleWord';
import DeckLandingView from '../pages/DeckLanding';
import SettingsView from '../pages/Settings';
import ErrorComponent from '../pages/Error';
import SingleDeckView from '../pages/SingleDeck';
import { Drawer } from '@mui/material';
import DrawReview from '../pages/DrawReview';
import { useState } from 'react';

import { DarkModeProvider } from '../components/DarkModeContext';
import Review from '../review_mode/review';

const decks_info: Deck[] = [
  {
    id: 0,
    image: "./sample_deck.png",
    name: "awesome deck 1",
  },
  {
    id: 1,
    image: "./sample_deck.png",
    name: "awesome deck 2",
  },
  {
    id: 2,
    image: "./sample_deck.png",
    name: "another dope deck",
  }
]
const ComponentRouter: React.FC = () => {
  const [showHeader, setShowHeader] = useState(true);

  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Layout showHeader={showHeader}>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/draw" element={<Draw allowDisplay={true} />}></Route>
            <Route path="/dictionary" element={<DictionaryView title={'TEST'} />} />
            <Route path="/character" element={<SingleWordView />} />
            <Route path="/character/study" element={< DrawReview setShowHeader={setShowHeader} />} />
            <Route path="/decks" element={<DeckLandingView title="My Decks" />} />
            <Route path="/deck/:id" element={<SingleDeckView title="Deck" />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/review" element={<Review />} />
            <Route path="*" element={<ErrorComponent />}></Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </DarkModeProvider>
  );
};

export default ComponentRouter;