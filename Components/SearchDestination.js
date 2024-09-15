import { View, Pressable ,TextInput,  Text, FlatList, StyleSheet } from 'react-native';
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import {address_function_fuzzy} from '../diverse.js';
import ModalSearchDestination from './ModalSearchDestination.js';


const SearchDestination = (props) => {

  const [inputCity, setInputCity] = useState('');
  const [inputCountry, setInputCountry] = useState('');

  const [suggestions, setSuggestions] = useState([]);
  const [dataDestination, setDataDestination] = useState({country: '', city: ''});
  const [modalVisible, setModalVisible] = useState({type: false, data:''});


  useEffect(()=>{
    console.log(dataDestination)
  }, [dataDestination]);


  
  return (

    <View>

      <ModalSearchDestination
        modalVisible={modalVisible} setModalVisible={setModalVisible}
        dataDestination={dataDestination} setDataDestination={setDataDestination}
        inputCity={inputCity} setInputCity={setInputCity}
        inputCountry={inputCountry} setInputCountry={setInputCountry}
        suggestions={suggestions} setSuggestions={setSuggestions}
      />
      
      <View >
        <TextInput
          placeholder={!dataDestination.country ? 
            "Country" : 
            `Country - ${dataDestination.country}`      
          }
          value={inputCountry}
          onChangeText={(text) => setInputCountry(text)}
          style={styles.textInput}
          placeholderTextColor="gray"
        />

        <TextInput
          
          placeholder={!dataDestination.city ? 
            "City" : 
            `City - ${dataDestination.city}`      
          }
          value={inputCity}
          onChangeText={(text) => {
            if(!dataDestination.country)return;
            setInputCity(text)}
          }
          style={styles.textInput}
          placeholderTextColor="gray"
        />

      </View>
    </View>


    
   
  )
}

export default SearchDestination

const styles = StyleSheet.create({
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
    textInput: {
      borderWidth: 1, 
      borderColor: 'gray', 
      padding: 10, 
      borderRadius: 5,
      color: 'black',  
      backgroundColor: 'white',
      marginTop: 20, 
    }

})