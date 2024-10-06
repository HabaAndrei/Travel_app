import { View ,TextInput,  Text, FlatList, Image, StyleSheet } from 'react-native';
import React, {useState, useEffect} from 'react'
import ModalSearchDestination from './ModalSearchDestination.js';
import { Card, Pressable } from '@gluestack-ui/themed';


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
        addNotification={props.addNotification}
      />
      
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
      
      <Image 
      style={{height: 150, width: 320, marginTop:10, marginBottom:10}}
        source={require('../img/europa.png')} 
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


    
   
  )
}

export default SearchDestination

const styles = StyleSheet.create({

  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
  }

})