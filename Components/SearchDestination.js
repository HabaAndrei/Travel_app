import { View, TextInput,Pressable , Text, FlatList, StyleSheet } from 'react-native';
import React, {useState, useEffect} from 'react'
import Fuse from "fuse.js";
import {countries} from '../country_capital';
import { Input, InputField,  } from '@gluestack-ui/themed';

const SearchDestination = (props) => {

  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
 


  const options = {
    includeScore: true,
    includeMatches: true,
    threshold: 0.2,
    keys: ["capital", "name"]
  }
  const fuse = new Fuse(countries, options);
 

  useEffect(()=>{
    const results = fuse.search(inputText);
    const items = results.map((result) => result.item);
    setSuggestions(items.slice(0 , 5));
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
                  {item.name} {"   "} {item.capital}
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