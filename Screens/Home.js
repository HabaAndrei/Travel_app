import {useState, useEffect} from 'react'
import { View, StyleSheet } from 'react-native';
import SearchDestination from '../Components/SearchDestination';
import Checkbox_activities from '../Components/Checkbox_activities';


const Home =  (props) => {

  const [checkBoxActivities, setCheckBoxActivities] = useState({isOpen: false, city: '', country: ''})
  
  return (
    <View style={styles.wrapper}>


      

      {checkBoxActivities.isOpen ? 
        <Checkbox_activities
        setCheckBoxActivities={setCheckBoxActivities}  checkBoxActivities={checkBoxActivities} 
        />
        : 
        <SearchDestination  
        setCheckBoxActivities={setCheckBoxActivities}  checkBoxActivities={checkBoxActivities} 
        /> 
      }
      
      {/* <Text onPress={()=>getData()} >Press</Text> */}
      
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

