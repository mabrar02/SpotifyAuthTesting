import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { AccessTokenRequest, ResponseType, useAuthRequest } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { Buffer } from 'buffer';

const Login = ({ navigation }) => {

  const authConfig = {
    responseType: ResponseType.Code,
    clientId: "6fd05ac39ff042a99ee4fc4a31871e82",
    clientSecret: "e72f7a0d0c124fc085f2a5759fa0c8cf",
    scopes: [
      "user-read-email",
      "user-read-private",
      "user-library-read",
      "user-library-modify",
    ],
    usePKCE: false,
    redirectUri: "exp://192.168.2.21:19000",
    prompt: "login",
  };

  const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  const [request, response, promptAsync] = useAuthRequest(authConfig, discovery);


  useEffect(() => {
    if (response?.type === 'success') {
      const code = response.params.code;
      getTokens(code);
    }

  }, [response]);

  const getTokens = async (aCode) => {
    if(aCode) {
      const credentials = "6fd05ac39ff042a99ee4fc4a31871e82:e72f7a0d0c124fc085f2a5759fa0c8cf";
      const encodedCredentials = Buffer.from(credentials).toString("base64");
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=authorization_code&code=${aCode}&redirect_uri=exp://192.168.2.21:19000`,
      });

      const responseJson = await tokenResponse.json();
      console.log(responseJson);
      storeTokenInfo(responseJson);
    }
  };

  const storeTokenInfo = async (tokenJson) => {

    await SecureStore.setItemAsync("access_token", tokenJson.access_token);
    await SecureStore.setItemAsync("refresh_token", tokenJson.refresh_token);
    const tokenExpireTime = new Date().getTime() + tokenJson.expires_in * 1000;
    await SecureStore.setItemAsync("token_expire", tokenExpireTime.toString());
    navigation.navigate("Home");
  };

  const checkDetails = async () => {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const refreshToken = await SecureStore.getItemAsync("refresh_token");
    const tokenExpireTime = await SecureStore.getItemAsync("token_expire");
    
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);
    console.log("Token Expire Time:", tokenExpireTime);
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{width: 200, backgroundColor: "red", height: 100}} onPress={() => checkDetails()}>
        <Text>Check Details</Text>
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
