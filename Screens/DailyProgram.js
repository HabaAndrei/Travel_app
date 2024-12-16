import { useEffect, useState, useRef } from 'react';
import { ScrollView, Pressable, View, Clipboard, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeftIcon, Card, Heading, Link, LinkText, Text, VStack, Divider, HStack, TrashIcon, CheckIcon,  Icon } from "@gluestack-ui/themed";
import {addDataToAsyncStorage, getDataFromAsyncStorage} from '../diverse.js';
import TimePicker from '../Components/TimePicker.js';
import ImageCarousel from '../Components/ImageCarousel.js';


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
    const response = await props.areYouSureDeleting();
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

          {dailyProgram?.data?.activities?.map((ob, index) => {
            return <Card key={index} p="$5" borderRadius="$lg" maxWidth={400} m="$3">
              <HStack justifyContent="space-between" alignItems="center">
                <Heading mb="$1" size="md">
                  {ob.place}
                </Heading>
                <Pressable onPress={() => {deleteActivity(index)}}>
                  <Icon as={TrashIcon} m="$2" w="$6" h="$6" />
                </Pressable>
              </HStack>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text  style={{marginRight: 30}} fontSize="$sm" fontStyle="normal" fontWeight="$normal" lineHeight="$sm" mb="$2" sx={{ color: "$textLight700" }}>
                  {ob.time}
                </Text>
                <TimePicker
                  getTime={getTime} extraFunction={()=>{indexActivity.current = index}}
                />
              </View>

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

              <View style={{ flex: 1, marginTop: 20 }}>
                {ob.arrayWithLinkImages.length ?
                <ImageCarousel   imageUrls={ob.arrayWithLinkImages }/> :
                <View></View>
                }
              </View>

              <VStack space="md" justifyContent='center' alignItems='center'>
                <HStack h='$10' justifyContent='center' alignItems='center'>
                  <Link href={ob.website ? ob.website : ''} isExternal>
                    <HStack alignItems="center">
                      <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                        {ob.website ? 'Visit their website' : '' }
                      </LinkText>
                    </HStack>
                  </Link>
                  {ob.urlLocation && ob.website ?
                  <Divider orientation="vertical" mx='$2.5' bg='$emerald500' h={15} />:
                  <View></View>
                  }
                  <Link href={ob.urlLocation ? ob.urlLocation : ''} isExternal>
                    <HStack alignItems="center">
                      <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                        {ob.urlLocation ? 'Google location' : ''}
                      </LinkText>
                    </HStack>
                  </Link>
                </HStack>
              </VStack>
            </Card>
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
  },

});

export default DailyProgram;
