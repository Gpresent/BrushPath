

function gradeToColor(score: number) {

    console.log("score is: " + score)

    if (0 <= score && score < 40){
        return "#D9544D";
    }else if(40 < score && score < 60){
        return "#F69B46";
    }else if(60 < score && score < 80){
        return "#FFFBB9";
    }else if(80 < score){
        return "#8EF076";
    }else{
        return "#FFFFFF";
    }
}

export default gradeToColor;

