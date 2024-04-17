import React, { ReactNode, createContext, useContext, useState, useCallback, useEffect } from 'react';
import { db } from './Firebase';
import { doc, getDocs, collection, DocumentReference } from 'firebase/firestore';
import { getDeckFromID, getDecksFromRefs } from "../utils/FirebaseQueries";
import { AuthContext } from './FirebaseContext';
import Deck from '../types/Deck';
import { User } from 'firebase/auth';

interface DecksContextType {
    decks: Deck[];
    fetchDecks: () => void;

}
export const DecksContext = createContext<DecksContextType>({
    decks: [],
    fetchDecks: () => { }
});

export const useDecks = () => useContext(DecksContext);

export const DecksProvider = ({ children }: { children: ReactNode }) => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const { user, userData, getUserData } = useContext(AuthContext);

    const fetchDecks = async () => {

        if (!userData?.decks) {
            debugger;
            setDecks([]);
            return;
        }
        try {
            // getUserData(user as User);
            debugger;
            console.log("old length ", decks.length)
            const decksResult = await getDecksFromRefs(userData.decks);
            setDecks(decksResult as Deck[]);

        } catch (error) {
            console.error("Error fetching decks:", error);
            setDecks([]); // Optionally reset decks on error to avoid stale data
        }
    };

    // const addDeckById = (newDeck: string) => {

    //     let current = getDeckFromID(newDeck)
    //     setDecks[current, ...decks]
    // };

    useEffect(() => {
        if (userData?.decks) {
            fetchDecks();
        }

    }, [userData?.decks]);


    return (
        <DecksContext.Provider value={{ decks, fetchDecks }}>
            {children}
        </DecksContext.Provider>
    );
};
