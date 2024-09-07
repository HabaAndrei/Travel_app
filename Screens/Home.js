import {useState, useEffect} from 'react'
import { View, StyleSheet } from 'react-native';
import SearchDestination from '../Components/SearchDestination';
import Checkbox_activities from '../Components/Checkbox_activities';


const Home =  (props) => {

  const [checkBoxActivities, setCheckBoxActivities] = useState({isOpen: false, city: '', country: ''})
  
  // onPress={() =>
  // navigation.navigate('Test', {name: 'Test', 'parametru': {'oras': 'Brasov '}})
// }


  // trebuie sa caut o varianta in care sa trimit navigate prin props, dar cred ca nu se poate!!!!!!!!!!!


  // console.log(props.navigation)
  return (
    <View style={styles.wrapper}>


      

      {checkBoxActivities.isOpen ? 
        <Checkbox_activities
        navigation={props.natigation}
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

