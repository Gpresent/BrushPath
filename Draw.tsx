import React, { useState } from "react";
import { View, Button } from "react-native";
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
  const [lastX, setLastX] = useState<number | null>(null);
  const [lastY, setLastY] = useState<number | null>(null);
  const [threshold, setThreshold] = useState<number>(1); // Set your threshold distance here

  const generatePathId = () => {
    return `path-${Date.now()}`;
  };

  const startPath = (x: number, y: number) => {
    const newPathId = generatePathId();
    setCurrentPathId(newPathId);
    setLastX(x);
    setLastY(y);
    setPaths((prevPaths) => [
      ...prevPaths,
      { id: newPathId, segments: [`M ${x} ${y}`], color: "#06d6a0" },
    ]);
  };

  const updatePath = (x: number, y: number) => {
    if (
      currentPathId &&
      lastX !== null &&
      lastY !== null
    ) {
      //const distance = Math.sqrt((x - lastX) ** 2 + (y - lastY) ** 2);
      if (true /*distance >= threshold*/) {
        setLastX(x);
        setLastY(y);
        setPaths((prevPaths) =>
          prevPaths.map((path) =>
            path.id === currentPathId
              ? { ...path, segments: [...path.segments, `L ${x} ${y}`] }
              : path
          )
        );
      }
    }
  };

  const clearScreen = () => {
    setPaths([]);
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
                strokeWidth={10}
                style="stroke"
                strokeJoin="round"
                strokeCap="round"
                color={p.color}
              />
            ))}
          </Canvas>
          <View
            style={{
              position: "absolute",
              bottom: 30,
              left: 0,
              right: 0,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              title="Clear Screen"
              onPress={clearScreen}
              color="#ff6f61"
            />
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}
