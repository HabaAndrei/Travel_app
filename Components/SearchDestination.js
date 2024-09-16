import { View ,TextInput,  Text, FlatList, StyleSheet } from 'react-native';
import React, {useState, useEffect} from 'react'
import ModalSearchDestination from './ModalSearchDestination.js';


const SearchDestination = (props) => {

  const [inputCity, setInputCity] = useState('');
  const [inputCountry, setInputCountry] = useState('');

  const [suggestions, setSuggestions] = useState([]);
  const [modalVisible, setModalVisible] = useState({type: false, data:''});





  
  return (

    <View>

      <ModalSearchDestination
        setCheckBoxActivities={props.setCheckBoxActivities}
        modalVisible={modalVisible} setModalVisible={setModalVisible}
        dataDestination={props.dataDestination} setDataDestination={props.setDataDestination}
        inputCity={inputCity} setInputCity={setInputCity}
        inputCountry={inputCountry} setInputCountry={setInputCountry}
        suggestions={suggestions} setSuggestions={setSuggestions}
      />
      
      <View >
        <TextInput
          placeholder={!props.dataDestination.country ? 
            "Country" : 
            `Country - ${props.dataDestination.country}`      
          }
          value={inputCountry}
          onChangeText={(text) => setInputCountry(text)}
          style={styles.textInput}
          placeholderTextColor="gray"
        />

        <TextInput
          
          placeholder={!props.dataDestination.city ? 
            "City" : 
            `City - ${props.dataDestination.city}`      
          }
          value={inputCity}
          onChangeText={(text) => {
            if(!props.dataDestination.country)return;
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