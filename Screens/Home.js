import {useState, useEffect} from 'react'
import { View, StyleSheet, Pressable, Text } from 'react-native';
import SearchDestination from '../Components/SearchDestination';
import Checkbox_activities from '../Components/Checkbox_activities';


const Home =  (props) => {

  const [checkBoxActivities, setCheckBoxActivities] = useState({isOpen: false, city: '', country: ''})
  

  function goToSchedulePage(city, country, checkbox){
    //city, country, checkbox
    props.navigation.navigate('Schedule', {city, country, checkbox})

  }

  return (
    <View style={styles.wrapper}>


      

      {checkBoxActivities.isOpen ? 
        <Checkbox_activities
        goToSchedulePage={goToSchedulePage}
        setCheckBoxActivities={setCheckBoxActivities}  checkBoxActivities={checkBoxActivities} 
        />
        : 
        <SearchDestination  
        setCheckBoxActivities={setCheckBoxActivities}  checkBoxActivities={checkBoxActivities} 
        /> 
      }
      

    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',  
    alignItems: 'center', 
    marginTop: 80,
    paddingHorizontal: 20,
  },
});

