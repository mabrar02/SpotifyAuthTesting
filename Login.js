import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar';

const Login = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text>Login</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  )
}

export default Login

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
      backgroundColor: "dodgerblue",
      alignItems: "center",
      justifyContent: "center",
    }
  });