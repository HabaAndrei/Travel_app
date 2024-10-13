import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const NavbarProgram = (props) => {


    function navigateProgram(){
        if(props.name === 'Program')return;
        props.navigation.navigate('Program')
    }

    function navigateLocations(){
        if(props.name === 'Locations')return;
        props.navigation.navigate('Locations')
    }


    return (
    <View style={styles.container}>
        <View style={styles.navbar}>
            <Pressable
                style={[styles.navButton, props.name === 'Locations' && styles.disabledButton]}
                onPress={() => navigateLocations()}
            >
                <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                <Text style={styles.navButtonText}>Locations page</Text>
            </Pressable>

            <Pressable
                style={[styles.navButton, props.name === 'Program' && styles.disabledButton]}
                onPress={() =>navigateProgram()}
            >
                <Text style={styles.navButtonText}>Program page</Text>
                <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
            </Pressable>
        </View>
    </View>
  )
}

export default NavbarProgram

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    navButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#007bff',
      paddingVertical: 8,
      paddingHorizontal: 15,
      margin: 5,
      borderRadius: 15,
    },
    navButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
      marginHorizontal: 3,
    },
    disabledButton: {
      backgroundColor: '#a3a3a3',
    },
});