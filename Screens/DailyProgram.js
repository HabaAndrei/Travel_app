import React, { useEffect, useState } from 'react';
import { ScrollView, Pressable, View, Clipboard, StyleSheet } from 'react-native';
import { ArrowRightIcon, CloseIcon, Card, Heading, Link, LinkText, Text, VStack, Divider, HStack, TrashIcon,RepeatIcon, CheckIcon,  Icon } from "@gluestack-ui/themed";
import {addDataToAsyncStorage, getDataFromAsyncStorage} from '../diverse.js';


const ModalDayProgram = (props) => {
  
  const [dailyProgram, setDailyProgram] = useState({data: {}, index: ''});

  useEffect( () => {
    const { data, index, apeleaza } = props.route.params;
    setDailyProgram({ data, index });
  }, []);



  const copyInClipboard = (text) => {
    Clipboard.setString(text);
  };

  async function  deleteActivity(indexActivity){
    const response = await props.areYouSureDeleting();
    if (response) {
      setDailyProgram((obiectDailyProgram)=>{
        const {activities} = obiectDailyProgram.data;
        const firstPart = activities.slice(0, indexActivity);
        const secondPart = activities.slice(indexActivity + 1, activities.length);
        const newActivities = firstPart.concat(secondPart);
        const newData = {...obiectDailyProgram.data, activities: newActivities}
        return {...obiectDailyProgram, data: newData};
      })
    }
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

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View>
        <Text style={styles.title}>{dailyProgram.data.title}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.date}>{dailyProgram.data.date}</Text>
          <Text style={styles.dayText}>Day {dailyProgram.data.day}</Text>
        </View>

        {dailyProgram?.data?.activities?.map((ob, index) => (
          <Card key={index} p="$5" borderRadius="$lg" maxWidth={360} m="$3">
            <HStack justifyContent="space-between" alignItems="center">
              <Heading mb="$1" size="md">
                {ob.place}
              </Heading>
              <Pressable onPress={() => {deleteActivity(index)}}>
                <Icon as={TrashIcon} m="$2" w="$6" h="$6" />
              </Pressable>
            </HStack>

            <Text fontSize="$sm" fontStyle="normal" fontWeight="$normal" lineHeight="$sm" mb="$2" sx={{ color: "$textLight700" }}>
              {ob.time}
            </Text>
            {ob.address ? 
              <Text size="m" style={{ marginTop: 10 }}>
                <Text bold={true}>Address: </Text> {ob.address}
                <Text style={styles.buttonText} onPress={() => copyInClipboard(`${ob.address}`)}>
                  {' '}
                  Copy
                </Text>
              </Text> : <Text></Text>
            }
            <Text size="m" style={{ marginTop: 10 }}>
              <Text bold={true}>Info:</Text> {ob.info}
            </Text>
            <Text size="m" style={{ marginTop: 10 }}>
              <Text bold={true}>Description: </Text>
              {ob.description}
            </Text>
            {ob.link ? (
              <Link href={ob.link} isExternal style={{ marginTop: 20 }}>
                <HStack alignItems="center">
                  <LinkText size="sm" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                    More details
                  </LinkText>
                  <Icon as={ArrowRightIcon} size="sm" color="$primary600" mt="$0.5" ml="$0.5" />
                </HStack>
              </Link>
            ) : (
              <Text></Text>
            )}
          </Card>
        ))}
      </View>



      <View> 
        
        <HStack h="$10" justifyContent="center" alignItems="center">
          <HStack alignItems="center"  >
            <Text  onPress={()=>pressOnCancel()} >Cancel</Text>
            <Icon as={CloseIcon} m="$2" w="$6" h="$6" />
          </HStack>

         

          <Divider  style={{ margin: 15 }}  orientation="vertical"  mx="$2.5"  bg="$indigo500"  h={25}  $dark-bg="$indigo400"/>

          <HStack alignItems="center">
            <Text onPress={()=>pressOnSave()} >Save</Text>
            <Icon as={CheckIcon} m="$2" w="$6" h="$6" />
          </HStack>
        </HStack>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
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
    paddingBottom: 20, // added padding for extra scrolling space
  },
});

export default ModalDayProgram;
