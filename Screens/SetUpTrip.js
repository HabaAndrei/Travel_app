import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, SafeAreaView, } from 'react-native';
import { Card, Pressable, Heading, ScrollView} from '@gluestack-ui/themed';
import SearchDestination from '../Components/SearchDestination';
import CheckboxActivities from '../Components/CheckboxActivities';
import NavbarProgram from '../Components/NavbarProgram';
import CardSetUpActivities from '../Components/CardSetUpActivities.js';
import ModalInfo from '../Components/ModalInfo.js';

const SetUpTrip = (props) => {

  const [valueRadio, setValueRadio] = useState("Activities")
  const [checkBoxActivities, setCheckBoxActivities] = useState({isOpen: false, city: '', country: ''})
  const [dataDestination, setDataDestination] = useState({country: '', city: ''});
  const [checkbox, setCheckbox] = useState([]);
  const [inputSearch, setInputSearch] = useState('');
  const [isOpenModalInfo, setOpenModalInfo] = useState(true);

  useEffect(()=>{
    if(!dataDestination.country)return;
    if(checkbox.length)setCheckbox([]);
  }, [dataDestination]);


  function verifyDestinationRequest(){
    if(!dataDestination.city || !dataDestination.country){
      props.addNotification("warning", "Please choose the city and country where you want to travel to provide you with the best data.");
      return false;
    }
    if(valueRadio === 'Chat' && !inputSearch.length){
      props.addNotification("warning", "You chose to generate locations based on chat, so include some references in the chat department");
      return false;
    }
    return true;
  }

  
  function goToProgramPage(){
    if(!verifyDestinationRequest())return;
    props.navigation.navigate('Locations', {type: 'getAllDataAboutLocations' , 
      country: dataDestination.country, city: dataDestination.city, valueRadio, val: valueRadio === 'Activities' ? checkbox : inputSearch})

    ///////////////////////////////////////////////////////////
    // const city = 'Paris';
    // const country = 'France';
    // const activities = [
    //   { category: "Cultural exploration", selected: true },
    //   { category: "Historical tours", selected: true },
    //   { category: "Outdoor activities", selected: true },
    // ]

    // props.navigation.navigate('Locations', {type: 'getAllDataAboutLocations' ,country, city, checkbox: activities})

  }

  function closeCheckbox(){
    setCheckBoxActivities((prev)=>{return {isOpen:false}})
  }


  function openModalActivities(){
    if(dataDestination.city && dataDestination.country){
      setCheckBoxActivities((prev)=>{return{isOpen:true}})
    }else{
      props.addNotification("warning", "Please choose the city and country where you want to travel to provide you with the best data.");
    }
  }
  
  return (
    <SafeAreaView style={{flex: 1}} >

      <ScrollView  >

        <NavbarProgram name={props.route.name} navigation={props.navigation} />

        <ModalInfo isOpenModalInfo={isOpenModalInfo} setOpenModalInfo={setOpenModalInfo}
        mes={`Please be specific when using this input. It will generate locations that are less sought after by tourists, but known by the locals, if you don't want this, choose to use the activities generated for each location. \n E.g. \n 1. Old castles in the countryside. \n 2. The oldest breweries in the city. \n 3. The oldest families in the city. \n 4. Restaurants where locals eat \n Etc... \n\n Usually these locations are not the best to visit, but they offer you an authentic experience, for each individual location you have to accept the risks and benefits.`}
        />

        <Card p="$5" borderRadius="$lg"  m="$3" maxWidth={400} style={styles.shadow}>
          <Heading size="md" fontFamily="$heading" mb="$4">
            Where?
          </Heading>
          <SearchDestination
            setCheckBoxActivities={setCheckBoxActivities}  addNotification={props.addNotification}
            dataDestination={dataDestination} setDataDestination={setDataDestination}
          />
        </Card>
        
        <CheckboxActivities 
          dataDestination={dataDestination} 
          checkBoxActivities={checkBoxActivities} closeCheckbox={closeCheckbox}
          checkbox={checkbox} setCheckbox={setCheckbox}  addNotification={props.addNotification}
        /> 

        <CardSetUpActivities 
          valueRadio={valueRadio}
          setValueRadio={setValueRadio}
          inputSearch={inputSearch}
          setInputSearch={setInputSearch}
          openModalActivities={openModalActivities}
          addNotification={props.addNotification}
        />

        <View style={styles.buttonGo} >
          <Pressable  style={styles.buttonGoPressAc}
            onPress={goToProgramPage}> 
            <Text style={styles.text}>Create program</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  shadow:{
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonGoPressAc:{
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    height: 40,
    width: 160,
    marginBottom: 30
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  buttonGo: {
    marginTop: 30,
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },  
});

export default SetUpTrip;
