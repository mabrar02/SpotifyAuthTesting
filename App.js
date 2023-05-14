import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Login from './Login';
import Home from './Home';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        if (token) {
          setIsLoggedIn(true);
        } else {
          console.log('No token found');
          setIsLoggedIn(false);
        }
      } catch (e) {
        console.log('Failed to get token:', e);
        setIsLoggedIn(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkToken();
  }, []);


  if (isCheckingToken) {
    // Render a loading screen or skeleton component
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
