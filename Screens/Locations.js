import { StyleSheet,SafeAreaView, View, ScrollView, Pressable, Dimensions } from 'react-native'
import {useState, useEffect} from 'react'
import { useIsFocused } from '@react-navigation/native';
import {address_function_api, getDataFromAsyncStorage, addDataToAsyncStorage,
  multiSetFromAsyncStorage, formatDateFromMilliseconds} from '../diverse';
import axios from 'axios';
import { Card, HStack, Heading, Center, Text, Link, Divider, LinkText, Spinner,
  VStack, ArrowLeftIcon, CheckIcon, Icon,
} from '@gluestack-ui/themed';
import NavbarProgram from '../Components/NavbarProgram';
import ImageCarousel from '../Components/ImageCarousel';
import CardDatePicker from '../Components/CardDatePicker';
import CustomButton from '../CustomElements/CustomButton.js';
import ListPackeges from '../Components/ListPackeges.js';
import {FirebaseFirestore} from '../firebase.js';

const Locations = (props) => {

  const isFocused = useIsFocused();
  const [locations, setLocations] = useState([]);
  const [isRecomandation, setRecomandation] = useState(false);
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();

  const firebaseFirestore = new FirebaseFirestore();
  const screenHeight = Dimensions.get('window').height;

  useEffect(()=>{

    if(!isFocused)return;

    if(!props?.route?.params?.type && locations.length)return;

    if(!props?.route?.params?.type){
      getLocationsFromAsyncStorage();
      return;
    };

    let {city, country, checkbox, input, type, isLocalPlaces, scaleVisit} = props?.route?.params;

    if(type === "getAllDataAboutLocations"){
      createLocationsAi('seeAllPlaces', city, country, input, checkbox, isLocalPlaces, scaleVisit)
      return;
    }

  }, [isFocused]);

  async function createLocationsAi( method, city, country, input, checkbox, isLocalPlaces, scaleVisit){
    setLocations([]);
    setRecomandation(false)
    axios.post(`${address_function_api}`,
      {method, city, country, input, checkbox, isLocalPlaces, scaleVisit}
    ).then((data)=>{
      if(data.data.isResolved){
        const arrayWithLocations = data.data.data;
        const arraySelected = arrayWithLocations.map((ob)=>{
          return {...ob, selected: false}
        });
        setLocations(arraySelected);
        multiSetFromAsyncStorage([['arrayLocationsToTravel', [...arraySelected]],
          ["locationsParameter", {city, country, input, checkbox, scaleVisit}]]);
      }else{
        console.log("eroare la functia createLocationsAi ", data);
      }
    }).catch((err)=>{
      firebaseFirestore.storeErr(err.message)
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

  function pressOnLocations(index_){
    setLocations((prev)=>{
      const newAr = prev.map((ob, index)=>{
        if(index === index_){
          return {...ob, selected : !ob.selected}
        }else{
          return ob;
        }
      })
      return newAr;
    })
  }


  function pressOnCancel(){
    props.navigation.navigate('SetupTrip');
  }

  function verifyDestinationRequest(){
    if(!dateFrom || !dateTo){
      props.addNotification("warning", "Please choose the start and end date of the trip.");
      return false
    }
    if((new Date(dateTo)).getTime() < (new Date(dateFrom)).getTime()){
      props.addNotification("warning", "Please choose the start date to be smaller than the end date.");
      return false
    }
    return true;
  }


  async function goToCreateProgram(){
    ////////////////////////////////////////////////////////////////
    // decomentez aceasta in prod ==>>>

    // if(!verifyDestinationRequest())return;

    // decomentez aceasta in prod  <<<<=======
    ////////////////////////////////////////////////////////////////
    addDataToAsyncStorage('arrayLocationsToTravel', locations)
    const newLocationReference = JSON.parse(JSON.stringify(locations));
    const selectedLocations = [...newLocationReference].filter((place)=>place.selected);
    if(!selectedLocations.length){
      props.addNotification('warning', 'You do not have any location selected to make the trip');
      return;
    }
    const data = [...selectedLocations].map((ob)=>{
      const {dataTimeLocation} = ob;
      if(!dataTimeLocation)return ob;
      const {packages} = dataTimeLocation;
      if(!packages || !Object.entries(packages).length)return ob;
      let newPackeges = {};
      let num = 1;
      let hours = 0;
      Object.values(packages).forEach((ob)=>{
        if(!ob.selected)return;
        newPackeges[num] = ob;
        hours += ob?.average_visiting_hours
        num++;
      })
      if(hours > 0){
        ob.dataTimeLocation.average_hours_visiting_full_location = hours;
      }
      ob.dataTimeLocation.packages = newPackeges;
      return ob;
    })

    const dataParam = await getDataFromAsyncStorage('locationsParameter');
    if(!dataParam.isResolved){
      props.addNotification('error', 'Error submitting for program search');
      return;
    }
    const locationParam = dataParam.data;
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    // fac si aici schimbarea in pod =>>>>>>>>>>

    // locationParam.from = formatDateFromMilliseconds(dateFrom);
    // locationParam.to = formatDateFromMilliseconds(dateTo)
    locationParam.from = formatDateFromMilliseconds(1707602400000);
    locationParam.to = formatDateFromMilliseconds(1718053200000)
    props.navigation.navigate('Program', {type: 'createProgram', locations: data, locationParam});

    // fac si aici schimbarea in pod <<<<<<<<<<===========
    /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////

  }

  function selectPackage(indexLocation, indexPackage){
    try{
      setLocations((prev)=>{
        const selected = prev[indexLocation].dataTimeLocation.packages[indexPackage + 1].selected
        prev[indexLocation].dataTimeLocation.packages[indexPackage + 1].selected = !selected;
        return [...prev];
      })
    }catch(err){
      props.addNotification('error', 'There was a problem selecting the package');
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
        <ScrollView>
          {!locations?.length ? (
          <View style={{ marginTop: screenHeight / 3, }}>
            <Center  >
              <Spinner color="$indigo600" />
            </Center>
          </View>
          ) : (

          <View>
            <Center>
              <Heading size="md" fontFamily="$heading" mb="$4">
                Select the locations you would like to visit
              </Heading>
            </Center>

            {locations.map((location, index) =>{
              return <Card key={index} p="$5" borderRadius="$lg" maxWidth={400} m="$3"
              style={[ styles.cardPressable, location.selected && styles.selectedCard ]} >
                <Heading size="md" fontFamily="$heading" mb="$4">
                  {location.name}
                </Heading>

                <View style={{ flex: 1, marginTop: 20 }}>
                  {location.arrayWithLinkImages.length ?
                  <ImageCarousel  imageUrls={location.arrayWithLinkImages}/>:
                  null
                  }
                </View>

                <VStack space="md" justifyContent='center' alignItems='center'>
                  <HStack h='$10' justifyContent='center' alignItems='center'>
                    <Link href={location.website ? location.website : ''} isExternal>
                      <HStack alignItems="center">
                        <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                          {location.website ? 'Visit their website' : '' }
                        </LinkText>
                      </HStack>
                    </Link>
                    {location.urlLocation && location.website ?
                    <Divider orientation="vertical" mx='$2.5' bg='$emerald500' h={15} />:
                    <View></View>
                    }
                    <Link href={location.urlLocation ? location.urlLocation : ''} isExternal>
                      <HStack alignItems="center">
                        <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                          {location.urlLocation ? 'Google location' : ''}
                        </LinkText>
                      </HStack>
                    </Link>
                  </HStack>
                </VStack>

                <Center>
                  <CustomButton name={location.selected ? 'Remove location from your visit' : 'Pick location for your visit'}
                    func={pressOnLocations} paramFunc={index}
                  />
                </Center>

                {location?.dataTimeLocation && location?.selected ?
                  <ListPackeges dataTimeLocation={location.dataTimeLocation} indexLocation={index} selectPackage={selectPackage} />
                  : null
                }

              </Card>
            })}

            <CardDatePicker
              setDateTo={setDateTo} dateTo={dateTo}
              setDateFrom={setDateFrom} dateFrom={dateFrom}
            />

            <View>
              <HStack h="$10" justifyContent="center" alignItems="center">
                <HStack alignItems="center"  >
                  <Icon as={ArrowLeftIcon} m="$2" w="$6" h="$6" />
                  <Text bold={true} onPress={()=>pressOnCancel()} >Go back</Text>
                </HStack>

                <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$indigo500"  h={25}  $dark-bg="$indigo400"/>

                <HStack alignItems="center">
                  <Text bold={true} onPress={()=>goToCreateProgram()} >Create program</Text>
                  <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
                </HStack>
              </HStack>
            </View>
          </View>
          )}
        </ScrollView>
      }
    </ScrollView>
  </SafeAreaView>
  )
}
export default Locations

const styles = StyleSheet.create({
  viewButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  fullTourPress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fullTourText: {
    marginRight: 10,
    fontSize: 16,
    color: '#333',
  },
  cardPressable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectedCard: {
    backgroundColor: '#ADD8E6',
  },
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


