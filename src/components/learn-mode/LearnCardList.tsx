import react, { useEffect, useMemo, useRef, useState } from 'react';
import Character from '../../types/Character';
import Draw from '../../pages/Draw';
import '../../styles/learn.css'

interface LearnCardListProps {
    characters: Character[];
    
}
type CharacterSessionData = {
    score?: number;

}

const LearnCardList: React.FC<LearnCardListProps>  = ({characters}) => {

    const [currentCharacterIndex, setCurrentCharacterIndex] = useState<number>(0);

    const [characterSessionData, setCharacterSessionData] = useState<(Character & CharacterSessionData)[]>(characters);

    const canvasRef = useRef<any>();

    const currentCharacter = useMemo(() => {
        return characterSessionData[currentCharacterIndex]
    },[currentCharacterIndex])
    useEffect(() => {

    },[]);

    //Todo, replace divs with actual tags lol
    return (
        <div className='learn-cards-container'>
        <div className="learn-card">
            <div className="learn-card-title">
                {currentCharacter.one_word_meaning}
            </div>
            <div className="learn-card-info">
                
            </div>
            <div className="learn-card-draw-container" >
                {/* <Draw allowDisplay={false} forwardRef={canvasRef} character={currentCharacter}  /> */}
            </div>  
            
            <div className="learn-card-nav-row">
            <button onClick={() => {
                //Check if at 0
                if(currentCharacterIndex > 0) {
                    setCurrentCharacterIndex((prevIndex) => prevIndex - 1);
                }
            }} className="learn-card-nav-left">
                {'<'}
            </button>
            <button onClick={() => {
                if(currentCharacterIndex < characterSessionData.length-1) {
                    setCurrentCharacterIndex((prevIndex) => prevIndex + 1);
                }
            }}className="learn-card-nav-right">
                {'>'}
            </button>
            
            </div>
        </div>
        </div>
    )
}



export default LearnCardList;