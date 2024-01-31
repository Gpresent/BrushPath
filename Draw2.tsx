import React, { useState } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, NativeSyntheticEvent, NativeTouchEvent } from "react-native";
import { Svg, Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function Draw2() {
    const [paths, setPaths] = useState<string[][]>([]);
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [clearClicked, setClearClicked] = useState(false);

    const onTouchEnd = () => {
        paths.push(currentPath);
        console.log(currentPath);
        setCurrentPath([]);
        setClearClicked(false);
    }

    const onTouchMove = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
        const newPath = [...currentPath];
        const x = e.nativeEvent.locationX.toFixed(0);
        const y = e.nativeEvent.locationY.toFixed(0);
        const newPoint = `${newPath.length === 0 ? "M" : ""} ${x},${y} `;
        newPath.push(newPoint);
        setCurrentPath(newPath);
    }

    const clearScreen = () => {
        setPaths([]);
        setCurrentPath([]);
        setClearClicked(true);
    }

    return (
        <View style={styles.container}>
            <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                <Svg>
                    <Path
                        d={paths.join('')}
                        stroke="red"
                        strokeWidth={7}
                        strokeLinecap="round"
                        strokeLinejoin="round" 
                        fill="none"
                    />
                    {paths.map((path, index) => (
                        <Path
                            key={index}
                            d={currentPath.join('')}
                            stroke="red"
                            strokeWidth={7}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />
                    ))}
                </Svg>
            </View>
            <TouchableOpacity
                style={styles.clearButton}
                onPress={clearScreen}>
                <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
        </View>

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    svgContainer: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: "black",
    },
    clearButton: {
        position: "absolute",
        bottom: 20,
        left: 20,
        padding: 10,
        backgroundColor: "red",
        borderRadius: 5,
    },
    clearButtonText: {
        color: "white",
    },
});