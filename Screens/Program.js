import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import {formatDateFromMilliseconds, address_function_program} from '../diverse.js';
import { Spinner, Center } from "@gluestack-ui/themed";
import axios from 'axios';


const Program = (props) => {

    const [program, setProgram] = useState(false);


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
            console.log(data.data);
        }).catch((err)=>{
            console.log(err);
        })

    }, []);



  return (
    <View>

        {!program ? 
            <View style={styles.container} >
                <Center  >
                    <Spinner color="$indigo600" />
                </Center>
            </View> :
            <View  >
                <Text>Program</Text>
            </View>
        }
    </View>
  )
}

export default Program

const styles = StyleSheet.create({
 
    container: {
        marginTop: 300
    }
})