import { StyleSheet, ScrollView, SafeAreaView, View } from 'react-native'
import { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { FirebaseFirestore } from '../firebase.js';
import { Card, Divider, Text, HStack, Heading, Link, LinkText, Icon, ArrowRightIcon } from '@gluestack-ui/themed';
import CountdownNews from '../Components/CountdownNews.js';
import CustomButton from '../CustomElements/CustomButton.js';
import NewsCarousel from '../Components/NewsCarousel.js';

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
    if (!rezQuery.isResolve) {
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {plans.length ? <CountdownNews plans={plans} /> :
          <View style={styles.titleContainer}>
            <Text style={styles.appName}>Travel Bot</Text>
            <Text style={styles.slogan}>– Where Every Trip Finds Its Way 🌍</Text>
            <Text style={styles.noTripsMessage}>
              Your next adventure is just a few clicks away! Start scheduling your dream trip now and make unforgettable memories. Don’t let the world wait—explore, discover, and wander!
            </Text>
            <CustomButton name={'Setup trip'} icon={ArrowRightIcon} func={navigateSetUpTrip} />
          </View>
        }

        <NewsCarousel navigation={props.navigation}/>

        {plans?.map((obiect, index) => {
          return (
            <Card key={index} p="$5" borderRadius="$lg" maxWidth={600} m="$3">
              <Heading size="md" fontFamily="$heading" mb="$4">
                {obiect.country} - {obiect.city}
              </Heading>
              <HStack space='sm' mt='$3' h='$5'>
                <Text size='xs'>
                  From: {new Date(obiect.from).toString().slice(0, 15)}
                </Text>
                <Divider orientation='vertical' bg='$trueGray300' />
                <Text size='xs'>
                  To: {new Date(obiect.to).toString().slice(0, 15)}
                </Text>
              </HStack>
              <HStack alignItems="center" justifyContent="flex-end">
                <Link onPress={() => { props.navigation.navigate('Trip', { from: obiect.from, to: obiect.to, city: obiect.city, country: obiect.country, program: obiect.programDaysString, id: obiect.id }) }}>
                  <HStack alignItems="center">
                    <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" $dark-color="$primary300" textDecorationLine="none">
                      See the travel
                    </LinkText>
                    <Icon as={ArrowRightIcon} size="sm" color="$primary600" mt="$0.5" ml="$0.5" $dark-color="$primary300" />
                  </HStack>
                </Link>
              </HStack>
            </Card>
          )
        })}
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
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
  },
  slogan: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#007AFF',
    marginTop: 5,
  },
  noTripsMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.75)',
    marginTop: 80,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});
