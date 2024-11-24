import { FlatList, Modal, StyleSheet, Text, Pressable, View, TextInput, SafeAreaView} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { address_function_fuzzy } from '../diverse';
import { Spinner } from "@gluestack-ui/themed";
import CustomButton from '../CustomElements/CustomButton.js';
import {    storeErr } from '../firebase.js';

const ModalSearchDestination = (props) => {

    const [isMessageNotFound, setMessageNotFound] = useState(false);

    useEffect(() => {
        if (!props.inputCountry.length) { return };
        props.setModalVisible({ type: true, data: 'country' });

        axios.post(`${address_function_fuzzy}`, {
            "input": props.inputCountry,
            "value": "country",
            "country": props.inputCountry
        }).then((data) => {
            openMessageNotFound(data.data);        
            const list = data.data?.map((country) => { return { place: country, type: "country" } });
            props.setSuggestions(list);
        }).catch((err) => {
            storeErr(err.message)
            console.log(err);
            props.addNotification("warning", "System error occurred. Please try again later.");
        });
    }, [props.inputCountry]);

    useEffect(() => {
        if (!props.dataDestination.country) return;
        if (!props.inputCity.length) { return };
        props.setModalVisible({ type: true, data: "city" });

        axios.post(`${address_function_fuzzy}`, {
            "input": props.inputCity,
            "value": "city",
            "country": props.dataDestination.country
        }).then((data) => {
            openMessageNotFound(data.data);
            const list = data.data?.map((country) => { return { place: country, type: "city" } });
            props.setSuggestions(list);
        }).catch((err) => {
            storeErr(err.message)
            console.log(err);
            props.addNotification("warning", "System error occurred. Please try again later.");
        });
    }, [props.inputCity]);

    function openMessageNotFound(data){
        console.log(data);
        if(!data?.length){
            setMessageNotFound(true);
        }else if(isMessageNotFound && data?.length){
            setMessageNotFound(false);
        }
    }

    function selectDestination(item) {
        if (item.type === "country") {
            props.setDataDestination((ob) => {
                return { city: '', country: item.place };
            });
            props.setInputCountry('');
            props.setCheckBoxActivities((prev) => { return { ...prev, country: item.place } });
        } else if (item.type === "city") {
            props.setDataDestination((ob) => {
                return { ...ob, city: item.place };
            });
            props.setInputCity('');
            props.setCheckBoxActivities((prev) => { return { ...prev, city: item.place } });
        }
        props.setModalVisible({ type: false, data: '' });
        props.setCheckbox([]);
        return;
    }

    function closeModal() {
        props.setModalVisible({ type: false, data: '' });
        props.setInputCity('');
        props.setInputCountry('');
    }

    return (
    <SafeAreaView style={{flex: 1}}>

        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible.type}
                onRequestClose={() => {
                    props.setModalVisible({ type: false, data: '' });
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        {props.modalVisible.data === 'country' ?
                            <TextInput
                                placeholder="Country"
                                value={props.inputCountry}
                                onChangeText={(text) => props.setInputCountry(text)}
                                style={styles.textInput}
                                placeholderTextColor="gray"
                            /> : <View></View>
                        }

                        {props.modalVisible.data === 'city' ?
                            <TextInput
                                placeholder="City"
                                value={props.inputCity}
                                onChangeText={(text) => props.setInputCity(text)}
                                style={styles.textInput}
                                placeholderTextColor="gray"
                            /> : <View></View>
                        }

                        {props.suggestions.length ?
                        <FlatList
                            data={props.suggestions}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <Pressable style={styles.suggestion}
                                    onPress={() => selectDestination(item)}>
                                    <Text style={styles.suggestionText}>
                                        {item.place}
                                    </Text>
                                </Pressable>
                            )}
                            style={styles.suggestionsList}
                        />
                        : isMessageNotFound && !props.suggestions.length ? 
                            <View style={styles.spinnerContainer}>
                                <Text>This location was not found</Text>
                            </View>
                        :
                            <View style={styles.spinnerContainer}>
                                <Spinner color="$indigo600" />
                            </View>
                        }
                        <CustomButton name={'Close'} func={closeModal} />
                    </View>
                </View>
            </Modal>
        </View>
    </SafeAreaView>
    );
}

export default ModalSearchDestination;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        marginTop: 40,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,  
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        paddingTop: 10,
        maxHeight: '70%'
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        color: '#333',
        backgroundColor: 'white',
        width: 250,
        marginVertical: 15, 
    },
    suggestionsList: {
        marginTop: 10,
        width: '100%', 
    },
    suggestion: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginVertical: 5,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 250,
    },
    suggestionText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
