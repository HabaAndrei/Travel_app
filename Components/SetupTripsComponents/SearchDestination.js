import { View ,TextInput, Image, StyleSheet, Dimensions } from 'react-native';
import { useReducer } from 'react'
import ModalSearchDestination from './ModalSearchDestination.js';
import { imagePath } from '../../diverse.js';

const SearchDestination = (props) => {

  const { width } = Dimensions.get('window');
  const [searchModal, searchModalDispatch] = useReducer(searchModalReducer, {
    inputCity: '',
    inputCountry: '',
    suggestions: [],
    isModalVisible: false,
    modalData: '',
  });
  function searchModalReducer(state, action){
    const { type, payload } = action;
    switch (type) {
      case 'setInputCity': {
        return {...state, inputCity: payload }
      }
      case 'setInputCountry': {
        return {...state, inputCountry: payload }
      }
      case 'setSuggestions': {
        return {...state, suggestions: payload }
      }
      case 'openModalCity': {
        return {...state, isModalVisible: true, modalData: 'city' }
      }
      case 'openModalCountry': {
        return {...state, isModalVisible: true, modalData: 'country' }
      }
      case 'closeModal': {
        return {...state, isModalVisible: false, modalData: '' }
      }
      case 'closeModalFull': {
        return {...state, isModalVisible: false, inputCity: '', inputCountry: '' }
      }
    }
  }

  return (
    <View>
      <ModalSearchDestination
        searchModal={searchModal}
        searchModalDispatch={searchModalDispatch}
        destinationActivities={props.destinationActivities}
        destinationActivitiesDispatch={props.destinationActivitiesDispatch}
        addNotification={props.addNotification}
      />

      <TextInput
        placeholder={!props.destinationActivities.country ?
          "Country" :
          `Country - ${props.destinationActivities.country}`
        }
        value={searchModal.inputCountry}
        onChangeText={(text) => searchModalDispatch({type: 'setInputCountry', payload: text})}
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
        value={searchModal.inputCity}
        onChangeText={(text) => {
          if (!props.destinationActivities.country) return;
          searchModalDispatch({type: 'setInputCity', payload: text})
          }
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