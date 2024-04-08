import react, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCharacterScoreData, getCharsFromRefs, getDeckFromID, getHydratedCharacterScoreData } from "../utils/FirebaseQueries";
import { DocumentData, DocumentReference } from "firebase/firestore";
import { AuthContext } from "../utils/FirebaseContext";
import LoadingSpinner from "../components/LoadingSpinner";


interface LearnProps  {
    
};
type RetrievableData = {
    data: DocumentData | null;
    loading: boolean;
    error: string;
  };



const LearnDeck: React.FC<LearnProps> = ({  }) => {

    const [characterRefs, setCharacterRefs] = useState<RetrievableData>({
        data: null,
        loading: true,
        error: "",
      });
      const [characters, setCharacters] = useState<RetrievableData>({
        data: null,
        loading: true,
        error: "",
      });

    let { id } = useParams();

    const { user, userData, getUserData } = useContext(AuthContext);

  useEffect(() => {
    
    if(!id) {
        setCharacterRefs({ data: null, loading: false, error: "No url parameter" });
        return;
    }
    if(!user?.email) {
        setCharacterRefs({ data: null, loading: false, error: "No email" });
        return;
    }
    const promises = Promise.all([getDeckFromID(id), getCharacterScoreData(user?.email)]);
    promises.then(([deck ,score]) => {
        let deckData = deck as {_id:string} &DocumentData
        let scoreData = score as DocumentData[] | null
        console.log(deckData)
        console.log(scoreData)
        if(!deckData || !deckData?.characters) {
            setCharacterRefs({ data: null, loading: false, error: "Deck data not found" });
            return;
        }
        if(scoreData === null || scoreData === undefined) {
            setCharacterRefs({ data: null, loading: false, error: "Error getting character score" });
            return;
        }
        //Filter out learned characters
        let potentialCharacters: DocumentReference[] = [];
        deckData.characters.forEach((character: DocumentReference) => {
            if(!scoreData?.some(char => char.characterRef === character.id)) {
                potentialCharacters.push(character)
            }
        });

        setCharacterRefs({ data: potentialCharacters.slice(0,30), loading: false, error: "" });
        
        getCharsFromRefs(potentialCharacters, 0).then((chars) => {
            if(!chars) {
                setCharacters({ data: null, loading: false, error: "Error fetching character data" });
                return;
            }
            setCharacters({ data: chars, loading: false, error: "" });
            
        })
        
    })
    
    
    
  }, []);
    

    return (<div>
        {characters.loading? <LoadingSpinner /> :
        characters.error || characters.data == null? <p>{characters.error}</p>:
            characters.data.map((char: any) => {
                return (<p key={char.unicode}>
                    {JSON.stringify(char)}
                </p>)
            })
        }) 
        
    </div>)
}


export default LearnDeck;


