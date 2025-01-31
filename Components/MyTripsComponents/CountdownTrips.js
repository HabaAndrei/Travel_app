import { StyleSheet, View, PanResponder } from 'react-native'
import { useEffect, useState } from 'react'
import { Card, Text, Heading } from '@gluestack-ui/themed';
import {formatDateFromMilliseconds, getDays, getHours, toMinutes} from '../../diverse.js';

/** Component that provides notifications about locations that will be visited by the user */
const CountdownNews = (props) => {

  const [newsToShow, setNewToShow] = useState([])
  const [newsNumber, setNewsNumber] = useState(0);
  const [startX, setStartX] = useState(0);

  // Function that interprets if the user wants to slide to the left or right
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setStartX(evt.nativeEvent.pageX);
    },
    onPanResponderRelease: (evt) => {
      const endX = evt.nativeEvent.pageX;
      if (startX - endX > 20) {
        setNewsNumber((number)=>{
          if(number >= newsToShow.length - 1 )return number;
          else return number +=1;
        })
      } else if (endX - startX > 20) {
        setNewsNumber((number)=>{
          if(number <= 0 )return number;
          else return number -=1;
        })
      }
    }
  });

  useEffect(()=>{
    if(!props.plans.length)return;
    createNews();
  }, [props.plans]);

  // Create the content for each valid location
  function returnNewsFromActivities(programDay, actualDate, actualHour, actualMinutes) {
    const { activities, date } = programDay;
    const news = [];

    const formatTimeMessage = (hours, minutes, address) =>
      `In ${hours > 0 ? `${hours} hours` : ''} ${hours > 0 && minutes > 0 ? 'and' : ''} ${minutes > 0 ? `${minutes} minutes` : ''} you have to be at address ${address}.`;

    activities.forEach(activity => {
      const { address, info, time, urlLocation, website, place } = activity;
      const infOne = `Good to know: ${info}`;
      const title = place;
      if (date === actualDate) {
        if (toMinutes(`${actualHour}:${actualMinutes}`) < toMinutes(time)) {
          const { minutes, hours } = getHours(`${actualHour}:${actualMinutes}`, time);
          const infTwo = formatTimeMessage(hours, minutes, address);
          news.push({ title, infOne, infTwo, urlLocation, website, address });
        }
      } else {
        const days = getDays({
          startDate: new Date(actualDate).getTime(),
          endDate: new Date(date).getTime()
        });
        if (days === 1) {
          const { minutes, hours } = getHours(`${actualHour}:${actualMinutes}`, time);
          const infTwo = formatTimeMessage(hours, minutes, address);
          news.push({ title, infOne, infTwo, urlLocation, website, address });
        } else {
          const infTwo = `In ${days} days you have to be at address ${address}.`;
          news.push({ title, infOne, infTwo, urlLocation, website, address });
        }
      }
    });
    return news;
  }

  // Create the news only with locations that will be visited
  function createNews(){
    const actualDate = formatDateFromMilliseconds(new Date().getTime());
    const actualHour = new Date().getHours();
    const actualMinutes = new Date().getMinutes();
    if(actualHour.length === 1)actualHour = "0" + actualHour;
    if(actualMinutes.length === 1)actualMinutes = "0" + actualMinutes;

    const firstTriptToVisit = props.plans.find((ob)=>ob.endDate >= actualDate);
    if(!firstTriptToVisit)return;
    const programDays = JSON.parse(firstTriptToVisit.programDaysString);
    const indexFirstDayToVisit = programDays.findIndex((ob)=>ob.date >= actualDate);
    let arNews = returnNewsFromActivities(programDays[indexFirstDayToVisit], actualDate, actualHour, actualMinutes)
    if((arNews.length < 5) && programDays[indexFirstDayToVisit + 1]){
      const arNewsTwo = returnNewsFromActivities(programDays[indexFirstDayToVisit + 1], actualDate, actualHour, actualMinutes)
      arNews = arNews.concat(arNewsTwo);
    }
    setNewToShow(arNews);

  };

  return (
    <>
    {newsToShow.length ?
      <Card p="$5" borderRadius="$lg" maxWidth={600} m="$3" style={styles.container} {...panResponder.panHandlers}>
        <View style={{backgroundColor: 'white'}} >
          <Heading style={styles.heading}>{newsToShow[newsNumber]?.title}</Heading>
          <Text style={styles.infoText}>{newsToShow[newsNumber]?.infTwo}</Text>
          <Text style={styles.description}>{newsToShow[newsNumber]?.infOne}</Text>

          <View style={styles.dotsContainer}>
            {newsToShow.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === newsNumber ? styles.activeDot : styles.inactiveDot
                ]}
              />
            ))}
          </View>
        </View>
      </Card> : null
    }
    </>
  )
}

export default CountdownNews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
    lineHeight: 22,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  }
});
