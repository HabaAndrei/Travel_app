import { StyleSheet, Text, View, Modal, Pressable, ScrollView, KeyboardAvoidingView, 
    Platform, TextInput  } from 'react-native';
import React, {useState} from 'react';
import TimePicker from './TimePicker.js';
import { Center } from '@gluestack-ui/themed';

const ModalAddNewDay = (props) => {

    
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [info, setInfo] = useState('');
    const [description, setDescription] = useState('');
    ////////////////////////////////////////
    //  scot asat in productie !!! ==>>>>>>>
    const [hour, setHour] = useState('12:12');
    /// <<<<=============
    ////////////////////////////////////////
    const [isTimePickerVisible, setTimePickerVisibility] = useState({type:false});
  
    function handleConfirmTime(time){
        const timestamp = new Date(time).getTime();
        let hour = new Date(timestamp).getHours();
        let minutes = new Date(timestamp).getMinutes();
        if(JSON.stringify(minutes).length < 2)minutes = "0" + JSON.stringify(minutes);
        if(JSON.stringify(hour).length < 2)hour = "0" + JSON.stringify(hour);
        setHour(`${hour}:${minutes}`);
        hideDatePicker();
    }

    function hideDatePicker(){
        setTimePickerVisibility({type:false});
    };

    function pressOnSave(){
        if(!name.length || !hour){
            props.addNotification('error', 'You need to add the name of the location and the time to proceed further')
            return;
        }
        props.saveNewLocation(name, address, info, description, hour);
        setName('');
        setAddress('');
        setInfo('');
        setDescription('');
        setHour('');
    }

    return (
    <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={props.isModalVisible.type}
          onRequestClose={() => { props.setModalVisible({type: false});}}>
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

                
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, styles.buttonNo]}
                            onPress={() =>props.setModalVisible({type: false})}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonYes]}
                            onPress={pressOnSave}
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
      marginTop: 40,
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
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20
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
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
     
});