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
    lastRef: "" as string,
    setPause: (pause: boolean) => { },
});


export const CharacterProvider = (({ children }: { children: ReactNode }) => {


    const [kanjiList, setKanjiList] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [lastRef, setLastRef] = useState("");
    const [paused, setPause] = useState(false)


    const fetchCharacters = useCallback(async () => {
        // console.log("Paused Status:", paused);
        if (paused) {
            // console.log("Fetching is paused.");  // Additional log for clarity
            return;
        }
        setLoading(true);
        let batch = 250;
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
    }, [lastRef, paused]);

    // useEffect(() => {

    //     fetchCharacters();


    // }, [fetchCharacters]);


    return (
        <CharacterContext.Provider value={{ kanjiList, loading, fetchCharacters, lastRef, setPause }}>
            {children}
        </CharacterContext.Provider>
    );
});

export const useCharacters = () => useContext(CharacterContext);