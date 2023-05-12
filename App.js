import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Login from './Login';
import Home from './Home';

export default function App() {
  return (
      <Login/>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 200,
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  }
});
