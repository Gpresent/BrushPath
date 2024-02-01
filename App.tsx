import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Draw from './Draw';

export default function App() {
  return (
    // <View style={styles.container}>
      
    //   <StatusBar style="auto" />
    // </View>
    <Draw/>
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
