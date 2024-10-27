import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const CountdownNews = (props) => {

    useEffect(()=>{
        console.log(props.plans);
    }, [props.plans]);


    
  return (
    <View>
      <Text>CountdownNews</Text>
    </View>
  )
}

export default CountdownNews

const styles = StyleSheet.create({})