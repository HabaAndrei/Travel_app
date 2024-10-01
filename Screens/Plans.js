import { StyleSheet, View, ScrollView, Pressable } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useIsFocused } from '@react-navigation/native';   
import {getPlansFromDbWithUid} from '../firebase.js';
import {  Box, Divider, Text, HStack , Heading, VStack, Button, ButtonText} from '@gluestack-ui/themed' ;

const Plans = (props) => {

    const isFocused = useIsFocused();
    const [plans, setPlans] = useState([]);

    useEffect(()=>{
        if(!isFocused || !props.user.uid)return;
        getPlansFromDb(props.user.uid);
    }, [isFocused])


    async function getPlansFromDb(uid){
        const rezQuery = await getPlansFromDbWithUid(uid);
        if(!rezQuery.type){
            props.addNotification("error", "Unfortunately, there was a problem when taking the program")
            return;
        }
        const arWitProgram = rezQuery.data;
        if(!arWitProgram?.length)return;

        const arIndexSort = sortArrayDate(arWitProgram.map((ob)=>ob.from));
        let arraySort =  arIndexSort.map((index) => {return arWitProgram[index]});
        console.log(arraySort);
        setPlans(arraySort);
    }

    function sortArrayDate(arrayDate){
        const arTimestamp = arrayDate.map((date, index)=> {return {date : new Date(date).getTime(), index}})
        arTimestamp.sort((a, b)=> a.date - b.date);
        return arTimestamp.map((ob)=>ob.index);
    }   

  return (
    <ScrollView>
      {
        plans.length ? 
        <View>

            <VStack space='lg' p='$12' >
            {plans.map((obiect, index)=>{

                return  <Box key={index} >
                    <Text size='xs' color='$darkBlue600' fontWeight='$bold'>
                        {obiect.country}
                    </Text>
                    <Heading>
                        {obiect.city}
                    </Heading>
                    
                    <HStack space='sm' mt='$3' h='$5'>
                        <Text size='xs'>
                            From {obiect.from}
                        </Text>
                        <Divider orientation='vertical' bg='$trueGray300'/>
                        <Text size='xs'>
                            To {obiect.to}
                        </Text>
                        <Divider orientation='vertical' bg='$trueGray300'/>

                        <Text size='xs' style={{ fontWeight: 'bold'}}>
                            See all trip
                        </Text>
                    </HStack>

                    <Divider style={{marginTop: 10}} bg="$trueGray300" $dark-bg="$backgroundDark700" />

                </Box>

            })}
    
            </VStack>
      
            
            
      

        </View>
        :
        <View>
             <View style={styles.buttonView} >
                <Pressable  style={styles.buttonPress}  > 
                    <Text style={styles.text} onPress={()=>{props.navigation.navigate('Home'); setButtonHomePage(false)}}>
                    Schedule trip
                    </Text>
                </Pressable>
            </View>
        </View>


      }
    </ScrollView>
  )
}

export default Plans

const styles = StyleSheet.create({
    buttonPress:{
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        height: 40,
        width: 160,
        marginBottom: 30
    },
    text: {
        color: 'white',
        textAlign: 'center',
    },
    buttonView: {
        marginTop: 200,
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
        
    }, 
})