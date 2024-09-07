import { ScrollView, View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Button, ButtonText, Icon, CheckIcon, SearchIcon } from "@gluestack-ui/themed";

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


        console.log(props);
    }, [props.checkBoxActivities]);

    function pressOnOption(index) {
        setCheckbox((prev) => {
            const updatedCheckbox = [...prev];
            updatedCheckbox[index].selected = !updatedCheckbox[index].selected;
            return updatedCheckbox;
        });
    }

    return (
        <View style={styles.container}>
            {checkbox.length ? 
            <ScrollView>
                <FlatList
                    data={checkbox}
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
                <Button onPress={() =>props.navigation.navigate('Schedule', {name: 'Schedule'})} style={styles.button}>
                    <ButtonText>
                        <Icon as={SearchIcon} style={styles.searchIcon} />
                    </ButtonText>
                </Button>
            </ScrollView>
            : 
            <View style={styles.spinnerContainer}>
                <Spinner color="$indigo600" />
            </View> 
            }
        </View>
    );
}

export default CheckboxActivities;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
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
});
