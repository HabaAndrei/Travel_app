import { StyleSheet, ScrollView, SafeAreaView, View } from 'react-native'
import { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { FirebaseFirestore } from '../Firebase.js';
import { Text, ArrowRightIcon, HStack, Heading, Center } from '@gluestack-ui/themed';
import CountdownTrips from '../Components/MyTripsComponents/CountdownTrips.js';
import CustomButton from '../CustomElements/CustomButton.js';
import CardPresentationTrip from '../Components/CardPresentationTrip.js';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const MyTrips = (props) => {
  const isFocused = useIsFocused();
  const [plans, setPlans] = useState([]);
  const firebaseFirestore = new FirebaseFirestore();

  useEffect(() => {
    if (!isFocused || !props.user.uid) return;
    getPlansFromDb(props.user.uid);
  }, [isFocused]);

  async function getPlansFromDb(uid) {
    const rezQuery = await firebaseFirestore.getPlansFromDbWithUid(uid);
    if (!rezQuery.isResolved) {
      props.addNotification("error", "Unfortunately, there was a problem when taking the program")
      return;
    }
    const arWitProgram = rezQuery.data;
    if (!arWitProgram?.length) return;

    const arIndexSort = sortArrayDate(arWitProgram.map((ob) => ob.from));
    let arraySort = arIndexSort.map((index) => { return arWitProgram[index] });
    setPlans(arraySort);
  }

  function sortArrayDate(arrayDate) {
    const arTimestamp = arrayDate.map((date, index) => { return { date: new Date(date).getTime(), index } });
    arTimestamp.sort((a, b) => a.date - b.date);
    return arTimestamp.map((ob) => ob.index);
  }

  function navigateSetUpTrip() {
    props.navigation.navigate('SetupTrip')
  }

  async function deleteTrip(indexTrip){
    const response = await props.areYouSure();
    if (!response) return;
    const idTrip = plans[indexTrip].id;
    const responseFirestore = await firebaseFirestore.deleteTrip(idTrip);
    if(!responseFirestore.isResolved){
      props.addNotification("error", "Unfortunately, there was a problem deleting")
      return;
    }
    setPlans((prevPlan)=>{
      prevPlan.splice(indexTrip, 1);
      return [...prevPlan];
    })
  }

  function formatTime(time){
    return new Date(time).toString().slice(0, 15);
  }

  function goToTripScreen(plan){
    props.navigation.navigate('Trip', { from: plan?.from, to: plan?.to, city: plan?.city, country: plan?.country, program: plan?.programDaysString, id: plan?.id, hotelAddress: plan?.hotelAddress })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>

        {plans.length ?
          <>
            <Center>
              <HStack alignItems="center">
                <Heading>My trips</Heading>
                <FontAwesome6 name="earth-americas" style={{margin: 4}} size={15} color="black" />
              </HStack>
            </Center>
            <CountdownTrips plans={plans} />
          </>
        :
          <View style={styles.titleContainer}>
            <Text style={styles.appName}>Travel Bot</Text>
            <Text style={styles.slogan}>– Where Every Trip Finds Its Way 🌍</Text>
            <Text style={styles.noTripsMessage}>
              Your next adventure is just a few clicks away! Start scheduling your dream trip now and make unforgettable memories. Don’t let the world wait—explore, discover, and wander!
            </Text>
            <CustomButton name={'Setup trip'} icon={ArrowRightIcon} func={navigateSetUpTrip} />
          </View>
        }

        {plans?.map((plan, index)=>(
          <CardPresentationTrip
            key={index}
            index={index}
            image={plan?.urlImageCity}
            textDate={`From: ${formatTime(plan.from)} | To: ${formatTime(plan.to)}`}
            deleteFunction={deleteTrip}
            deleteFunctionParameters={[index]}
            title={`${plan.country} - ${plan.city}`}
            functionRedirect={goToTripScreen}
            functionRedirectParameters={[plan]}
            nameRedirect={'See the travel'}
          />
        ))}

      </ScrollView>
    </SafeAreaView>
  )
}

export default MyTrips;

const styles = StyleSheet.create({
  buttonPress: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    height: 40,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    shadowColor: '#333',
    shadowOpacity: 0.3,
  },
  slogan: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    marginTop: 5,
  },
  noTripsMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginTop: 80,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});
