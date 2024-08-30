import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Test = ({navigation}) => {
  return (
    <View>
      <Text>Test</Text>

      <Text
      title="Go to Jane's profile"
      onPress={() =>
        navigation.navigate('Home', {name: 'Home'})
      }
      >Press</Text>
    </View>
  )
}

export default Test

const styles = StyleSheet.create({})