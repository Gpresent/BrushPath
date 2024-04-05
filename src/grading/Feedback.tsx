import React from 'react';
import KanjiGrade from "../types/KanjiGrade";
import "../styles/feedback.css";
import { useEffect } from 'react';
import gradeToColor from '../utils/gradeToColor';

interface feedbackProps {
    kanjiGrade: KanjiGrade;
    passing: number;
    color: string;
}

function pageCreator(feedback: string, index: number) {
    const sentences = feedback.split("\n");
    
    return (
        <div className="feedback" key={index}>
            <div className="feedback-box-strokes">
                <h4>{sentences[0].slice(0, sentences[0].indexOf(":"))}</h4>
                {sentences.map((sentence, sentenceIndex) => {
                    if (sentence.trim() === "") return null;
                    if (sentenceIndex === 0) {
                        return;
                    }
                    return (
                        <p key={sentenceIndex * index}>&#x2022; {sentence}</p>
                    );
                })}
            </div>
        </div>
    );
}

const Feedback: React.FC<feedbackProps> = (props) => {
    const kanji_grade = props.kanjiGrade;
    const color = props.color;
    const passing = props.passing;
    const canvasElement = document.getElementById("react-sketch-canvas");




    useEffect(() => {

        console.log("color is: " + color)
        document.querySelectorAll('.feedback-container').forEach((container) => {
            let isScrolling: ReturnType<typeof setTimeout>;
        
            container.addEventListener('scroll', () => {
                clearTimeout(isScrolling);
                isScrolling = setTimeout(() => {
                    const scrollLeft = container.scrollLeft;
                    const children = Array.from(container.children) as HTMLElement[];
                    const index = children.findIndex((child) => child.offsetLeft > scrollLeft);
        
                    if (index !== -1) {
                        const nextBoxLeft = children[index].offsetLeft;
                        const prevBoxLeft = index > 0 ? children[index - 1].offsetLeft : 0;
        
                        const targetLeft = scrollLeft - prevBoxLeft < nextBoxLeft - scrollLeft ? prevBoxLeft : nextBoxLeft;
                        container.scrollTo({
                            left: targetLeft,
                            behavior: 'smooth'
                        });
                    }
                }, 50); // Adjust debounce delay as needed (in milliseconds)
            });
        });
    }, []);

    return (
        <>
        <div className="feedback-container">
            <div className="feedback-header">
            {(kanji_grade.overallGrade != -1)  && ( 
                <div className="feedback-box" >

                
                    <div className="grade-circle" style={{backgroundColor:color}}> {Math.round(kanji_grade.overallGrade)} </div>
               
                    {kanji_grade.overallFeedback !== "" && <p style={{ paddingBottom: "1rem" }}>{kanji_grade.overallFeedback}</p>}
                </div>
                 )}
            </div>
            {kanji_grade.grades.map((grade, index) => {
                if (grade >= passing || grade === -1 || kanji_grade.feedback.length <= index) return null;
                const path = canvasElement?.getElementsByTagName("path")[index];
                if (!path) return null;

                return pageCreator(kanji_grade.feedback[index], index);
            })}

        </div>
        </>
    );
}

export default Feedback;