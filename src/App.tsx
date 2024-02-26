// import React, { useRef } from 'react';
import './App.css';
import Draw from './pages/Draw';
import DeckCard from './components/DeckCard';
import WordCard from './components/WordCard';
import Layout from './Layout';
import DictionaryView from './pages/Dictionary';
import Home from './pages/Home';

 
function App(this: any) {
  return (
    <Layout>
      <Draw />
      <DictionaryView title={"My Words"} />
    </Layout>
  );
}

export default App;
