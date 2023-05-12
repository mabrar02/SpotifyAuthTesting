import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';

const Home = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    button: {
      width: "100%",
      height: 200,
      backgroundColor: "red",
      alignItems: "center",
      justifyContent: "center",
    }
  });