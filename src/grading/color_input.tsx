export default function color_input(grades: number[]) {
    const canvasSvg = document.getElementById("react-sketch-canvas");
    const paths = canvasSvg?.getElementsByTagName("path");
    if (paths) {
      for (var i = 0; i < paths.length; i++) {
        var color;
        if (grades[i] > 0.5) {
          const yellow = grades[i] - 0.5;
          color = "rgba(" + Math.floor(255 * (1 - yellow / 0.5)) + ", 255, 0, 0.8)";
        } else {
          const yellow = grades[i];
          color = "rgba(255, " + Math.floor(255 * (yellow / 0.5)) + ", 0, 0.8)";
        }
        paths[i].setAttribute("stroke", color);
      }
    }
}