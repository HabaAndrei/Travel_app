import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';

/** General input that can be easily edited and saved */
const InputChanges = (props) => {
  return (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{props.title}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        value={props.value}
        onChangeText={(text) => props.onChange(text)}
        style={styles.textInput}
        placeholderTextColor="gray"
        placeholder={props?.placeholder}
      />
      {props.isModified ?
        <>
        <TouchableOpacity onPress={()=>props.pressOnSave(props.param)} >
          <AntDesign
            name="check"
            size={24}
            color="green"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>props.pressOnCancel(props.param)} >
          <AntDesign
            name="close"
            size={24}
            color="red"
            style={styles.icon}
          />
        </TouchableOpacity>
        </> : null
      }
    </View>
  </View>
  )
}

export default InputChanges

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  textInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: 'black',
  },
  icon: {
    paddingHorizontal: 10,
  },
});
