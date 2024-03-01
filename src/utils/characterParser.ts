import Character from "../types/Character";


function characterParser(data : any): Character {
    
    console.log(data)

    var character : Character = {
        unicode: data.literal,
        on: [],
        kun: [],
        nanori: data.nanori,
        radicals: [],
        english: data.meanings,
        stroke_count: data.stroke_count,
        freq: data.freq,
        grade: data.grade,
        jlpt: data.jlpt,
        compounds: data.compounds,
    }
    data.readings.forEach((element: any) => {
        // TODO: add error handling in case type is undefined
        if(element.type == "ja_kun"){
            character.kun.push(element.value);
        }else if(element.type == "ja_on"){
            character.on.push(element.value);
        }
    });
    data.radicals.forEach((element: any) => {
        character.radicals.push(element.value);
    });
   

    return character;
  }

  export default characterParser;