import { View, Text, Pressable, FlatList, StyleSheet, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Spinner, HStack, Center, NativeBaseProvider } from "native-base";

const CheckboxActivities = (props) => {

    const [checkbox, setCheckbox] = useState([]);

    useEffect(() => {
        const { isOpen, city, country } = props.checkBoxActivities;
        if (isOpen) {
            axios.post('http://localhost:4000/getActivities', { city, country })
                .then((data) => {
                    const ar = Object.values(data.data).map((category) => {
                        return { category, selected: false }
                    });
                    setCheckbox([...ar]);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [props.checkBoxActivities]);

    function pressOnOption(index) {
        setCheckbox((prev) => {
            prev[index].selected = !prev[index].selected;
            return [...prev];
        });
    }

    return (
        <View style={styles.container}>

            {checkbox.length ? 
            <View>
                <FlatList
                    data={checkbox}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        return (
                            <Pressable 
                                style={[
                                    styles.suggestion, 
                                    item.selected && styles.suggestionSelected
                                ]} 
                                onPress={() => pressOnOption(index)}
                            >
                                <Text 
                                    style={[
                                        styles.suggestionText, 
                                        item.selected && styles.suggestionTextSelected
                                    ]}
                                >
                                    {item.category}
                                </Text>
                            </Pressable>
                        );
                    }}
                />

                <Pressable  onPress={()=>{console.log('perfect')}} style={styles.button}>
                    <Text style={styles.buttonText}>Acesta este butonul</Text>
                </Pressable>
                
            </View>
            : 

            <View>
               <Text> ---</Text>
            </View>
            
            // <NativeBaseProvider>
            //     <Center >

            //         <HStack>
            //             <Spinner color="cyan.500" />
            //         </HStack>
            //     </Center>
            // </NativeBaseProvider>
        
            }

           
        </View>
    );
}

export default CheckboxActivities;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
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
    suggestionSelected: {
        backgroundColor: '#7B4397',  // Culoare mai închisă pentru elementul selectat
    },
    suggestionText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1.2, 
    },
    suggestionTextSelected: {
        color: '#FFD700',  // Culoare aurie pentru textul selectat
    },
    button: {
        marginTop: 10,
        backgroundColor: '#7B4397',  // Culoare vibrantă pentru buton
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1.2,
    },
});
