import React, { useState } from "react";
import { SafeAreaView, Text } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

export default function GestureDemo() {
  const [tGestureStart, setTGestureStart] = useState<undefined | string>();
  const [tGestureMove, setTGestureMove] = useState<undefined | string>();
  const [tGestureUpdate, setTGestureUpdate] = useState<undefined | string>();
  const [tGestureEnd, setTGestureEnd] = useState<undefined | string>();

  const pan = Gesture.Pan()
    .onStart((g) => {
      // Start gesture looks like this 
      // {
      //   "absoluteX": 178,
      //   "absoluteY": 484,
      //   "handlerTag": 2,
      //   "numberOfPointers": 1,
      //   "oldState": 2,
      //   "state": 4,
      //   "target": 115,
      //   "translationX": -4.3333282470703125,
      //   "translationY": 0,
      //   "velocityX": -172.0102558333448,
      //   "velocityY": 0,
      //   "x": 178,
      //   "y": 484,
      // }
      setTGestureStart(`${Math.round(g.x)}, ${Math.round(g.y)}`);
    })
    .onTouchesMove((g) => {
    // Move gesture looks like this
    // {
    //   "allTouches": Array [
    //     {
    //       "absoluteX": 123.33332824707031,
    //       "absoluteY": 449,
    //       "id": 0,
    //       "x": 123.33332824707031,
    //       "y": 449,
    //     },
    //   ],
    //   "changedTouches": Array [
    //    {
    //       "absoluteX": 123.33332824707031,
    //       "absoluteY": 449,
    //       "id": 0,
    //       "x": 123.33332824707031,
    //       "y": 449,
    //     },
    //   ],
    //   "eventType": 2,
    //   "handlerTag": 2,
    //   "numberOfTouches": 1,
    //   "state": 4,
    //   "target": 115,
    // }
      setTGestureMove(
        `${Math.round(g.changedTouches[0].x)}, ${Math.round(
          g.changedTouches[0].y
        )}`
      );
    })
    .onUpdate((g) => {
      // Update gesture looks like
      // {
      //   "absoluteX": 229,
      //   "absoluteY": 400.3333282470703,
      //   "handlerTag": 2,
      //   "numberOfPointers": 1,
      //   "state": 4,
      //   "target": 115,
      //   "translationX": 0,
      //   "translationY": 1.6666717529296875,
      //   "velocityX": 0,
      //   "velocityY": 24.111687246989227,
      //   "x": 229,
      //   "y": 400.3333282470703,
      // }
      setTGestureUpdate(`${Math.round(g.x)}, ${Math.round(g.y)}`);
    })
    .onEnd((g) => {
      // End gesture looks like this
      // {
      //   "absoluteX": 213.3333282470703,
      //   "absoluteY": 542.6666564941406,
      //   "handlerTag": 2,
      //   "numberOfPointers": 0,
      //   "oldState": 4,
      //   "state": 5,
      //   "target": 115,
      //   "translationX": -66,
      //   "translationY": 172,
      //   "velocityX": -71.28075141720757,
      //   "velocityY": 567.0058445795321,
      //   "x": 213.3333282470703,
      //   "y": 542.6666564941406,
      // }
      setTGestureEnd(`${Math.round(g.x)}, ${Math.round(g.y)}`);
    });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={pan}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          <Text
            style={{ color: "white", fontSize: 24 }}
          >{`Gesture started at:  ${tGestureStart}`}</Text>
          <Text
            style={{ color: "white", fontSize: 24 }}
          >{`Gesture moved to:  ${tGestureMove}`}</Text>
          <Text
            style={{ color: "white", fontSize: 24 }}
          >{`Gesture updated to:  ${tGestureUpdate}`}</Text>
          <Text
            style={{ color: "white", fontSize: 24 }}
          >{`Gesture ended at:  ${tGestureEnd}`}</Text>
        </SafeAreaView>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}