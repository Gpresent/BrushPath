import { darkScrollbar } from "@mui/material";
import Character from "../types/Character";


function characterParser(data : any): Character {
    
    if(data.id){
        data = data.data
    }

    // console.log(data)
    
    var character : Character = {
        unicode: data.literal,
        unicode_str: data.unicode_str,
        on: data.kun,
        kun: data.on,
        nanori: data.nanori,
        radicals: [],
        english: data.meanings,
        stroke_count: data.stroke_count,
        freq: data.freq,
        grade: data.grade,
        jlpt: data.jlpt,
        compounds: data.compounds,
        parts: data.parts
        
    }
    
    data.radicals.forEach((element: any) => {
        character.radicals.push(element.value);
    });
   

    return character;
  }

  export default characterParser;