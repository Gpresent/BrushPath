import react, { useEffect, useMemo, useRef, useState } from 'react';
import Character from '../../types/Character';
import Draw from '../../pages/Draw';
import '../../styles/learn.css'
import LearnCard from './LearnCard';
import KanjiGrade from '../../types/KanjiGrade';
import { grad } from '@tensorflow/tfjs';
import { CharacterSearchProvider } from '../../utils/FirebaseCharacterSearchContext';

interface LearnCardListProps {
    characters: Character[];
    
}
type CharacterSessionData =Character & {
    
    score?: KanjiGrade;
}


const LearnCardList: React.FC<LearnCardListProps>  = ({characters}) => {

    const [currentCharacterIndex, setCurrentCharacterIndex] = useState<number>(0);

    const [characterSessionData, setCharacterSessionData] = useState<CharacterSessionData[]>(characters);

    const canvasRef = useRef<any>();

    const setRef = (ref: any) => {
        canvasRef.current = ref;
    }

    const handleAdvance =(char: Character, grade: KanjiGrade) => {
        console.log("Completed: ", char);
        setCharacterSessionData((prevData:CharacterSessionData[]) =>
            prevData.map(character => {
                if(character.unicode === char.unicode) {
                    console.log(grade)
                    return {...character, score:grade}
                }
                
                return character;
            })
        );
        setCurrentCharacterIndex((prevIndex) => {
            return prevIndex + 1;
        })
    }
    const currentCharacter = useMemo(() => {
        return characterSessionData[currentCharacterIndex]
    },[currentCharacterIndex])
    useEffect(() => {
        //Build components
        

    },[]);

    //Todo, replace divs with actual tags lol
    return (
        <div className='learn-cards-container'>
            <p>
                Kanji Learned {characterSessionData.filter((character) => {return character.score !== undefined;}).length}
                
            </p>
            <LearnCard character={currentCharacter} handleAdvance={handleAdvance} />
        </div>
    )
}



export default LearnCardList;