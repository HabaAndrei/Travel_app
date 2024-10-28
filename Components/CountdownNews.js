import { StyleSheet, View, PanResponder } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Card, Text, Heading } from '@gluestack-ui/themed';
import {formatDateFromMilliseconds} from '../diverse.js';

const CountdownNews = (props) => {

  const [newToShow, setNewToShow] = useState([1, 2, 3, 4, 5, 6])
  const [newsNumber, setNewsNumber] = useState(0);
  const [startX, setStartX] = useState(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setStartX(evt.nativeEvent.pageX);
    },
    onPanResponderRelease: (evt) => {
      const endX = evt.nativeEvent.pageX;
      if (startX - endX > 20) {
        setNewsNumber((number)=>{
          if(number >= newToShow.length - 1 )return number;
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
    console.log(props.plans);
    if(!props.plans.length)return;
    createNews();
  }, [props.plans]);
  
  function returnNewsFromActivities(programDay, actualDate, actualHour, actualMinutes){
    console.log(programDay, actualDate, actualHour, actualMinutes);
    const {activities, title, date} = programDay;
    const news = [];
    activities.forEach((ob)=>{
      if(date === actualDate){
        if(`${actualHour}:${actualMinutes}` < ob.time){
          // aici fac o functie care ia difernta ramase de ore / minute
        }
      }else{
        // aici sa iau diferenta de zile
      }
    });
  }


  function createNews(){
    const actualDate = formatDateFromMilliseconds(new Date().getTime());
    const actualHour = new Date().getHours();
    const actualMinutes = new Date().getMinutes();
    if(actualHour.length === 1)actualHour = "0" + actualHour;
    if(actualMinutes.length === 1)actualMinutes = "0" + actualMinutes;

    const firstTriptToVisit = props.plans.find((ob)=>ob.to >= actualDate);
    if(!firstTriptToVisit)return;
    const programDays = JSON.parse(firstTriptToVisit.programDaysString);
    const indexFirstDayToVisit = programDays.findIndex((ob)=>ob.date >= actualDate);
    const arNews = returnNewsFromActivities(programDays[indexFirstDayToVisit], actualDate, actualHour, actualMinutes)

        
  };

  return (
    <View {...panResponder.panHandlers}>
      <Card p="$5" borderRadius="$lg" maxWidth={600} m="$3">

        <Heading>Aici sa pun eu lucruri smechere</Heading>
        <Text>{newToShow[newsNumber]}</Text>
        <View style={styles.dotsContainer}>
          {newToShow.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === newsNumber ? styles.activeDot : styles.inactiveDot
              ]}
            />
          ))}
        </View>
      </Card>
    </View>
  )
}

export default CountdownNews

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  }
})