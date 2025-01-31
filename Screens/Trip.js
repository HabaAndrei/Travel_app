import { StyleSheet, View, Pressable, ScrollView, Clipboard, SafeAreaView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, AccordionTitleText,  AccordionTrigger,  AccordionHeader, AccordionContent,
	AccordionItem, Accordion, AddIcon, Card, Heading, Icon, TrashIcon, HStack, VStack, LinkText, Link, Divider, Center, RemoveIcon
} from '@gluestack-ui/themed';
import ImageCarousel from '../Components/ImageCarousel.js';
import {FirebaseFirestore} from '../Firebase.js';
import TimePicker from '../Components/Pickers/TimePicker.js';
import DatePicker from '../Components/Pickers/DatePicker';
import { formatDateFromMilliseconds } from '../diverse';
import ModalAddNewDay from '../Components/TripsComponents/ModalAddNewDay.js';
import openMap from 'react-native-open-maps';
import InputHotelAddress from '../Components/TripsComponents/InputHotelAddress.js';

/** Trip screen => where the client can see a selected trip */
const Trip = (props) => {

  const isFocused = useIsFocused();
  const [tripProgram, setTripProgram] = useState([]);
  const [isModalVisible, setModalVisible] = useState({ type: false });
  const indexDay = useRef(0);
  const indexActivityRef = useRef(0);
  const [hotelAddressTrip, setHotelAddressTrip] = useState('');

  const firebaseFirestore = new FirebaseFirestore();

  useEffect(() => {
    if (!isFocused || !props?.route?.params?.program) return;
    let { city, country, startDate, endDate, id, program, hotelAddress } = props.route.params;
    if (typeof program === 'string') program = JSON.parse(program);
    setTripProgram(program);
    setHotelAddressTrip(hotelAddress);
  }, [isFocused]);

  const copyInClipboard = (text) => {
    Clipboard.setString(text);
  };

  async function deleteActivity(index, indexActivity) {
    const response = await props.areYouSure();
    if (!response) return;
    let newProgram = [...tripProgram];
    let { activities } = newProgram[index];
    const firstPart = activities.slice(0, indexActivity);
    const secondPart = activities.slice(indexActivity + 1, activities.length);
    const newActivities = firstPart.concat(secondPart);
    newProgram[index].activities = newActivities;
    const id = props.route.params.id;
    if (!id) {
      props.addNotification('error', 'There is a problem deleting the activity');
      return;
    }
    saveProgramIntoDB(id, newProgram);
    setTripProgram((prev) => {
      return [...newProgram];
    });
  }


  async function handleConfirmTime(time) {
    const timestamp = new Date(time).getTime();
    let hour = new Date(timestamp).getHours();
    let minutes = new Date(timestamp).getMinutes();
    if (JSON.stringify(minutes).length < 2) minutes = "0" + JSON.stringify(minutes);
    if (JSON.stringify(hour).length < 2) hour = "0" + JSON.stringify(hour);
    let program = [...tripProgram];
    program[indexDay.current].activities[indexActivityRef.current].time = `${hour}:${minutes}`;
    const id = props.route.params.id;
    if (!id) {
      props.addNotification('error', 'There is a problem when updating the time');
      return;
    }
    saveProgramIntoDB(id, program);
    setTripProgram((prev) => {
      return [...program];
    });
  };

  async function confimNewDate(date) {
    const data = formatDateFromMilliseconds(date);
    const newProgram = JSON.parse(JSON.stringify(tripProgram));
    newProgram[indexDay.current].date = data;
    const id = props.route.params.id;
    if (!id) {
      props.addNotification('error', 'There is a problem when updating the date');
      return;
    }
    saveProgramIntoDB(id, newProgram);
    setTripProgram((prev) => {
      return [...newProgram];
    });
  }

  function saveNewLocation(name, address, info, description, time) {
    const index = isModalVisible.index;
    let program = [...tripProgram];
    program[index].activities.push({
      place: name ? name : '',
      address: address ? address : '',
      info: info ? info : '',
      description: description ? description : '',
      time: time ? time : '',
    });
    program[index].activities.sort((a, b) => {
      if (a.time > b.time) {
        return 1;
      } else if (a.time < b.time) {
        return -1;
      } else {
        return 0;
      }
    });
    const id = props.route.params.id;
    if (!id) {
      props.addNotification('error', 'There is a problem when updating the date');
      return;
    }
    saveProgramIntoDB(id, program);
    setTripProgram(program);
    setModalVisible({ type: false });
  }

  async function saveProgramIntoDB(idProgramIntoDb, program) {
    program.sort((a, b) => {
      if (a.date > b.date) {
        return 1;
      } else if (a.date < b.date) {
        return -1;
      } else {
        return 0;
      }
    });
    program = program.map((obDay, index) => {
      obDay.day = index + 1;
      const activitiesSorted = obDay.activities.sort((a, b) => {
        if (a.time > b.time) {
          return 1;
        } else if (a.time < b.time) {
          return -1;
        } else {
          return 0;
        }
      });
      obDay.activities = activitiesSorted;
      return obDay;
    });
    const startDate = formatDateFromMilliseconds(new Date(program[0].date).getTime());
    const endDate = formatDateFromMilliseconds(new Date(program[program.length - 1].date).getTime());
    // update program in database
    const rez = await firebaseFirestore.updateColumnsDatabase({
      database: 'programs',
      id: idProgramIntoDb,
      columnsWithValues: { startDate, endDate,  programDaysString: JSON.stringify(program) }
    });
    if (!rez.isResolved) {
      console.log('Error saving program:', rez.err);
    }
  }

  function strLatLngMaps(ob) {
    const { lat, lng } = ob?.geometry_location;
    return [lat, lng].join(',');
  }

  function _openMap(indexLocation) {
    let { program } = props.route.params;
    if (typeof program === 'string') program = JSON.parse(program);
    const locGeo = program[indexLocation].activities.filter((ob) => ob?.geometry_location);
    if (locGeo.length === 1) {
      const place = strLatLngMaps(locGeo[0]);
      openMap({ start: place, end: place });
    } else if (locGeo.length === 2) {
      openMap({ start: strLatLngMaps(locGeo[0]), end: strLatLngMaps(locGeo[1]) });
    } else if (locGeo.length > 2) {
      const first = locGeo[0];
      const mid = locGeo.slice(1, locGeo.length - 1);
      const last = locGeo[locGeo.length - 1];
      const addressWaypoints = mid.map((ob) => strLatLngMaps(ob));
      openMap({ start: strLatLngMaps(first), waypoints: addressWaypoints, end: strLatLngMaps(last) });
    }
  }

  return (
  <SafeAreaView style={{ flex: 1 }}>

    <ScrollView>

      <View style={styles.container}>
        <Text style={styles.title}>
          {props.route.params.country} - {props.route.params.city}
        </Text>
      </View>

      <InputHotelAddress
        hotelAddress={hotelAddressTrip}
        setHotelAddress={setHotelAddressTrip}
        idFromDatabase={props.route.params?.id}
      />

      <ModalAddNewDay
        saveNewLocation={saveNewLocation}
        addNotification={props.addNotification}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />

      <Accordion width="100%" maxWidth={900} shadowColor="transparent">
        {tripProgram.map((dayProgram, index) => {
          return <AccordionItem key={index} value={'item-' + (index + 1)} style={{ marginBottom: 10, marginTop: 10 }}>
            <AccordionHeader>
              <AccordionTrigger style={{ backgroundColor: '#D3D3D3', borderRadius: 10 }}>
                {({ isExpanded }) => {
                  return (
                    <>
                      <AccordionTitleText>
                        Day {dayProgram.day} - {dayProgram.title}
                      </AccordionTitleText>
                      {isExpanded ? (
                        <Icon as={RemoveIcon} m="$2" w="$4" h="$4" />
                      ) : (
                        <Icon as={AddIcon} m="$2" w="$4" h="$4" />
                      )}
                    </>
                  )
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>

              <Center>
                <Heading>
                  {new Date(dayProgram.date).toString().slice(0, 15)}
                </Heading>

                <Link onPress={() => _openMap(index)} isExternal>
                  <HStack alignItems="center">
                    <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                      See all trip in google maps 🗺
                    </LinkText>
                  </HStack>
                </Link>
              </Center>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 }}>
                <DatePicker
                  getDate={confimNewDate}
                  extraFunction={()=>indexDay.current = index}
                />
                <Link onPress={() => { setModalVisible({ type: true, index }) }}>
                  <HStack alignItems="center">
                    <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                      Add new Location
                    </LinkText>
                    <Icon as={AddIcon} color="blue" m="$2" w="$4" h="$4" />
                  </HStack>
                </Link>
              </View>

              {dayProgram.activities.map((obActivity, indexActivity) => {
                return <Card key={indexActivity} maxWidth={800} style={{ marginBottom: 15 }}>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Heading mb="$1" size="md">
                      {obActivity.place}
                    </Heading>
                    <Pressable onPress={() => { deleteActivity(index, indexActivity) }}>
                      <Icon as={TrashIcon} m="$2" w="$6" h="$6" />
                    </Pressable>
                  </HStack>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 30 }} fontSize="$sm" fontStyle="normal" fontWeight="$normal" lineHeight="$sm" mb="$2" sx={{ color: "$textLight700" }}>
                      {obActivity.time}
                    </Text>
                    <TimePicker
                      getTime={handleConfirmTime}
                      extraFunction={()=>{
                        indexActivityRef.current = indexActivity;
                        indexDay.current = index;
                      }}
                    />
                  </View>

                  {obActivity?.address ?
                    <Text size="m" style={{ marginTop: 10 }}>
                      <Text bold={true}>Address: </Text> {obActivity.address}
                      <Text style={styles.buttonText} onPress={() => copyInClipboard(`${obActivity.address}`)}>
                        {' '}
                        Copy
                      </Text>
                    </Text> : <Text></Text>
                  }

                  {obActivity.info ?
                    <Text size="m" style={{ marginTop: 10 }}>
                      <Text bold={true}>Info:</Text>
                      {obActivity.info}
                    </Text> : <Text></Text>
                  }

                  {obActivity.description ?
                    <Text size="m" style={{ marginTop: 10 }}>
                      <Text bold={true}>Description: </Text>
                      {obActivity.description}
                    </Text> : <Text></Text>
                  }

                  <View style={{ flex: 1, marginTop: 20 }}>
                    {obActivity?.arrayWithLinkImages?.length ?
                      <ImageCarousel imageUrls={obActivity.arrayWithLinkImages} /> :
                      <View></View>
                    }
                  </View>

                  <VStack space="md" justifyContent='center' alignItems='center'>
                    <HStack h='$10' justifyContent='center' alignItems='center'>
                      <Link href={obActivity.website ? obActivity.website : ''} isExternal>
                        <HStack alignItems="center">
                          <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                            {obActivity.website ? 'Visit their website' : ''}
                          </LinkText>
                        </HStack>
                      </Link>
                      {obActivity?.urlLocation && obActivity?.website ?
                        <Divider orientation="vertical" mx='$2.5' bg='$emerald500' h={15} /> :
                        <View></View>
                      }
                      <Link href={obActivity?.urlLocation ? obActivity.urlLocation : ''} isExternal>
                        <HStack alignItems="center">
                          <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                            {obActivity.urlLocation ? 'Google location' : ''}
                          </LinkText>
                        </HStack>
                      </Link>
                    </HStack>
                  </VStack>
                </Card>
              })}
            </AccordionContent>
          </AccordionItem>
        })}
      </Accordion>
    </ScrollView>
  </SafeAreaView>
);
};

export default Trip;

const styles = StyleSheet.create({
	buttonText: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 10,
		color: '#007AFF',
	},
	container: {
		padding: 10,
		alignItems: 'center',
		backgroundColor: '#f0f0f0',
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#333',
	},
	subtitle: {
		fontSize: 16,
		color: '#555',
		marginTop: 5,
	},
});
