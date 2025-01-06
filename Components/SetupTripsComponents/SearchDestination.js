import { View ,TextInput, Image, StyleSheet, Dimensions, Text } from 'react-native';
import {useState, useEffect} from 'react'
import ModalSearchDestination from './ModalSearchDestination.js';
import { imagePath } from '../../diverse.js';

const SearchDestination = (props) => {

  const [inputCity, setInputCity] = useState('');
  const [inputCountry, setInputCountry] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [modalVisible, setModalVisible] = useState({type: false, data:''});
  const { width } = Dimensions.get('window');

  return (
    <View>
      <ModalSearchDestination
        destinationActivitiesDispatch={props.destinationActivitiesDispatch}
        destinationActivities={props.destinationActivities}
        modalVisible={modalVisible} setModalVisible={setModalVisible}
        inputCity={inputCity} setInputCity={setInputCity}
        inputCountry={inputCountry} setInputCountry={setInputCountry}
        suggestions={suggestions} setSuggestions={setSuggestions}
        addNotification={props.addNotification}
      />

      <TextInput
        placeholder={!props.destinationActivities.country ?
          "Country" :
          `Country - ${props.destinationActivities.country}`
        }
        value={inputCountry}
        onChangeText={(text) => setInputCountry(text)}
        style={styles.textInput}
        placeholderTextColor="gray"
      />

      <View style={styles.img}>
        <Image
          style={{height: 150,  width: width * 0.85, borderRadius: 10,}}
            source={imagePath}
        />
      </View>

      <TextInput
        placeholder={!props.destinationActivities.city ?
          "City" :
          `City - ${props.destinationActivities.city}`
        }
        value={inputCity}
        onChangeText={(text) => {
          if(!props.destinationActivities.country)return;
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
  },
  img: {
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 15,
  }

})