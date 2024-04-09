import react, { useEffect, useMemo, useRef, useState } from 'react';
import Character from '../../types/Character';
import Draw from '../../pages/Draw';
import '../../styles/learn.css'
import LearnCard from './LearnCard';
import KanjiGrade from '../../types/KanjiGrade';
import { grad } from '@tensorflow/tfjs';
// import { CharacterSearchProvider } from '../../utils/FirebaseCharacterSearchContext';
import { useNavigate, useParams } from 'react-router-dom';

interface LearnCardListProps {
    characters: Character[];
    refetch?: (numCharacters?: number) => void;
    
}
type CharacterSessionData =Character & {
    
    score?: KanjiGrade;
}


const LearnCardList: React.FC<LearnCardListProps>  = ({characters, refetch}) => {

    const [currentCharacterIndex, setCurrentCharacterIndex] = useState<number>(0);

    const [characterSessionData, setCharacterSessionData] = useState<CharacterSessionData[]>(characters);

    const [finished, setFinished] = useState<boolean>(false);

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
        if(currentCharacterIndex === characterSessionData.length -1) {
            setFinished(true);
            return;
        }
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

    const numKanjiLearned = useMemo(() => {
        return characterSessionData.filter((character) => {return character.score !== undefined;}).length;
    }, [characterSessionData])
    const avgScore = useMemo(() => {
        const scoredChars = characterSessionData.filter((character) => {return character.score !== undefined;});
        return scoredChars.reduce((accumulator,char) => {
            // console.log(char.score?.grades ? Math.max(...char.score?.grades || 0):0);
            // console.log(char.unicode);
            return char.score?.grades ? Math.max(...char.score?.grades || 0) + accumulator: accumulator
        },0)/scoredChars.length;
    }, [characterSessionData])

    const navigate = useNavigate();
    let { id } = useParams();

    //Todo, replace divs with actual tags lol
    return (
        <div >
            {/* <p>
                Kanji Learned {numKanjiLearned}
                Kanji Left {characterSessionData.length - numKanjiLearned}
                
            </p> */}
            {finished ? 
            <div>
            <p>Finished, here are your stats...</p>
            <p>Average Score: {avgScore}</p>
            <button onClick={() => {navigate(`/deck/${id}`)}}>
                Go back to deck
            </button>
            <button onClick={() => {}}>
                Keep learning this deck
            </button>
            </div>
            :
            <LearnCard character={currentCharacter} handleAdvance={handleAdvance} />
            }
            
        </div>
    )
}



export default LearnCardList;