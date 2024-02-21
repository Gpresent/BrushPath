import React, { useRef } from 'react';
import './App.css';
import Draw from './pages/Draw';
import DeckCard from './components/DeckCard';
import WordCard from './components/WordCard';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: "100%",
  },
};
 
function App(this: any) {
  return (
    <div className="App" style={styles.container}>
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
    </div>
  );
}

export default App;
