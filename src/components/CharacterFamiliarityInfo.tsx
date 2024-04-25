import { useEffect, useState, useContext } from "react";
import { getCharScoreDataByID } from "../utils/FirebaseQueries";
import { AuthContext } from "../utils/FirebaseContext";
import Character from "../types/Character";
interface FamiliarityProps {
    character:Character | any
}
export const CharacterFamiliarityInfo : React.FC<FamiliarityProps> = ({character}) => {
    const [wordInfo, setWordInfo] = useState<any>({});
    const { user, userData, getUserData } = useContext(AuthContext);
    const getInfo = async (charID:string) => {
        if (user && user.email) {
            const data = await getCharScoreDataByID(user.email, charID);
            return data;
        }
        
        return undefined;
    };
    useEffect(() => {
        let repetition = 0;
        let interval= 0;
        let easeFactor = 1.25;
        getInfo(character.unicode_str).then(item => item? setWordInfo(item) : setWordInfo({repetition, interval, easeFactor}));
    }, []);

    return (
        <>
        <p>You are <b>{wordInfo.repetition > 5? "familiar" : "unfamiliar"}</b> with this character</p>
        </>
    );

}