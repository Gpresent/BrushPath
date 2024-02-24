import pathsToCoords from "../coord-utils/pathsToCoords";
import getTotalLengthAllPaths from "../coord-utils/getTotalLengthAllPaths";

const parser = new DOMParser();

export default function interpolate(inputSvg: string): { coords: number[][][], totalLengths: number } {
    var doc = parser.parseFromString(inputSvg, "image/svg+xml");
    const svg = doc.getElementsByTagName("svg")[0];
    const scale = 500 / svg.viewBox.baseVal.width;
  
    var paths = svg.getElementsByTagName("path");
    var coords: number[][][] = [];
    for (var i = 0; i < paths.length; i++) {
      coords[i] = pathsToCoords(
        [paths[i]],
        scale,
        paths[i].getTotalLength() * scale / 10,
        0,
        0
      );
    }
    var totalLengths = getTotalLengthAllPaths(paths) * scale;
    return { coords, totalLengths };
}