

export default function gradeToColor(score: number) {

    // console.log("score is: " + score)

    if (0 <= score && score < 40){
        return "#D9544D";
    }else if(40 < score && score < 60){
        return "#F69B46";
    }else if(60 < score && score < 80){
        return "#FFFBB9";
    }else if(80 < score){
        return "#8EF076";
    }else{
        return "rgba(0,0,0,0)";
    }
}


export function gradeToWord(score: number) {

    // console.log("score is: " + score)

    if (0 <= score && score < 40){
        return "Try Again";
    }else if(40 < score && score < 60){
        return "Needs Work";
    }else if(60 < score && score < 80){
        return "Fair";
    }else if(80 < score){
        return "Good";
    }else{
        return "";
    }
}

// export default {gradeToColor, gradeToWord};

