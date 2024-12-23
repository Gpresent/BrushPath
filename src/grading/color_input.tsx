export default function color_input(grades: number[], passing: number = 0.6) {
    const canvasSvg = document.getElementById("react-sketch-canvas");
    const paths = canvasSvg?.getElementsByTagName("path");
    if (paths) {
      if (!grades.length) {
        for (var i = 0; i < paths.length; i++) {
          paths[i].setAttribute("stroke", "rgba(255, 0, 0, 0.8)");
        }
        return;
      }
      for (var i = 0; i < paths.length; i++) {
        var color;
        if (grades[i] === -2) color = "rgba(79, 57, 170, 0.7)";
        else if (grades[i] > passing) {
          const yellow = grades[i] - passing;
          color = "rgba(" + Math.floor(255 * (1 - yellow / (1 - passing))) + ", 255, 0, 0.7)";
        } else {
          var yellow = grades[i];
          if (yellow < 0) yellow = 0;
          color = "rgba(255, " + Math.floor(255 * (yellow / passing)) + ", 0, 0.7)";
        }
        // console.log("Stroke ", i + 1, " color:", color);
        paths[i].setAttribute("stroke", color);
      }
    }
}