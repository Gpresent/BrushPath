import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DictionaryView from '../pages/Dictionary';
import Home from '../pages/Home';
import Draw from '../pages/Draw';
import Layout from '../Layout'
import DeckList from '../components/DeckList';
import Deck from '../types/Deck';

const decks_info:Deck[] = [
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
const ComponentRouter: React.FC = () => {
    return (
        
            <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/home/:user" element={<Home message={'Welcome Back'} user={"Bart"}/>}></Route>
                    <Route path="/draw" element={<Draw/>}></Route>
                    <Route path="/dictionary" element={<DictionaryView title={'TEST'}/>} />
                    <Route path="/decks" element={<DeckList decks={decks_info}/>}/>
                </Routes>
            </Layout>
            </BrowserRouter>
    );
};

export default ComponentRouter;