

export default function gradeToColor(score: number) {

    // console.log("score is: " + score)

    if (0 <= score && score < 45){
        return "#D9544D";
    }else if(45 < score && score < 65){
        return "#F69B46";
    }else if(65 < score && score < 85){
        return "#FFFBB9";
    }else if(85 < score){
        return "#8EF076";
    }else{
        return "rgba(0,0,0,0)";
    }
}


export function gradeToWord(score: number) {

    // console.log("score is: " + score)

    if (0 <= score && score < 45){
        return "Try Again";
    }else if(45 < score && score < 65){
        return "Needs Work";
    }else if(65 < score && score < 85){
        return "Fair";
    }else if(85 < score && score < 100){
        return "Good";
    }else if (score === 100){
        return "Perfect";
    } else {
        return "";
    }
}

// export default {gradeToColor, gradeToWord};

