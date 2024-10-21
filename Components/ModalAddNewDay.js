import { StyleSheet, Text, View, Modal, Pressable, KeyboardAvoidingView, Platform, TextInput  } from 'react-native';
import React, {useState} from 'react';

const ModalAddNewDay = () => {

    const [isModalVisible, setModalVisible] = useState(true);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [info, setInfo] = useState('');
    const [description, setDescription] = useState('');
    const [hour, setHour] = useState('');

    // ora la care sa faca excursia , numele , adresa, info, descriptio, 
  
    return (
    <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => { setModalVisible(false);}}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                <KeyboardAvoidingView style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? 50 : 0}} behavior="position">
                    <TextInput style={{borderWidth: 1,  borderColor: 'gray',  padding: 12,  borderRadius: 8,  fontSize: 16,  color: 'black',  backgroundColor: 'white'}}
                        placeholder={'Location name'}
                        value={name}
                        onChangeText={(text) => { setName(text)}}
                        placeholderTextColor="gray"
                    />
                    <TextInput style={{borderWidth: 1,  borderColor: 'gray',  padding: 12,  borderRadius: 8,  fontSize: 16,  color: 'black',  backgroundColor: 'white'}}
                        placeholder={'Location name'}
                        value={address}
                        onChangeText={(text) => { setAddress(text)}}
                        placeholderTextColor="gray"
                    />
                    <TextInput style={{borderWidth: 1,  borderColor: 'gray',  padding: 12,  borderRadius: 8,  fontSize: 16,  color: 'black',  backgroundColor: 'white'}}
                        placeholder={'Location name'}
                        value={info}
                        onChangeText={(text) => { setInfo(text)}}
                        placeholderTextColor="gray"
                    />
                    <TextInput style={{borderWidth: 1,  borderColor: 'gray',  padding: 12,  borderRadius: 8,  fontSize: 16,  color: 'black',  backgroundColor: 'white'}}
                        placeholder={'Location name'}
                        value={description}
                        onChangeText={(text) => { setDescription(text)}}
                        placeholderTextColor="gray"
                    />
                </KeyboardAvoidingView>

                
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {setModalVisible(false)}}>
                        <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    </View>
  )
}

export default ModalAddNewDay


// import {KeyboardAvoidingView, Platform, TextInput  } from 'react-native';
// <KeyboardAvoidingView style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? 50 : 0}} behavior="position">
// <TextInput
//     style={{borderWidth: 1,  borderColor: 'gray',  padding: 12,  borderRadius: 8,  fontSize: 16,  color: 'black',  backgroundColor: 'white'}}
//     placeholder={'hahhaha'}
//     value={inputCity}
//     onChangeText={(text) => { setInputCity(text)}}
//     placeholderTextColor="gray"
// />
// </KeyboardAvoidingView>

const styles = StyleSheet.create({

    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
     
    },
    modalView: {
      margin: 30,
      marginTop: 90,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
      width: 0,
      height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
     
     
});