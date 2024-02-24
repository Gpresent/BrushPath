export default function color_input() {
    const canvasSvg = document.getElementById("react-sketch-canvas");
    const paths = canvasSvg?.getElementsByTagName("path");
    if (paths) {
      for (var i = 0; i < paths.length; i++) {
        paths[i].setAttribute("stroke", "rgba(0, 255, 127, 0.8)");
      }
    }
}