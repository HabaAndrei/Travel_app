import { Modal, View, ScrollView, Text, Pressable, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Button, ButtonText, Icon, CheckIcon, SearchIcon, Textarea, TextareaInput, AlertCircleIcon, } from "@gluestack-ui/themed";
import { address_function_api } from '../diverse.js';

const CheckboxActivities = (props) => {

  const [isShowDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const { city, country } = props.dataDestination;
    const { isOpen } = props.checkBoxActivities;
    if (isOpen) {
      if (props.checkbox.length) return;
      axios.post(`${address_function_api}`, 
        { method: 'createActivities', city, country }
      ).then((data) => {
        if (data.data.type) {
          let arVariants = Object.values(JSON.parse(data?.data?.data));
          props.setCheckbox(arVariants.map((a) => {
            let word = a[0].toUpperCase() + a.slice(1, a.length);
            return { selected: false, category: word };
          }));
        } else {
          props.closeCheckbox();
          props.addNotification("warning", "Unfortunately, we could not generate activities.");
        }
      }).catch((err) => {
        props.closeCheckbox();
        props.addNotification("warning", "Unfortunately, we could not generate activities. System error!");
        console.log(err);
      });
    }
  }, [props.checkBoxActivities]);

  function pressOnOption(index) {
    props.setCheckbox((prev) => {
      const updatedCheckbox = [...prev];
      updatedCheckbox[index].selected = !updatedCheckbox[index].selected;
      return updatedCheckbox;
    });
  }

  return (
    <View>
      {props.checkBoxActivities.isOpen ? 
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={props.checkBoxActivities.isOpen}
          >
            {props.checkbox.length ? 
              <View style={styles.modalView}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                  {props.checkbox.map((item, index) => {
                    return (
                      <Pressable
                        key={index}
                        style={[
                          styles.pressable, 
                          item.selected && styles.pressableSelected
                        ]}
                        onPress={() => pressOnOption(index)}
                      >
                        <Text style={styles.text}>
                          {item.category}
                        </Text>
                        {item.selected ? 
                          <Icon as={CheckIcon} style={styles.icon} />
                          :
                          <View style={styles.iconPlaceholder}></View>
                        }
                      </Pressable>
                    );
                  })}

                  <Pressable onPress={()=>setShowDetails(!isShowDetails)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Chat</Text>
                    <Icon
                      as={AlertCircleIcon}
                      color="blue"
                      $dark-color="$success300"
                      style={{ marginLeft: 5 }} 
                    />
                  </Pressable>
                  <Text style={styles.explanationText} >{isShowDetails ? 'Write here everything you want to visit, including activities or specific places' : ''}</Text>
                  <KeyboardAvoidingView style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? 60 : 0, minWidth: 270}} behavior="position">
                    <Textarea >
                      <TextareaInput 
                        placeholder="Example: The oldest breweries in the city"
                        value={props.inputActivity}
                        onChangeText={(text) => props.setInputActivity(text)}
                      />
                    </Textarea>
                  </KeyboardAvoidingView>
                </ScrollView>
                <Button onPress={() => { props.closeCheckbox() }} style={styles.button}>
                  <ButtonText>
                    <Icon as={SearchIcon} style={styles.searchIcon} />
                  </ButtonText>
                </Button>
              </View>
              : 
              <View style={styles.spinnerContainer}>
                <Spinner color="$indigo600" />
              </View>
            }
          </Modal>
        </View>
      : <View></View>
      }
    </View>
  );
}

export default CheckboxActivities;

const styles = StyleSheet.create({
  explanationText: {
    fontSize: 14,
    color: '#666', 
    textAlign: 'center', 
    marginVertical: 10, 
    paddingHorizontal: 20, 
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 10, 
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    minWidth: 270
  },
  pressableSelected: {
    backgroundColor: '#e0e0e0',
    borderColor: '#007BFF',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  icon: {
    width: 24,
    height: 24,
    color: '#007BFF',
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
  },
  button: {
    margin: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchIcon: {
    color: '#fff',
    marginHorizontal: 5,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    margin: 20,
    marginTop: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0, 
    alignItems: 'center',
    maxHeight: '85%', 
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 10,
  },
});
