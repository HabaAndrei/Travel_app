import { StyleSheet,SafeAreaView, View, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { address_function_ai_generation, getDataFromAsyncStorage, multiSetFromAsyncStorage } from '../diverse';
import axios from 'axios';
import { Text } from '@gluestack-ui/themed';
import NavbarProgram from '../Components/NavbarProgram';
import ListLocations from '../Components/LocationsComponents/ListLocations.js';
import { FirebaseFirestore } from '../Firebase.js';

/** Location screen => where the user sees generated locations */
const Locations = (props) => {

  const isFocused = useIsFocused();
  const [locations, setLocations] = useState([]);
  const [isRecomandation, setRecomandation] = useState(false);

  const firebaseFirestore = new FirebaseFirestore();

  useEffect(()=>{

    if(!isFocused)return;
    if(!props?.route?.params?.type && locations.length)return;
    if(!props?.route?.params?.type){
      getLocationsFromAsyncStorage();
      return;
    };

    let {city, country, selectedActivities, customActivity, type, isLocalPlaces, scaleVisit} = props?.route?.params || {};

    if(type === "getAllDataAboutLocations"){
      createLocationsAi({city, country, customActivity, selectedActivities, isLocalPlaces, scaleVisit})
      return;
    }

  }, [isFocused]);

  async function createLocationsAi({city, country, customActivity, selectedActivities, isLocalPlaces, scaleVisit}){
    setLocations([]);
    setRecomandation(false)
    axios.post(address_function_ai_generation, { generationType: 'generateLocations',
      city, country, customActivity, selectedActivities, isLocalPlaces, scaleVisit
    }).then((data)=>{
      if(data.data.isResolved){
        const urlImageCity = data?.data?.urlImageCity;
        const arrayWithLocations = data.data.data;
        const arraySelected = arrayWithLocations.map((ob)=>{
          return {...ob, selected: false}
        });
        setLocations(arraySelected);
        multiSetFromAsyncStorage([['arrayLocationsToTravel', [...arraySelected]],
          ["locationsParameter", {city, country, customActivity, selectedActivities, scaleVisit, urlImageCity}]]);
      }else{
        console.log("eroare la functia createLocationsAi ", data);
      }
    }).catch((err)=>{
      firebaseFirestore.storeErr(err.message)
      props.addNotification('warning', 'Unfortunately, we could not generate locations. System error!');
      console.log('eroare de la createLocationsAi', err, ' <<== eroare');
    })
  }

  async function getLocationsFromAsyncStorage(){
    if(locations.length)return;
    const places = await getDataFromAsyncStorage("arrayLocationsToTravel");
    if(places?.data?.length ){
      setLocations([...places.data])
    }else{
      setRecomandation(true);
    }
  }

  return (
  <SafeAreaView style={{flex: 1}}>

    <ScrollView style={{flex: 1}} >

      <NavbarProgram name={props.route.name} navigation={props.navigation} />

      {
        isRecomandation ?
        <View style={styles.indicationView}>
          <Text style={styles.indicationText}>
            The locations are generated after you complete the entire form in step 1. We need that information to generate the best locations for you.
          </Text>
        </View>
        :
        <ListLocations
          locations={locations}
          setLocations={setLocations}
          navigation={props.navigation}
          addNotification={props.addNotification}
        />
      }

    </ScrollView>

  </SafeAreaView>
  )
}
export default Locations

const styles = StyleSheet.create({
  indicationView: {
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  indicationText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
});


