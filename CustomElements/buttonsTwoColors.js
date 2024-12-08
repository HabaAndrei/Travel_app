import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

const ButtonWhite = (props) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.buttonWhite}
        onPress={()=>props.func()}>
        <Text style={styles.buttonTextWhite}>{props.name}</Text>
      </TouchableOpacity>
    </View>
  )
}

const ButtonBlue = (props) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button}
        onPress={()=>props.func()}>
        <Text style={styles.buttonText}>{props.name}</Text>
      </TouchableOpacity>
    </View>
  )
}

export {ButtonWhite, ButtonBlue};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(0, 0, 255, 0.45)',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    minWidth: 200
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonWhite:{
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    minWidth: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  buttonTextWhite: {
    color: 'rgba(0, 0, 255, 10)',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})