import React, { useContext, useEffect } from 'react';
import Draw from '../pages/Draw';
import {reviewItem} from "./features/spacedrep";
import { ReviewFlashCard } from './components/rv_flashcard';
import { useState } from 'react';
import Character from '../types/Character';
import PlayList from './components/rv_word_list';
import { review_data } from './testdata';
import { getCharacterScoreDataByUser, getCharsFromRefs, getCharacterScoreData, getHydratedCharacterScoreData } from '../utils/FirebaseQueries';
import { AuthContext } from '../utils/FirebaseContext';
import { DocumentReference } from 'firebase/firestore';
import DrawReview from '../pages/DrawReview';

// const jlptN5Kanji: any = [
//     { id: 1, unicode: "一", hiragana: "いち", one_word_meaning: "one" },
//     { id: 2, unicode: "二", hiragana: "に", one_word_meaning: "two" },
//     { id: 3, unicode: "三", hiragana: "さん", one_word_meaning: "three" },
//     { id: 4, unicode: "四", hiragana: "し/よん", one_word_meaning: "four" },
//     { id: 5, unicode: "五", hiragana: "ご", one_word_meaning: "five" },
//     { id: 6, unicode: "六", hiragana: "ろく", one_word_meaning: "six" },
//     { id: 7, unicode: "七", hiragana: "しち/なな", one_word_meaning: "seven" },
//     { id: 8, unicode: "八", hiragana: "はち", one_word_meaning: "eight" },
//     { id: 9, unicode: "九", hiragana: "きゅう/く", one_word_meaning: "nine" },
//     { id: 10, unicode: "十", hiragana: "じゅう", one_word_meaning: "ten" },
//     { id: 11, unicode: "百", hiragana: "ひゃく", one_word_meaning: "hundred" },
//     { id: 12, unicode: "千", hiragana: "せん", one_word_meaning: "thousand" },
//     { id: 13, unicode: "円", hiragana: "えん", one_word_meaning: "yen" },
//     { id: 14, unicode: "日", hiragana: "にち/ひ", one_word_meaning: "day/sun" },
//     { id: 15, unicode: "月", hiragana: "げつ/がつ", one_word_meaning: "month/moon" },
//     { id: 16, unicode: "火", hiragana: "か", one_word_meaning: "fire" },
//     { id: 17, unicode: "水", hiragana: "すい", one_word_meaning: "water" },
//     { id: 18, unicode: "木", hiragana: "もく", one_word_meaning: "tree" },
//     { id: 19, unicode: "金", hiragana: "きん/こん", one_word_meaning: "gold/metal" },
//     { id: 20, unicode: "土", hiragana: "ど/と", one_word_meaning: "earth" },
//   ];

const convertTimeStampData = (time: {seconds:number, nanoseconds:number}) => {
    return new Date(time.seconds * 1000 + Math.round(time.nanoseconds/1e6));
}
const Review: React.FC = () => {
    // query all words attempted
    // query all words not attempted
    // update word info

    // const getCharScores = async () => {
    //     const chars = await getCharacterScoreData("naimurrah01@tamu.edu");
    //     // console.log(chars)
    //     return chars
    // }
    
    // const getChars = async () => {
    //     // create char_refs
    //     let char_scores = await getCharScores();
    //     let char_refs: DocumentReference[] = [];
    //     // console.log("chars");
    //     // console.log(char_scores)
    //     char_scores?.forEach((item:any)=>{char_refs.push(item.characterRef)})
    //     let chars = await getCharsFromRefs(char_refs, 0);
    //     console.log("getchars")
    //     console.log(chars)
    // }
    // getChars();
    // getCharsWithProps();
    
    // functions
    const getHydratedChars = async () => {
        const chars = await getHydratedCharacterScoreData("naimurrah01@tamu.edu");
        return chars;
        // Object.keys(chars).forEach(item => console.log(convertTimeStampData(chars[item].nextReviewDate)));
        // chars.forEach((element:any) => {
        //     console.log(element.nextReviewDate)
        // });
    }
    
    
    
    // states
    const [words, setWords] = useState<any>([]);
    const [wIndex, setWIndex] = useState<number>(0);
    // const [showHeader, setShowHeader] = useState(true);
    const [showHeader, setShowHeader] = useState(true);

    const get_queue = async () => {
        let queue = await getHydratedChars();
        console.log(queue);
        let wordList: any[] = [];
        Object.keys(queue).map(item => wordList.push(queue[item]));
        console.log(wordList);
        setWords(wordList);
        setWIndex(0);
        return wordList;
    }

    useEffect(()=>{
        get_queue();
        // setCurrWordObj(words[wordKeys[0]]);
    },[]);

    // useEffect(()=> {
    //     setCurrWordObj(words[wordKeys[wordIndex]]);
    //     console.log(currWordObj)
    // }, [wordIndex])
    return (
        <>
            {/* <PlayList words={words}/> */}
            <div>
                <p>Controls</p>
                <button disabled={wIndex === 0} onClick={()=>{setWIndex(wIndex - 1 >= 0 ? wIndex - 1 : 0)}}>Previous</button>
                <button 
                    onClick={()=>{setWIndex(wIndex + 1 < words.length ? wIndex + 1: words.length-1);
                }}
                    disabled={wIndex === words.length-1}
                >Continue</button>
            </div>
            <div>
                <p>
                    Word Index={wIndex}
                </p>
                <p>
                    Word={words.length > 0 && words[wIndex].literal}
                </p>
                <p>Word={words.length > 0 && words[wIndex].unicode_str}</p>
                
            </div>
            {
                words.length > 0 && 
                <DrawReview setShowHeader={setShowHeader} char={words[wIndex]} />
                

            }
            <ReviewFlashCard/>
        </>
        
    );
}

export default Review;

