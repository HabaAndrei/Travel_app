import { StyleSheet, View, ScrollView, Pressable, SafeAreaView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useIsFocused } from '@react-navigation/native';   
import {getPlansFromDbWithUid} from '../firebase.js';
import {  Card, Divider, Text, HStack , Heading, Link, LinkText, Icon, ArrowRightIcon, VStack, Button, ButtonText} from '@gluestack-ui/themed' ;

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
        setPlans(arraySort);
    }

    function sortArrayDate(arrayDate){
        const arTimestamp = arrayDate.map((date, index)=> {return {date : new Date(date).getTime(), index}})
        arTimestamp.sort((a, b)=> a.date - b.date);
        return arTimestamp.map((ob)=>ob.index);
    }   

  return (
    <SafeAreaView style={{flex: 1}}>
      {!plans.length ? 
        <View style={styles.buttonView} >
            <Pressable  style={styles.buttonPress}  > 
            <Text style={styles.text} onPress={()=>{props.navigation.navigate('Home')}}>
                Create program</Text>
            </Pressable>
        </View>
        :
        <ScrollView style={{ flex: 1 }} >
            {plans.map((obiect, index)=>{
                return <Card key={index}   p="$5" borderRadius="$lg" maxWidth={600} m="$3">
                    <Heading size="md" fontFamily="$heading" mb="$4">
                        {obiect.country} - {obiect.city}
                    </Heading>
                    <HStack space='sm' mt='$3' h='$5'>
                        <Text size='xs'>
                            From: {new Date(obiect.from).toString().slice(0, 15)}
                        </Text>
                        <Divider orientation='vertical' bg='$trueGray300'/>
                        <Text size='xs'>
                            To: {new Date(obiect.to).toString().slice(0, 15)}
                        </Text>
                    </HStack>
                    <HStack alignItems="center" justifyContent="flex-end">
                        <Link onPress={() => { props.navigation.navigate('Trip', {from: obiect.from, to: obiect.to, city: obiect.city, country: obiect.country, program: obiect.programDaysString, id: obiect.id}) }}>
                            <HStack alignItems="center">
                                <LinkText  size="sm"  fontFamily="$heading"  fontWeight="$semibold"  color="$primary600"  $dark-color="$primary300"  textDecorationLine="none"  >
                                    See the travel
                                </LinkText>
                                <Icon as={ArrowRightIcon}    size="sm"    color="$primary600"    mt="$0.5"    ml="$0.5" $dark-color="$primary300" />
                            </HStack>
                        </Link>
                    </HStack>
                </Card>
            })}            
        </ScrollView>
      }
    </SafeAreaView>
  )
}

export default Plans

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
})