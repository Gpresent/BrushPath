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
      <Home message={'Welcome back'} user={'Charlotte'}></Home>
      <Draw />
      <DeckCard deck={{
        id: 0,
        coverImage: 'https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/dywxv8qwvzp-497%3A24178?alt=media&token=84fb6b9c-9a3a-4b4d-ab33-bbdbe677272b',
        name: 'hi'
      }} />
      <WordCard character={{
        id: 0,
        unicode: '一',
        hiragana: 'いち',
        english: 'one'
      }}/>
    </Layout>
  );
}

export default App;
