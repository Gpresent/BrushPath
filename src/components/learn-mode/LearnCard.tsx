import react, { useEffect, useMemo, useRef, useState } from 'react';
import Character from '../../types/Character';
import Draw from '../../pages/Draw';
import '../../styles/learn.css'
import KanjiGrade from '../../types/KanjiGrade';
import { debug } from 'console';

interface LearnCardProps {
    character: Character;
    handleAdvance: (arg0: Character, arg1:KanjiGrade )=> void
}

const LearnCard: React.FC<LearnCardProps>  = ({character, handleAdvance}) => {

    const [grade, setGrade] = useState<KanjiGrade| null>(null);
    const [allowDisplay, setAllowDisplay] = useState<boolean>(false);
    const [numAttempts, setNumAttempts] = useState<number>(0);


    const handleComplete = (character: Character, grade: KanjiGrade) => {
        // console.log(JSON.stringify(grade));
        if(!allowDisplay) {
            const gradeIsNull = (grade !== null && grade.overallGrade ===null || isNaN(grade.overallGrade) )
            const gradeIsNotHighEnough = (grade !== null && grade.grades.length > 0 && Math.max(...grade.grades) < 60)
            // debugger;
            setAllowDisplay(gradeIsNotHighEnough || gradeIsNull);
        }
        // console.log("complete")
                    setGrade(grade);
    }

    


    //Todo, replace divs with actual tags lol
    return (
        <div className='learn-cards-container'>
        <div className="learn-card">
            <div className="learn-card-title">
                {character.one_word_meaning}
            </div>
            <div className="learn-card-info">
                
            </div>
            <div className="learn-card-draw-container" >
                <Draw  handleComplete={handleComplete} key={character.unicode}  allowDisplay={ allowDisplay } character={character}  />
            </div>  
            
            <div className="learn-card-nav-row">
                <div></div>
            { grade && grade.overallGrade > 50 && 

            <button onClick={() => {
                setAllowDisplay(false)
                handleAdvance(character, grade);
                setGrade(null)}} className="learn-card-nav-right">
                {'>'}
            </button>
            }
            
            </div>
        </div>
        </div>
    )
}



export default LearnCard;