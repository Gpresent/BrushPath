import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import GestureDemo from './GestureDemo';

export default function App() {
  return (
    // <View style={styles.container}>
      
    //   <StatusBar style="auto" />
    // </View>
    <GestureDemo />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
