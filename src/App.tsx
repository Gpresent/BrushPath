// import React, { useRef } from 'react';
import './App.css';
import Draw from './pages/Draw';
import DeckCard from './components/DeckCard';
import WordCard from './components/WordCard';
import Layout from './Layout';
import DictionaryView from './pages/Dictionary';
import Home from './pages/Home';
import DeckLanding from './pages/DeckLanding'
import SingleDeckView from './pages/SingleDeck';

 
function App(this: any) {
  return (
    <Layout>
      <SingleDeckView title={"Test Deck 1"} />
    </Layout>
  );
}

export default App;
