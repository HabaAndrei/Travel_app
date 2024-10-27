import { StyleSheet, View, Pressable, Modal } from 'react-native'
import React, {useState} from 'react'
import { Input, InputField, InputIcon, InputSlot, VStack, HStack, Divider, Button, Center, Heading, EyeIcon, ButtonText, 
    EyeOffIcon, Card, Text } from '@gluestack-ui/themed';
import {reAuth} from '../firebase.js';


const ModalReAuth = (props) => {

    const [isModalVisible, setModalVisible] = useState(true);
    const [password, setPassword] = useState('');

    async function reauthenticate(){
        console.log('se executa');
        if(!password.length)return;
        const rez = await reAuth(password);
        if(!rez.type){
            console.log(rez.err);
            props.addNotification('error', 'eroare');
        }
    }

  return (
    <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => {setModalVisible(false)}}
        >
            <View style={styles.modalView}>

                <View>
                    <Heading>To perform this operation, you must re-authenticate</Heading>

                    <Text color="$text500" lineHeight="$xs" style={{marginTop: 10}}>
                        Password
                    </Text>
                    <Input>
                        <InputField  type="text"  value={password}  
                            onChangeText={(text) => setPassword(text)} 
                        />
                    </Input>

                    <Button onPress={reauthenticate} >
                        <ButtonText>
                            Reauthenticate
                        </ButtonText>
                    </Button>
                </View>
                <View style={{marginTop: 10}} >
                    <Pressable
                        style={[styles.button, styles.buttonClose]}>
                        <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                </View>
            </View>
                
        </Modal>
    </View>
  )
}

export default ModalReAuth

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
})