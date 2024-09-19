import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import {formatDateFromMilliseconds, address_function_program} from '../diverse.js';
import { ArrowRightIcon, Spinner, Center, Card, Heading, Link, LinkText, HStack, Image, Icon } from "@gluestack-ui/themed";
import axios from 'axios';
import ModalDayProgram from '../Components/ModalDayProgram.js';

const Program = (props) => {

    const [program, setProgram] = useState([
      // {
      //   day: 1,
      //   title: "Explore Skyscrapers and Modern Architecture",
      //   date: "14-09-2024",
      //   activities: [
      //     {
      //       description: "Visit the tallest building in the world and enjoy the view from the observation deck.",
      //       info: "Purchase tickets online in advance.",
      //       place: "Burj Khalifa",
      //       time: "09:00"
      //     },
      //     {
      //       description: "Explore one of the largest shopping malls in the world.",
      //       info: "Free to enter, but some attractions inside may require tickets.",
      //       place: "Dubai Mall",
      //       time: "12:00"
      //     },
      //     {
      //       description: "Walk along the marina and enjoy the stunning skyscrapers and waterfront views.",
      //       info: "Free to visit.",
      //       place: "Dubai Marina",
      //       time: "15:00"
      //     }
      //   ]
      // }, 
      // {
      //   day: 2,
      //   title: "Enjoy Desert Safari and Camel Riding",
      //   date: "15-09-2024",
      //   activities: [
      //     {
      //       description: "Experience the thrill of dune bashing in the desert.",
      //       info: "Book a tour package in advance.",
      //       place: "Desert Safari",
      //       time: "09:00"
      //     },
      //     {
      //       description: "Enjoy a camel ride through the desert.",
      //       info: "Often included in desert safari packages.",
      //       place: "Camel Riding",
      //       time: "12:00"
      //     },
      //     {
      //       description: "Visit a traditional desert camp and enjoy activities like sandboarding and henna painting.",
      //       info: "Book as part of a desert safari tour.",
      //       place: "Desert Camp",
      //       time: "15:00"
      //     }
      //   ]
      // }, 
      
    
    
    
    ]);


    
    useEffect(()=>{
        const from = '14-09-2024';
        const to = '19-09-2024';
        const city = 'Dubai';
        const country = 'United Arab Emirates';
        const newCheckbox = ['Explore skyscrapers and modern architecture', 'Enjoy desert safari and camel riding', 'Visit cultural heritage sites and museums', 'Attend international events and conferences', 'Try water sports and activities'];


        
        const {from, to, city, country, checkbox} = props.route.params;
        
        console.log({from, to, city, country, checkbox});



        let newCheckbox =[];
        checkbox.forEach((ob)=>{if(ob.selected)newCheckbox.push(ob.category)});

        axios.post(`${address_function_program}`, 
            {  from, to, city, country, newCheckbox
        }).then((data)=>{
            const val = Object.values(data.data.program);
            setProgram(val)
        }).catch((err)=>{
            console.log(err);
        })

    }, []);



  return (
    <ScrollView  >


        {/* <ModalDayProgram/> */}

      {!program.length ? 
      <View style={styles.container} >
        <Center  >
          <Spinner color="$indigo600" />
        </Center>
      </View> :

      <View> 
      {program.map((ob, index)=>{
        return  <Card  key={index}  p="$5" borderRadius="$lg" maxWidth={360} m="$3">

          <Text fontSize="$sm"  fontStyle="normal"  fontFamily="$heading"  fontWeight="$normal"  lineHeight="$sm"  mb="$2"
            sx={{
                color: "$textLight700",
                _dark: {
                color: "$textDark200",
                },
            }}
          >
            {'Day' + ob.day + " | " } {ob.date}  
          </Text>
          <Heading size="md" fontFamily="$heading" mb="$4">
            {ob.title}
          </Heading>
          <Link href="https://v1.gluestack.io/" isExternal>
            <HStack alignItems="center">
              <LinkText    size="sm"  fontFamily="$heading"  fontWeight="$semibold"  color="$primary600"  $dark-color="$primary300"  textDecorationLine="none" >
                  See full day
              </LinkText>
              <Icon as={ArrowRightIcon}  size="sm"  color="$primary600"  mt="$0.5"  ml="$0.5"  $dark-color="$primary300"/>
            </HStack>
          </Link>
        </Card>   
      })}
      </View>}
    </ScrollView>
  )
}

export default Program

const styles = StyleSheet.create({
 
  container: {
    marginTop: 300
  }
})