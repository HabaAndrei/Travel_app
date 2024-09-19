import { Modal, View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Button, ButtonText, Icon, CheckIcon, SearchIcon } from "@gluestack-ui/themed";
import {address_function_checkbox} from '../diverse.js';


const CheckboxActivities = (props) => {

    useEffect(() => {
        const { isOpen, city, country } = props.checkBoxActivities;
        if (isOpen) {
            if(props.checkbox.length)return;
            axios.post(`${address_function_checkbox}`,
                {city, country}
            ).then(data=>{
                let arVariants = Object.values(data.data);
                props.setCheckbox(arVariants.map((a)=> {
                    let word = a[0].toUpperCase() + a.slice(1, a.length);
                    return  {selected:false, category:word};
                }));
            }).catch((err)=>{
                props.addNotification("warning", "System error occurred. Please try again later.")
            });
        }

    }, [props.checkBoxActivities]);

    function pressOnOption(index) {
        props.setCheckbox((prev) => {
            const updatedCheckbox = [...prev];
            updatedCheckbox[index].selected = !updatedCheckbox[index].selected;
            return updatedCheckbox;
        });
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.checkBoxActivities.isOpen}
            >
                {props.checkbox.length ? 
                <View style={styles.modalView}>
                    <FlatList
                        data={props.checkbox}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <Pressable 
                                    style={[
                                        styles.pressable, 
                                        item.selected && styles.pressableSelected
                                    ]}
                                    onPress={() => pressOnOption(index)}
                                >
                                    <Text style={styles.text}>
                                        {item.category}
                                    </Text>
                                    {item.selected ? 
                                        <Icon as={CheckIcon} style={styles.icon} />
                                        :
                                        <View style={styles.iconPlaceholder}></View>
                                    }
                                </Pressable>
                            );
                        }}
                    />
                    <Button onPress={() =>{props.closeCheckbox()}} style={styles.button}>
                        <ButtonText>
                            <Icon as={SearchIcon} style={styles.searchIcon} />
                        </ButtonText>
                    </Button>
                </View>
                : 
                <View style={styles.spinnerContainer}>
                    <Spinner color="$indigo600" />
                </View> 
                }
            </Modal>
        </View>
    );
}

export default CheckboxActivities;

const styles = StyleSheet.create({

    pressable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        marginVertical: 5,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    pressableSelected: {
        backgroundColor: '#e0e0e0',
        borderColor: '#007BFF',
        borderWidth: 1,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    icon: {
        width: 24,
        height: 24,
        color: '#007BFF',
    },
    iconPlaceholder: {
        width: 24,
        height: 24,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    searchIcon: {
        color: '#fff',
        marginHorizontal: 5,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    }
    
});
