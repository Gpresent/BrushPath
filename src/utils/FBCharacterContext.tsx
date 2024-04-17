import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchAllCharacters } from "../utils/FirebaseQueries";
import { DocumentData } from 'firebase/firestore';
import characterParser from './characterParser';
import Character from '../types/Character';
import Loading from '../components/Loading';

const CharacterContext = createContext({
    kanjiList: [] as Character[],
    loading: true,
    fetchCharacters: async () => { },
    lastRef: "" as string
});


export const CharacterProvider = (({ children }: { children: ReactNode }) => {


    const [kanjiList, setKanjiList] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [lastRef, setLastRef] = useState("");


    const fetchCharacters = useCallback(async () => {
        setLoading(true);
        let batch = 30;
        // console.log(kanjiList.length)
        await fetchAllCharacters(lastRef, batch).then((fetchResponse) => {
            if (fetchResponse.cachedData) {
                // console.log("got data")
                let newData = fetchResponse.cachedData
                    .filter((result) => result !== undefined && result !== null)
                    .map((value: DocumentData) => characterParser(value))
                    .filter(
                        (result) =>
                            result !== null &&
                            result !== undefined &&
                            !kanjiList.includes(result)
                    );
                console.log("data is processed")
                // console.log(kanjiList)
                setKanjiList(kanjiList.concat(newData as any));
            } else {
                console.log("deck.data or something not found, not fetching");
            }
            setLastRef(fetchResponse.skipRef);

        });
    }, [lastRef]);

    // useEffect(() => {

    //     fetchCharacters();


    // }, [fetchCharacters]);


    return (
        <CharacterContext.Provider value={{ kanjiList, loading, fetchCharacters, lastRef }}>
            {children}
        </CharacterContext.Provider>
    );
});

export const useCharacters = () => useContext(CharacterContext);