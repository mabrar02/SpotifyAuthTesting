import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { AccessTokenRequest, ResponseType, useAuthRequest, revokeAsync } from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import { Buffer } from 'buffer';

const Home = ({navigation}) => {

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');


  const storeTokenInfo = async (tokenJson) => {
    await SecureStore.setItemAsync("access_token", tokenJson.access_token);
    await SecureStore.setItemAsync("refresh_token", tokenJson.refresh_token);
    const tokenExpireTime = new Date().getTime + tokenJson.expires_in * 1000;
    await SecureStore.setItemAsync("token_expire", tokenExpireTime);

  };

  const storeUserInfo = async (userData) => {
    await SecureStore.setItemAsync("user_id", userData.id);
    await SecureStore.setItemAsync("user_display_name", userData.display_name);
    await SecureStore.setItemAsync("user_email", userData.email);
    await SecureStore.setItemAsync("user_pfp_url", userData.images[0].url);
    setDisplayName(userData.display_name);
    setEmail(userData.email);
  }


  const getUserInfo = async () => {
    const expirationDate = await SecureStore.getItemAsync("token_expire");
    if(!expirationDate || new Date().getTime() > expirationDate) {
      await refreshTokens();
    }

    const token = await SecureStore.getItemAsync("access_token");

    const profile = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const profileJson = await profile.json();
    storeUserInfo(profileJson);

  }

  const refreshTokens = async () => {
    const credentials = "6fd05ac39ff042a99ee4fc4a31871e82:e72f7a0d0c124fc085f2a5759fa0c8cf";
    const encodedCredentials = Buffer.from(credentials).toString("base64");

    const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${SecureStore.getItemAsync("refresh_token")}`,
    });

    const refreshJson = refreshResponse.json();
    storeTokenInfo(refreshJson);
    return refreshJson;
  };

  const clearData = async () => {
    SecureStore.deleteItemAsync("access_token");
    SecureStore.deleteItemAsync("refresh_token");
    SecureStore.deleteItemAsync("token_expire");
  }


  useEffect(() => {
    getUserInfo();
  },[]);

  const checkDetails = async () => {
    const accessToken = await SecureStore.getItemAsync("access_token");
    const refreshToken = await SecureStore.getItemAsync("refresh_token");
    const tokenExpireTime = await SecureStore.getItemAsync("token_expire");
    
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);
    console.log("Token Expire Time:", tokenExpireTime);
  }

  const logout = async () => {
    const accessTok = await SecureStore.getItemAsync("access_token");
    const discovery = {
      revocationEndpoint: "https://accounts.spotify.com/api/token",
    };
    await revokeAsync({
      token: accessTok,
    }, discovery);
    clearData();
    navigation.navigate("Login");
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{width: 200, backgroundColor: "red", height: 100}} onPress={() => checkDetails()}>
        <Text>Check Details</Text>
      </TouchableOpacity>
      <Text>{displayName}</Text>
      <Text>{email}</Text>
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
      backgroundColor: "#eb584d",
      alignItems: "center",
      justifyContent: "center",
    }
  });