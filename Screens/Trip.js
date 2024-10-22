import { StyleSheet, View, Pressable, ScrollView, Clipboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native'; 
import { Text, AccordionTitleText,  AccordionTrigger,  AccordionHeader, AccordionContent,
    AccordionItem, Accordion, AddIcon, Card, Heading, 
    Icon, TrashIcon, HStack, VStack, LinkText, Link, Divider, Center, RemoveIcon
} from '@gluestack-ui/themed';
import ImageCarousel from '../Components/ImageCarousel.js';
import {updateProgramActivities} from '../firebase.js';
import TimePicker from '../Components/TimePicker.js';
import DatePicker from '../Components/DatePicker';
import {formatDateFromMilliseconds} from '../diverse';
import ModalAddNewDay from '../Components/ModalAddNewDay.js';

const Trip = (props) => {

    const isFocused = useIsFocused();
    const [tripProgram, setTripProgram] = useState([]);
    const [isTimePickerVisible, setTimePickerVisibility] = useState({type:false, index: '', indexActivity: ''});
    const [datePickerVisibility, setDatePickerVisibility] = useState({type: false, index:''});
    const [isModalVisible, setModalVisible] = useState({type: false});

    useEffect(() => {
        if (!isFocused) return;
        let { city, country, from, to, id, program } = props.route.params;
        if (typeof program === 'string') program = JSON.parse(program);
        setTripProgram(program);
    }, [isFocused]);

    const copyInClipboard = (text) => {
        Clipboard.setString(text);
    };

    async function deleteActivity(index, indexActivity){
        const response = await props.areYouSureDeleting();
        if(!response)return;
        let newProgram = [...tripProgram];
        let {activities} = newProgram[index];
        const firstPart = activities.slice(0, indexActivity);
        const secondPart = activities.slice(indexActivity + 1, activities.length);
        const newActivities = firstPart.concat(secondPart);
        newProgram[index].activities = newActivities;
        const id = props.route.params.id;
        if(!id){
            props.addNotification('error', 'There is a problem deleting the activity')
            return;
        }
        const rez = await updateProgramActivities(id, [...newProgram]);
        if(rez.type){
            setTripProgram((prev)=>{            
                return [...newProgram];
            })
        }else{
            props.addNotification('error', 'There is a problem deleting the activity')
        }
    }

    const hideDatePicker = () => {
        setTimePickerVisibility({type:false, index: '', indexActivity: ''});
    };
    
    async function handleConfirmTime(time){
        const timestamp = new Date(time).getTime();
        let hour = new Date(timestamp).getHours();
        let minutes = new Date(timestamp).getMinutes();
        if(JSON.stringify(minutes).length < 2)minutes = "0" + JSON.stringify(minutes);
        if(JSON.stringify(hour).length < 2)hour = "0" + JSON.stringify(hour);
        const {index, indexActivity} = isTimePickerVisible;
        let program = [...tripProgram];
        program[index].activities[indexActivity].time = `${hour}:${minutes}`;
        const id = props.route.params.id;
        if(!id){
            props.addNotification('error', 'There is a problem when updating the time')
            return;
        }
        hideDatePicker();
        const rez = await updateProgramActivities(id, [...program]);
        if(rez.type){
            setTripProgram((prev)=>{
                return [...program];
            })
        }else{
            console.log(rez.err);
            props.addNotification('error', 'There is a problem when updating the time')
        }
    };


    async function confimNewDate(date){
        const data = formatDateFromMilliseconds(date);
        const newProgram = [...tripProgram];
        newProgram[datePickerVisibility.index].date = data;
        const id = props.route.params.id;
        if(!id){
            props.addNotification('error', 'There is a problem when updating the date')
            return;
        }
        console.log('data aleasa', data);
        // datePickerVisibility.index
        let requireChanges = '';
        console.log(props.route.params.to, props.route.params.from)
        if(new Date(data).getTime() > new Date(props.route.params.to).getTime()){
            props.route.params.to = date;
            requireChanges = 'to';
        }else if(new Date(data).getTime() < new Date(props.route.params.from).getTime()){
            props.route.params.from = date;
            requireChanges = 'from';
        }

        let rez = '';
        if(requireChanges){
            rez = await updateProgramActivities(id, [...newProgram], requireChanges, date);
        }else{
            rez = await updateProgramActivities(id, [...newProgram]);
        }
        if(rez.type){
            setTripProgram((prev)=>{
                return [...newProgram];
            })
        }else{
            console.log(rez.err);
            props.addNotification('error', 'There is a problem when updating the date')
        }
    }

    function saveNewLocation(name, address, info, description, time){
        console.log({name, address, info, description, time})
        const index = isModalVisible.index;
        let program = [...tripProgram];
        console.log(program[index]);
        // aici adaug locatia si le ordonez inainte 
        // merge asta console.log('10:11' > '20:00');
        program[index].activities.push({
            name: name ? name: '',
            address: address ? address : '',
            info: info ? info : '',
            description : description ? description : '',
            time : time ? time : '',
        })
        program[index].activities.sort((a, b)=>a.time - b.time);
        setTripProgram(program);
        
        setModalVisible({type: false})
    
    }

    return (
        <ScrollView  >


            <ModalAddNewDay saveNewLocation={saveNewLocation} addNotification={props.addNotification} 
            isModalVisible={isModalVisible}  setModalVisible={setModalVisible} />

            <View style={styles.container}>
                <Text style={styles.title}>
                    {props.route.params.country} - {props.route.params.city}
                </Text>
            </View>

            <Accordion  width="100%" maxWidth={900}  shadowColor="transparent" >
                {tripProgram.map((dayProgram, index)=>{
                return <AccordionItem key={index} value={'item-' + (index + 1)} style={{marginBottom: 10, marginTop: 10}} >
                    <AccordionHeader  >
                        <AccordionTrigger style={{backgroundColor: '#D3D3D3', borderRadius: 10}} >
                            {({ isExpanded }) => {
                                return (   
                                    <>
                                    <AccordionTitleText >
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
                    <AccordionContent >
                       
                        <Center>
                        <Heading>
                                {new Date(dayProgram.date).toString().slice(0, 15)}
                            </Heading>
                        </Center>
                        <DatePicker
                            showDatePicker={() => setDatePickerVisibility({ type: true, index })}
                            datePickerVisibility={datePickerVisibility}
                            setDatePickerVisibility={setDatePickerVisibility}
                            confimNewDate={confimNewDate}
                        />

                        <Pressable onPress={()=>{setModalVisible({type: true, index})}} >
                            <Text>
                                Add new Location
                            </Text>
                        </Pressable>

                        {dayProgram.activities.map((obActivity, indexActivity)=>{
                            return <Card key={indexActivity}  maxWidth={800} style={{marginBottom: 15}}>
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Heading mb="$1" size="md">
                                        {obActivity.name}
                                    </Heading>
                                    <Pressable onPress={() => {deleteActivity(index, indexActivity)}}>
                                        <Icon as={TrashIcon} m="$2" w="$6" h="$6" />
                                    </Pressable> 
                                </HStack>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text  style={{marginRight: 30}} fontSize="$sm" fontStyle="normal" fontWeight="$normal" lineHeight="$sm" mb="$2" sx={{ color: "$textLight700" }}>
                                        {obActivity.time}
                                    </Text>
                                    <TimePicker isTimePickerVisible={isTimePickerVisible} setTimePickerVisibility={setTimePickerVisibility} 
                                        showDatePicker={()=>setTimePickerVisibility({type: true, index, indexActivity})} hideDatePicker={hideDatePicker} 
                                        handleConfirm={handleConfirmTime}
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
                                    <ImageCarousel   imageUrls={obActivity.arrayWithLinkImages }/> : 
                                    <View></View>
                                    }
                                </View>

                                <VStack space="md" justifyContent='center' alignItems='center'>
                                    <HStack h='$10' justifyContent='center' alignItems='center'>
                                        <Link href={obActivity.website ? obActivity.website : ''} isExternal>
                                        <HStack alignItems="center">
                                            <LinkText size="sm" fontFamily="$heading" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                                            {obActivity.website ? 'Visit their website' : '' }
                                            </LinkText>
                                        </HStack>
                                        </Link>
                                        {obActivity?.urlLocation && obActivity?.website ? 
                                        <Divider orientation="vertical" mx='$2.5' bg='$emerald500' h={15} />:
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
    );
};

export default Trip;

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
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
