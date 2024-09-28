import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { connectWithGoogle, createUserEmailPassword, verifyEmail } from '../firebase';

const UserSettings = (props) => {
  return (
    <View>
      <Text>UserSettings</Text>

      <View>
        <Pressable>
          <Text onPress={()=>connectWithGoogle()} >
            Connect with google 
          </Text>
        </Pressable>

        <Pressable>
          <Text onPress={()=>createUserEmailPassword()} >
            Create accout with email and password
          </Text>
        </Pressable>

        <Pressable>
          <Text onPress={()=>verifyEmail()} >
            Verify email
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default UserSettings

const styles = StyleSheet.create({})