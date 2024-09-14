import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import {formatDateFromMilliseconds, address_function_program} from '../diverse.js';
import { ArrowRightIcon, Spinner, Center, Card, Heading, Link, LinkText, HStack, Image, Icon } from "@gluestack-ui/themed";
import axios from 'axios';


const Program = (props) => {

    const [program, setProgram] = useState([]);


    const fromDate = '14-09-2024';
    const toDate = '19-09-2024';
    const city = 'Dubai';
    const country = 'United Arab Emirates';
    const newCheckbox = ['Explore skyscrapers and modern architecture', 'Enjoy desert safari and camel riding', 'Visit cultural heritage sites and museums', 'Attend international events and conferences', 'Try water sports and activities'];



    useEffect(()=>{
        // let {from, to, city, country, checkbox} = props.route.params;
        // const fromDate = formatDateFromMilliseconds(from);
        // const toDate = formatDateFromMilliseconds(from + (to * 86_400_000));
        // let newCheckbox =[];
        // checkbox.forEach((ob)=>{if(ob.selected)newCheckbox.push(ob.category)});


        axios.post(`${address_function_program}`, 
            {  fromDate, toDate, city, country, newCheckbox
        }).then((data)=>{
            const val = Object.values(data.data.program);
            setProgram(val)
        }).catch((err)=>{
            console.log(err);
        })

    }, []);



  return (
    <ScrollView  style={{marginTop: 40, marginBottom: 40}} >

        {!program.length ? 
            <View style={styles.container} >
                <Center  >
                    <Spinner color="$indigo600" />
                </Center>
            </View> :
            <View  >
                
            {program.map((ob, index)=>{
                console.log(ob);
                return  <Card  key={index}  p="$5" borderRadius="$lg" maxWidth={360} m="$3">
      
                    <Text
                    fontSize="$sm"
                    fontStyle="normal"
                    fontFamily="$heading"
                    fontWeight="$normal"
                    lineHeight="$sm"
                    mb="$2"
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
                            <LinkText
                            size="sm"
                            fontFamily="$heading"
                            fontWeight="$semibold"
                            color="$primary600"
                            $dark-color="$primary300"
                            textDecorationLine="none"
                            >
                                See full day
                            </LinkText>
                            <Icon
                            as={ArrowRightIcon}
                            size="sm"
                            color="$primary600"
                            mt="$0.5"
                            ml="$0.5"
                            $dark-color="$primary300"
                            />
                        </HStack>
                    </Link>
                </Card>
               
            })}
            


            </View>
        }
    </ScrollView>
  )
}

export default Program

const styles = StyleSheet.create({
 
    container: {
        marginTop: 300
    }
})