import { View, TextInput,Pressable , Text, FlatList, StyleSheet } from 'react-native';
import React, {useState, useEffect} from 'react'
import Fuse from "fuse.js";
import { Input, InputField,  } from '@gluestack-ui/themed';
import axios from 'axios';
import {address_function_fuzzy} from '../diverse.js';



const SearchDestination = (props) => {

  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
 

  useEffect(()=>{
    try{
      axios.post(`${address_function_fuzzy}`,
        {
          "input" : inputText, 
          "value" : "country", 
          "country" : inputText  
        }
      ).then((data)=>{
        setSuggestions(data.data);
      });
    }catch(err){
      console.log(err);
    }
  } , [inputText]);

  function selectDestination(country, capital){
    
    props.setCheckBoxActivities({isOpen: true, city: capital, country});
   
  }


  return (

    <View>
      
      <View style={styles.container}>
        <Input>
          <InputField
            placeholder="Search your destination"
            value={inputText}
            onChangeText={(text) => setInputText(text)}
            />
        </Input>
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => {
            return index;
          }}
          renderItem={({ item }) => (
            <Pressable style={styles.suggestion} onPress={()=>selectDestination(item.name, item.capital)}>
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