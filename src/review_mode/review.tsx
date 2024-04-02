import React, { useEffect } from 'react';
import {ReviewItem, SpacedRepetitionSystem} from "./features/spacedrep";
import { useState } from 'react';
import DrawRLink from './features/drawrmlink';
import Character from '../types/Character';
import WordList from '../components/WordList';
const jlptN5Kanji: any = [
    { id: 1, unicode: "一", hiragana: "いち", one_word_meaning: "one" },
    { id: 2, unicode: "二", hiragana: "に", one_word_meaning: "two" },
    { id: 3, unicode: "三", hiragana: "さん", one_word_meaning: "three" },
    { id: 4, unicode: "四", hiragana: "し/よん", one_word_meaning: "four" },
    { id: 5, unicode: "五", hiragana: "ご", one_word_meaning: "five" },
    { id: 6, unicode: "六", hiragana: "ろく", one_word_meaning: "six" },
    { id: 7, unicode: "七", hiragana: "しち/なな", one_word_meaning: "seven" },
    { id: 8, unicode: "八", hiragana: "はち", one_word_meaning: "eight" },
    { id: 9, unicode: "九", hiragana: "きゅう/く", one_word_meaning: "nine" },
    { id: 10, unicode: "十", hiragana: "じゅう", one_word_meaning: "ten" },
    { id: 11, unicode: "百", hiragana: "ひゃく", one_word_meaning: "hundred" },
    { id: 12, unicode: "千", hiragana: "せん", one_word_meaning: "thousand" },
    { id: 13, unicode: "円", hiragana: "えん", one_word_meaning: "yen" },
    { id: 14, unicode: "日", hiragana: "にち/ひ", one_word_meaning: "day/sun" },
    { id: 15, unicode: "月", hiragana: "げつ/がつ", one_word_meaning: "month/moon" },
    { id: 16, unicode: "火", hiragana: "か", one_word_meaning: "fire" },
    { id: 17, unicode: "水", hiragana: "すい", one_word_meaning: "water" },
    { id: 18, unicode: "木", hiragana: "もく", one_word_meaning: "tree" },
    { id: 19, unicode: "金", hiragana: "きん/こん", one_word_meaning: "gold/metal" },
    { id: 20, unicode: "土", hiragana: "ど/と", one_word_meaning: "earth" },
  ];
const Review: React.FC = () => {
    // query all words attempted
    // query all words not attempted
    // update word info
    
    const get_queue = (): Character[] => {
        let queue:Character[] = [];
        queue = jlptN5Kanji;
        return queue;
    }
    const [words, setWords] = useState<Character[]>(get_queue());

    // const [showHeader, setShowHeader] = useState(true);
    return (
        <>
            <WordList words={words}/>
        </>
        
    );
}

export default Review;

