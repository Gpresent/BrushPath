import React, { useState } from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Canvas, Path } from "@shopify/react-native-skia";

interface IPath {
  id: string;
  segments: string[];
  color?: string;
}

export default function Draw() {
  const [paths, setPaths] = useState<IPath[]>([]);
  const [currentPathId, setCurrentPathId] = useState<string | null>(null);

  const generatePathId = () => {
    return `path-${Date.now()}`;
  };

  const startPath = (x: number, y: number) => {
    const newPathId = generatePathId();
    setCurrentPathId(newPathId);
    setPaths((prevPaths) => [
      ...prevPaths,
      { id: newPathId, segments: [`M ${x} ${y}`], color: "#06d6a0" },
    ]);
  };

  const updatePath = (x: number, y: number) => {
    if (currentPathId) {
      setPaths((prevPaths) =>
        prevPaths.map((path) =>
          path.id === currentPathId
            ? { ...path, segments: [...path.segments, `L ${x} ${y}`] }
            : path
        )
      );
    }
  };

  const pan = Gesture.Pan()
    .onStart(({ x, y }) => startPath(x, y))
    .onUpdate(({ x, y }) => updatePath(x, y))
    .minDistance(1);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <Canvas style={{ flex: 8 }}>
            {paths.map((p) => (
              <Path
                key={p.id}
                path={p.segments.join(" ")}
                strokeWidth={5}
                style="stroke"
                color={p.color}
              />
            ))}
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}