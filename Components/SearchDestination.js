import { View, Pressable ,TextInput,  Text, FlatList, StyleSheet } from 'react-native';
import React, {useState, useEffect} from 'react'
import { Input, InputField, InputSlot, InputIcon, SearchIcon } from '@gluestack-ui/themed';
import axios from 'axios';
import {address_function_fuzzy} from '../diverse.js';



const SearchDestination = (props) => {

  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dataDestination, setDataDestination] = useState({country: '', city: ''});

  useEffect(()=>{
    if(!inputText.length){
      setSuggestions([]);
      return;
    }

    
    try{
      if(!dataDestination.country && !dataDestination.city){
        axios.post(`${address_function_fuzzy}`,
          {
            "input" : inputText, 
            "value" : "country", 
            "country" : inputText  
          }
        ).then((data)=>{
          setSuggestions(data.data);
        });
      }else if(dataDestination.country && !dataDestination.city){
        axios.post(`${address_function_fuzzy}`,
          {
            "input" : inputText, 
            "value" : "city", 
            "country" :  dataDestination.country 
          }
        ).then((data)=>{
          setSuggestions(data.data);
        });
      }
      
    }catch(err){
      console.log(err);
    }
  } , [inputText]);



  function selectDestination(place){
    if(!dataDestination.country && !dataDestination.city){
      setDataDestination((ob)=>{
        return {...ob, country: place }
      })
      setSuggestions([]);
      setInputText('');
    }else if(dataDestination.country && !dataDestination.city){
      setDataDestination((ob)=>{
        return {...ob, city: place }
      })
      props.setCheckBoxActivities({isOpen: true, city: place ,country: dataDestination.country });
    }
  }


  return (

    <View>
      
      <View style={styles.container}>
        <TextInput
          placeholder={
            dataDestination.country ? 
            "Search the city" :
            "Search the country"
          }
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          style={{
            borderWidth: 1, 
            borderColor: 'gray', 
            padding: 10, 
            borderRadius: 5,
            color: 'black',  
            backgroundColor: 'white' 
          }}
          placeholderTextColor="gray"
        />

        <FlatList
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
        />
      </View>
    </View>


    
   
  )
}

export default SearchDestination

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        elevation: 3,
        
        flex: 1,
        padding: 16,
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

})