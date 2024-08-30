import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Home = ({navigation}) => {
  return (
    <View>
      <Text>Home</Text>

      <Text
      title="Go to Jane's profile"
      onPress={() =>
        navigation.navigate('Test', {name: 'Test'})
      }
      >Press</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({})