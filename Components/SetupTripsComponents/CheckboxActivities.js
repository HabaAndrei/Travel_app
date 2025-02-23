import { Modal, View, ScrollView, Text, Pressable, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Icon, CheckIcon, Textarea, VStack, TextareaInput, AlertCircleIcon, Heading, Center, RadioGroup,
  Radio, RadioIndicator, RadioIcon, CircleIcon, RadioLabel } from "@gluestack-ui/themed";
import { address_function_ai_generation } from '../../diverse.js';
import CustomButton from '../../CustomElements/CustomButton.js';
import { FirebaseFirestore } from '../../Firebase.js';

function ViewSpinner(props) {
  return (
    <>
      {!props.isActivities ? (
        <View style={styles.spinnerContainer}>
          <Spinner size="large" color="blue" />
        </View>
      ) : null}
    </>
  );
}

function ViewActivities(props){
  return (
    <>
      {props.isActivities ? props.children : null}
    </>
  )
}

/** Component that displays all activities a tourist can do in a specific location */
const CheckboxActivities = (props) => {

  const [isShowDetails, setShowDetails] = useState(false);
  const [paramsLocation, setParamsLocation] = useState(false)
  const firebaseFirestore = new FirebaseFirestore();

  useEffect(() => {
    createActivities();
  }, [props.destinationActivities.isOpenModalActivities]);

  // Create activities using AI
  function createActivities(){
    const { city, country } = props.destinationActivities;
    if (!props.destinationActivities.isOpenModalActivities || props.destinationActivities.checkbox.length) return;
    axios.post(address_function_ai_generation, {
      generationType: 'generateActivities', city, country
    }).then((data) => {
      if (data.data.isResolved) {
        if(data?.data?.paramsLocation?.data){
          setParamsLocation(data?.data?.paramsLocation?.data?.local_places_and_tourist_places);
          props.destinationActivitiesDispatch({type: 'setScaleVisit', payload: data?.data?.paramsLocation?.data?.scale_visit})
        }

        const parsedDate = typeof(data?.data?.data) === 'string' ? JSON.parse(data?.data?.data) : data?.data?.data;
        const checkbox = parsedDate.activities.map((a) => {
          let word = a[0]?.toUpperCase() + a.slice(1, a.length);
          return { selected: false, category: word };
        });
        props.destinationActivitiesDispatch({type: 'setCheckbox', payload: checkbox})
      } else {
        props.closeCheckbox();
        props.addNotification("warning", "Unfortunately, we could not generate activities.");
      }
    }).catch((err) => {
      firebaseFirestore.storeErr(err.message)
      props.closeCheckbox();
      props.addNotification("warning", "Unfortunately, we could not generate activities. System error!");
    });
  }

  // Select or deselect the activity
  function pressOnOption(index) {
    const updatedCheckbox = props.destinationActivities.checkbox;
    updatedCheckbox[index].selected = !updatedCheckbox[index].selected;
    props.destinationActivitiesDispatch({type: 'setCheckbox', payload: updatedCheckbox})
  }

  // The client has the option to write in an input the activities they want to visit, a custom activity
  function setCustomActivity(text){
    props.destinationActivitiesDispatch({type: 'setCustomActivity', payload: text})
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.destinationActivities.isOpenModalActivities}
      >

        <ViewSpinner
          style={styles.spinnerContainer}
          isActivities={props.destinationActivities.checkbox.length}
        />

        <ViewActivities isActivities={props.destinationActivities.checkbox.length} >
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Center>
                <Heading>Choose your activities for the next trip</Heading>
              </Center>
              {props.destinationActivities.checkbox.map((item, index) => {
                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.pressable,
                      item.selected && styles.pressableSelected
                    ]}
                    onPress={() => pressOnOption(index)}
                  >
                    <Text style={[styles.text, styles.textCenter]}>
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

              <View style={styles.viewCard}>
                <Pressable onPress={() => setShowDetails(!isShowDetails)} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text style={[styles.text, styles.textBold]}>Write your custom activities</Text>
                  <Icon
                    as={AlertCircleIcon}
                    color="blue"
                    $dark-color="$success300"
                    style={{ marginLeft: 5 }}
                  />
                </Pressable>
                <Text style={isShowDetails ? styles.explanationText : ''}>
                  {isShowDetails ? 'Write here everything you want to visit, including activities or specific places' : ''}
                </Text>
                <KeyboardAvoidingView style={{ flex: 1, minWidth: 250 }} behavior="position">
                  <Textarea style={{ backgroundColor: 'white', borderRadius: 15 }}>
                    <TextareaInput
                      placeholder="Example: The oldest breweries in the city"
                      value={props.destinationActivities.customActivity}
                      onChangeText={(text) => setCustomActivity(text)}
                    />
                  </Textarea>
                </KeyboardAvoidingView>
              </View>

              {paramsLocation ?
                <View style={styles.viewCard}>
                  <View style={{alignItems: 'center', justifyContent: 'center' }} >
                    <Text style={[styles.text, styles.textBold]}>Choose Your Experience</Text>
                  </View>
                  <Center>
                    <RadioGroup style={{marginTop: 10, marginBottom: 10}} value={props.isLocalPlaces} onChange={props.setLocalPlaces}>
                      <VStack space="sm">
                        <Radio value="true">
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} />
                          </RadioIndicator>
                          <RadioLabel>Local Favorites</RadioLabel>
                        </Radio>
                        <Radio value="false">
                          <RadioIndicator mr="$2">
                            <RadioIcon as={CircleIcon} />
                          </RadioIndicator>
                          <RadioLabel>Popular Tourist Spots</RadioLabel>
                        </Radio>
                      </VStack>
                    </RadioGroup>
                  </Center>
                </View> : null
              }
            </ScrollView>

            <CustomButton name={'Close'} func={props.closeCheckbox}/>

          </View>
        </ViewActivities>

      </Modal>
    </View>
  );
}

export default CheckboxActivities;

const styles = StyleSheet.create({
  viewCard: {
    padding: 20,
    margin: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  explanationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  textBold: {
    fontWeight: 'bold',
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
    minWidth: 250
  },
  pressableSelected: {
    backgroundColor: '#e0e0e0',
    borderColor: '#007BFF',
    borderWidth: 1,
  },
  text: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textCenter: {
    textAlign: 'center',
    flex: 1,
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
    borderRadius: 15,
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
