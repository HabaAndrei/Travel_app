import { StyleSheet, Text, View, Modal, Pressable, ScrollView, KeyboardAvoidingView, 
    Platform, TextInput  } from 'react-native';
import React, {useState} from 'react';
import TimePicker from './TimePicker.js';
import { Center } from '@gluestack-ui/themed';

const ModalAddNewDay = () => {

    const [isModalVisible, setModalVisible] = useState(true);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [info, setInfo] = useState('');
    const [description, setDescription] = useState('');
    const [hour, setHour] = useState('');
    const [isTimePickerVisible, setTimePickerVisibility] = useState({type:false});
  
    function handleConfirmTime(time){
        const timestamp = new Date(time).getTime();
        let hour = new Date(timestamp).getHours();
        let minutes = new Date(timestamp).getMinutes();
        if(JSON.stringify(minutes).length < 2)minutes = "0" + JSON.stringify(minutes);
        if(JSON.stringify(hour).length < 2)hour = "0" + JSON.stringify(hour);
        setHour(`${hour}:${minutes}`);
        hideDatePicker()
    }

    function hideDatePicker(){
        setTimePickerVisibility({type:false});
    };

    return (
    <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => { setModalVisible(false);}}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                <ScrollView style={{maxHeight: 400}} >
                    <KeyboardAvoidingView style={{ paddingBottom: Platform.OS === 'ios' ? 60 : 0}} behavior="position">
                        <TextInput style={styles.input}
                            placeholder={'Location name'}
                            value={name}
                            onChangeText={(text) => { setName(text)}}
                            placeholderTextColor="gray"
                        />
                        <TextInput style={styles.input}
                            placeholder={'Address'}
                            value={address}
                            onChangeText={(text) => { setAddress(text)}}
                            placeholderTextColor="gray"
                        />
                        <TextInput style={styles.input}
                            placeholder={'Info'}
                            value={info}
                            onChangeText={(text) => { setInfo(text)}}
                            placeholderTextColor="gray"
                        />
                        <TextInput style={styles.input}
                            placeholder={'Description'}
                            value={description}
                            onChangeText={(text) => { setDescription(text)}}
                            placeholderTextColor="gray"
                        />
                        
                        <TimePicker isTimePickerVisible={isTimePickerVisible} setTimePickerVisibility={setTimePickerVisibility} 
                            showDatePicker={()=>setTimePickerVisibility({type: true})} hideDatePicker={hideDatePicker} 
                            handleConfirm={handleConfirmTime} title={'Add time'}
                        />
                        <Center>
                            <Text bold={true}>{hour ? hour : ''}</Text>
                        </Center>

                    </KeyboardAvoidingView>
                </ScrollView>

                
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {setModalVisible(false)}}>
                        <Text style={styles.textStyle}>Close</Text>
                    </Pressable>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, styles.buttonNo]}
                            onPress={() =>setModalVisible(false)}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonYes]}
                            onPress={() => closeWithResponse(true)}
                        >
                            <Text style={styles.textStyle}>Save</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    </View>
  )
}

export default ModalAddNewDay




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
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,  
        borderColor: 'gray',  
        padding: 12,  
        borderRadius: 8,  
        fontSize: 16,  
        color: 'black', 
        backgroundColor: 'white', 
        minWidth: 200, 
        marginTop: 20
    },
    buttonContainer: {
        flexDirection: 'row',
    },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: '40%', 
    },
    buttonYes: {
        backgroundColor: '#4CAF50',
    },
    buttonNo: {
        backgroundColor: '#F44336', 
    },
     
});