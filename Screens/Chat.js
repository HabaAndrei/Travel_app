import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import {askQuestion} from '../firebase.js';

const Chat = () => {



  return (
    <View>
      <Pressable onPress={()=>askQuestion(
        [
          {type: 'user', mes: 'What is the address of Cape Soya'},
          {type: "ai", mes: 'The address of Cape Soya is 3 Soyamisaki, Wakkanai, Hokkaido 098-6758, Japan.'},
          {type: 'user', mes: 'What is the country?'},
        ]
      )} >
        <Text>Get mes</Text>
      </Pressable>
      <Text>Chat</Text>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({})