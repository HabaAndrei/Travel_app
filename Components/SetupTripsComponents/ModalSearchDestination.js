import { FlatList, Modal, StyleSheet, Text, Pressable, View, TextInput, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { address_function_fuzzy } from '../../diverse.js';
import { Spinner } from "@gluestack-ui/themed";
import CustomButton from '../../CustomElements/CustomButton.js';
import { FirebaseFirestore } from '../../firebase.js';

const ModalSearchDestination = (props) => {

  const [isMessageNotFound, setMessageNotFound] = useState(false);
  const firebaseFirestore = new FirebaseFirestore();

  useEffect(() => {
    if (!props.searchModal.inputCountry.length) return;
    props.searchModalDispatch({type: 'openModalCountry'})

    axios.post(`${address_function_fuzzy}`, {
      input: props.searchModal.inputCountry,
      value: "country",
      country: props.searchModal.inputCountry,
    })
    .then((data) => {
      openMessageNotFound(data.data);
      const list = data.data?.map((country) => ({ place: country, type: "country" }));
      props.searchModalDispatch({type: 'setSuggestions', payload: list})
    })
    .catch((err) => {
      firebaseFirestore.storeErr(err.message);
      props.addNotification("warning", "System error occurred. Please try again later.");
    });
  }, [props.searchModal.inputCountry]);

  useEffect(() => {
    if (!props.destinationActivities.country) return;
    if (!props.searchModal.inputCity.length) return;
    props.searchModalDispatch({type: 'openModalCity'})

    axios.post(`${address_function_fuzzy}`, {
      input: props.searchModal.inputCity,
      value: "city",
      country: props.destinationActivities.country,
    })
    .then((data) => {
      openMessageNotFound(data.data);
      const list = data.data?.map((country) => ({ place: country, type: "city" }));
      props.searchModalDispatch({type: 'setSuggestions', payload: list})
    })
    .catch((err) => {
      firebaseFirestore.storeErr(err.message);
      props.addNotification("warning", "System error occurred. Please try again later.");
    });
  }, [props.searchModal.inputCity]);

  function openMessageNotFound(data) {
    if (!data?.length) {
      setMessageNotFound(true);
    } else if (isMessageNotFound && data?.length) {
      setMessageNotFound(false);
    }
  }

  function selectDestination(item) {
    if (item.type === "country") {
      props.searchModalDispatch({type: 'setInputCountry', payload: ''});
      props.destinationActivitiesDispatch({type: 'setCountry', payload: item.place})
    } else if (item.type === "city") {
      props.searchModalDispatch({type: 'setInputCity', payload: ''});
      props.destinationActivitiesDispatch({type: 'setCity', payload: item.place})
    }
    props.searchModalDispatch({type: 'closeModal'});
    props.destinationActivitiesDispatch({type: 'setCheckbox', payload: []})
  }

  function closeModal() {
    props.searchModalDispatch({type: 'closeModalFull'});
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={props.searchModal.isModalVisible}
          onRequestClose={() => props.searchModalDispatch({type: 'closeModal'})}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {props.searchModal.modalData === 'country' && (
                <TextInput
                  placeholder="Country"
                  value={props.searchModal.inputCountry}
                  onChangeText={(text) => props.searchModalDispatch({type: 'setInputCountry', payload: text})}
                  style={styles.textInput}
                  placeholderTextColor="gray"
                />
              )}

              {props.searchModal.modalData === 'city' && (
                <TextInput
                  placeholder="City"
                  value={props.searchModal.inputCity}
                  onChangeText={(text) => props.searchModalDispatch({type: 'setInputCity', payload: text})}
                  style={styles.textInput}
                  placeholderTextColor="gray"
                />
              )}

              {props.searchModal.suggestions.length ? (
                <FlatList
                  data={props.searchModal.suggestions}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Pressable style={styles.suggestion} onPress={() => selectDestination(item)}>
                      <Text style={styles.suggestionText}>{item.place}</Text>
                    </Pressable>
                  )}
                  style={styles.suggestionsList}
                />
              ) : isMessageNotFound && !props.searchModal.suggestions.length ? (
                <View style={styles.spinnerContainer}>
                  <Text>This location was not found</Text>
                </View>
              ) : (
                <View style={styles.spinnerContainer}>
                  <Spinner size="large" color="$indigo600" />
                </View>
              )}
              <CustomButton name="Close" func={closeModal} />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ModalSearchDestination;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    marginTop: 40,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '70%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    color: '#333',
    backgroundColor: 'white',
    width: 250,
    marginVertical: 15,
  },
  suggestionsList: {
    marginTop: 10,
    width: '100%',
  },
  suggestion: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 5,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 250,
  },
  suggestionText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
