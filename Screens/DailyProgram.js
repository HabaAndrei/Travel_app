import { useEffect, useState, useRef } from 'react';
import { ScrollView, View, Clipboard, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeftIcon, Text, Divider, HStack, CheckIcon,  Icon } from "@gluestack-ui/themed";
import {addDataToAsyncStorage, getDataFromAsyncStorage} from '../diverse.js';
import LocationCard from '../Components/LocationCard.js';

/** Daily Program screen => program created but not saved in database */
const DailyProgram = (props) => {

  const [dailyProgram, setDailyProgram] = useState({data: {}, index: ''});
  const indexActivity = useRef(0);

  useEffect( () => {
    const { data, index } = props.route.params;
    setDailyProgram({ data, index });
  }, []);

  const copyInClipboard = (text) => {
    Clipboard.setString(text);
  };

  async function  deleteActivity(indexActivity){
    const response = await props.areYouSure();
    if (!response)return
    setDailyProgram((obiectDailyProgram)=>{
      const {activities} = obiectDailyProgram.data;
      const firstPart = activities.slice(0, indexActivity);
      const secondPart = activities.slice(indexActivity + 1, activities.length);
      const newActivities = firstPart.concat(secondPart);
      const newData = {...obiectDailyProgram.data, activities: newActivities}
      return {...obiectDailyProgram, data: newData};
    })
  };


  async function pressOnSave(){
    const fullProgram = await getDataFromAsyncStorage("travelProgram");
    if(JSON.stringify(dailyProgram.data) === JSON.stringify(fullProgram?.data?.[dailyProgram.index])){
      props.navigation.navigate('Program', {type: "keepProgram"});
    }else{
      const actualProgram = fullProgram.data;
      let  firstPart = actualProgram?.slice(0, dailyProgram.index );
      const midPartOb = dailyProgram?.data;
      const secondPart = actualProgram?.slice(dailyProgram.index + 1, actualProgram.length);
      firstPart?.push(midPartOb);
      const newProgram = firstPart?.concat(secondPart);
      const rez = await addDataToAsyncStorage("travelProgram", newProgram);
      props.navigation.navigate('Program', {type: "getProgramAsync"});
    }
  }

  function pressOnCancel(){
    props.navigation.navigate('Program', {type: "keepProgram"});
  }

  function getTime(time){
    const timestamp = new Date(time).getTime();
    let hour = new Date(timestamp).getHours();
    let minutes = new Date(timestamp).getMinutes();
    if(JSON.stringify(minutes).length < 2)minutes = "0" + JSON.stringify(minutes);
    if(JSON.stringify(hour).length < 2)hour = "0" + JSON.stringify(hour);
    setDailyProgram((prev)=>{
      const activities = prev.data?.activities;
      let newAr = activities.map((ob, i)=>{
        if(i === indexActivity.current)ob.time = `${hour}:${minutes}`;
        return ob;
      })
      prev.data.activities = [...newAr];
      return {...prev};
    })
  }

  return (
    <SafeAreaView style={{flex: 1}} >

      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        <View>
          <Text style={styles.title}>{dailyProgram.data.title}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.date}>{new Date(dailyProgram.data.date).toString().slice(0, 15)} </Text>
            <Text style={styles.dayText}>Day {dailyProgram.data.day}</Text>
          </View>

          {dailyProgram?.data?.activities?.map((activity, index) => {
            return (
              <LocationCard
                key={index}
                place={activity.place}
                time={activity.time}
                address={activity.address}
                info={activity.info}
                description={activity.description}
                arrayWithLinkImages={activity.arrayWithLinkImages}
                website={activity.website}
                urlLocation={activity.urlLocation}
                deleteActivity={deleteActivity}
                deleteActivityParams={[index]}
                getTime={getTime}
                extraFunction={()=>{indexActivity.current = index}}
                copyInClipboard={()=>copyInClipboard(activity.address)}
              />
            )
          })}
        </View>

        <View>
          <HStack h="$10" justifyContent="center" alignItems="center">
            <HStack alignItems="center"  >
              <Icon as={ArrowLeftIcon} m="$2" w="$6" h="$6" />
              <Text bold={true} onPress={()=>pressOnCancel()} >Go back</Text>
            </HStack>

            <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$indigo500"  h={25}  $dark-bg="$indigo400"/>

            <HStack alignItems="center">
              <Text bold={true} onPress={()=>pressOnSave()} >Save changes</Text>
              <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
            </HStack>
          </HStack>
        </View>
      </ScrollView>
    </SafeAreaView >

  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  date: {
    fontSize: 16,
    color: '#777',
    marginRight: 10,
  },
  dayText: {
    fontSize: 16,
    color: '#007AFF',
  },
  scrollViewContent: {
    flexGrow: 1,
  },

});

export default DailyProgram;
