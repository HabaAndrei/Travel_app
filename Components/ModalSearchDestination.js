import {FlatList, Modal, StyleSheet, Text, Pressable, View , TextInput} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {address_function_fuzzy} from '../diverse';

const ModalSearchDestination = (props) => {


    useEffect(()=>{
        if(!props.inputCountry.length){props.setModalVisible({type: false, data:''}); return};
        props.setModalVisible({type: true, data:'country'});


        axios.post(`${address_function_fuzzy}`,
            {
                "input" : props.inputCountry, 
                "value" : "country", 
                "country" : props.inputCountry  
            }
            ).then((data)=>{
                console.log(data.data);
                const list = data.data?.map((country)=>{return{place: country, type: "country"}})
                props.setSuggestions(list);
            }
        );
    }, [props.inputCountry]);





    useEffect(()=>{
        if(!props.inputCity.length){props.setModalVisible({type: false, data:''}); return};
        props.setModalVisible({type: true, data: "city"});
    }, [props.inputCity]);




    function selectDestination(item){
        console.log(item);
    }

    return (
        <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={props.modalVisible.type}
          onRequestClose={() => {
            props.setModalVisible({type: false, data:''});
          }}>
          <View style={styles.centeredView}>




            <View style={styles.modalView}>

            {/* ///////////////// */}

            {props.modalVisible.data === 'country' ? 
                <TextInput
                    placeholder="Search the country"
                    value={props.inputCountry}
                    onChangeText={(text) => props.setInputCountry(text)}
                    style={styles.textInput}
                    placeholderTextColor="gray"
                /> : <View></View>
            
            }


            {props.modalVisible.data === 'city' ? 
                <TextInput
                    placeholder="Search the city"
                    value={props.inputCity}
                    onChangeText={(text) => props.setInputCity(text)}
                    style={styles.textInput}
                    placeholderTextColor="gray"
                /> : <View></View>
            
            }


            {/* //////////////// */}



                <FlatList
                    data={props.suggestions}
                    keyExtractor={(item, index) => {
                        return index;
                    }}
                    renderItem={({ item }) => (
                        <Pressable style={styles.suggestion} 
                        onPress={()=>selectDestination(item)}
                        >
                        <Text style={styles.suggestionText}>
                            {item.place}
                        </Text>            
                        </Pressable>
                    )}
                    style={styles.suggestionsList}
                />




            {/* /////////////////////////// */}
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                    props.setModalVisible({type: false, data:''})
                    props.setInputCity('');
                    props.setInputCountry('');
                }}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        
      </View>
    )
}

export default ModalSearchDestination

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
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
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    textInput: {
        borderWidth: 1, 
        borderColor: 'gray', 
        padding: 10, 
        borderRadius: 5,
        color: 'black',  
        backgroundColor: 'white' 
    },
    suggestionsList: {
        marginTop: 5,
    },
    suggestion: {
        backgroundColor: '#4A90E2', 
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginVertical: 10,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center', 
    },
    suggestionText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1.2, 
    },
});