import React, { useContext, useEffect } from 'react';
import Draw from '../../pages/Draw';
import { reviewItem } from "../../utils/spacedrep";
import { ReviewFlashCard } from './components/rv_flashcard';
import { useState } from 'react';
import Character from '../../types/Character';
import PlayList from './components/rv_word_list';
import { review_data } from './testdata';
import { getCharacterScoreDataByUser, getCharsFromRefs, getCharacterScoreData, getHydratedCharacterScoreData } from '../../utils/FirebaseQueries';
import { AuthContext } from '../../utils/FirebaseContext';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import characterParser from '../../utils/characterParser';
import LearnCardList from '../learn-mode/LearnCardList';
import LoadingSpinner from '../LoadingSpinner';


type RetrievableData = {
    data: Character[] | null;
    loading: boolean;
    error: string;
};

const convertTimeStampData = (time: { seconds: number, nanoseconds: number }) => {
    return new Date(time.seconds * 1000 + Math.round(time.nanoseconds / 1e6));
}
const Review: React.FC = () => {
    // query all words attempted
    // query all words not attempted
    // update word info

    const { userData, user } = useContext(AuthContext);

    // states
    const [words, setWords] = useState<RetrievableData>({ data: null, loading: true, error: "" });
    const [wIndex, setWIndex] = useState<number>(0);




    useEffect(() => {

        if (userData) {
            if (!userData?.email) {
                setWords({ data: null, loading: false, error: "No email" });
                return;
            }
            getHydratedCharacterScoreData(userData?.email).then((characters: DocumentData[]) => {
                if (!characters) {
                    setWords({ data: null, loading: false, error: "Error fetching characters" });
                    return;
                }
                const filteredChars: Character[] = characters.map((word) => {
                    return characterParser(word);
                }).filter((elem): elem is Character => elem !== null);
                setWords({ data: filteredChars, loading: false, error: "" });
                setWIndex(0);
            })

        }

    }, [userData]);

    return (
        <>
            {
                words.loading ? <LoadingSpinner /> :
                    words.error || words.data === null ? <p>words.error</p> :
                        <LearnCardList recall={true} learn={true} characters={words.data} />
            }


        </>


    );
}

export default Review;

