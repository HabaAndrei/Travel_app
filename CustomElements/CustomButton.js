import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button, Icon } from "@gluestack-ui/themed";

const CustomButton = (props) => {

  return (
    <View style={styles.buttonContainer}>
      <Button style={[styles.button, styles.shadow]}
      onPress={()=>props.func()}
      >
        <Text style={styles.buttonText}>{props.name}</Text>
        {props.icon ? 
        <Icon as={props.icon} style={styles.icon} />
        :
        <Icon/>
        }
      </Button>
    </View>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B3D91',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 180,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    color: 'white',
    marginRight: 8,
    marginLeft: 3
  },
})