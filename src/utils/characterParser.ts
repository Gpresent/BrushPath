import { darkScrollbar } from "@mui/material";
import Character from "../types/Character";


function characterParser(data: any) {

    let character: Character = {
        id: "ERR",
        unicode: "ERR",
        unicode_str: "ERR",
        on: ["ERR"],
        kun: ["ERR"],
        nanori: ["ERR"],
        radicals: [],
        english: ["ERR"],
        one_word_meaning: "ERR",
        stroke_count: 0,
        freq: null,
        grade: null,
        jlpt: null,
        compounds: undefined,
        parts: [],
        coords: null,
        totalLengths: 0,
        svg: undefined
    }

    if (data == null) {
        return null
    }

    // if (data.id) {
    //     data = data.data
    // }

    character = {
        id: data.unicode_str,
        unicode: data.literal || data.unicode,
        unicode_str: data.unicode_str,
        on: data.on,
        kun: data.kun,
        nanori: data.nanori,
        radicals: [],
        english: data.meanings || data.english,
        one_word_meaning: data.one_word_meaning,
        stroke_count: data.stroke_count,
        freq: data.freq,
        grade: data.grade,
        jlpt: data.jlpt,
        compounds: data.compounds,
        parts: data.parts,
        coords: [],
        totalLengths: data.totalLengths,
        svg: data.svg
    }

    if (character.one_word_meaning == "") {
        if (character.english) {
            character.one_word_meaning = character.english[0]
        }
    }

    // console.log(data)

    // console.log(data.radicals)

    data.radicals.forEach((element: any) => {
        character.radicals.push(element.value);
    });

    // console.log() 
    // console.log(data.coords)

    // console.log([...(data.coords).values()])

    // data.coords.forEach((element : any) => {
    //     character.coords.push(element.value)
    // })

    return character;
}

export default characterParser;