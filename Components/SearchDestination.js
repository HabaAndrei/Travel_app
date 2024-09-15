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


  // useEffect(()=>{
  //   if(!inputCity.length){
  //     setSuggestions([]);
  //     return;
  //   }
  //   try{
  //     if(!dataDestination.country && !dataDestination.city){
  //       axios.post(`${address_function_fuzzy}`,
  //         {
  //           "input" : inputCity, 
  //           "value" : "country", 
  //           "country" : inputCity  
  //         }
  //       ).then((data)=>{
  //         setSuggestions(data.data);
  //       });
  //     }else if(dataDestination.country && !dataDestination.city){
  //       axios.post(`${address_function_fuzzy}`,
  //         {
  //           "input" : inputCity, 
  //           "value" : "city", 
  //           "country" :  dataDestination.country 
  //         }
  //       ).then((data)=>{
  //         setSuggestions(data.data);
  //       });
  //     }
      
  //   }catch(err){
  //     console.log(err);
  //   }
  // } , [inputCity]);



  function selectDestination(place){
    if(!dataDestination.country && !dataDestination.city){
      setDataDestination((ob)=>{
        return {...ob, country: place }
      })
      setSuggestions([]);
      setInputCity('');
    }else if(dataDestination.country && !dataDestination.city){
      setDataDestination((ob)=>{
        return {...ob, city: place }
      })
      props.setCheckBoxActivities({isOpen: true, city: place ,country: dataDestination.country });
    }
  }


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
          placeholder="Search the country"
          value={inputCountry}
          onChangeText={(text) => setInputCountry(text)}
          style={styles.textInput}
          placeholderTextColor="gray"
        />

        <TextInput
          placeholder="Search the city"
          value={inputCity}
          onChangeText={(text) => setInputCity(text)}
          style={styles.textInput}
          placeholderTextColor="gray"
        />

        {/* <FlatList
          data={suggestions}
          keyExtractor={(item, index) => {
            return index;
          }}
          renderItem={({ item }) => (
            <Pressable style={styles.suggestion} 
            onPress={()=>selectDestination(item)}
            >
              <Text style={styles.suggestionText}>
                  {item}
              </Text>            
            </Pressable>
          )}
          style={styles.suggestionsList}
        /> */}
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
      backgroundColor: 'white' 
    }

})