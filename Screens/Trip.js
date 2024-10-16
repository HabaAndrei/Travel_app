import { StyleSheet, View, Pressable, ScrollView, Clipboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native'; 
import {  AccordionIcon, Text, AccordionTitleText,  AccordionTrigger,  AccordionHeader, AccordionContent,
    AccordionItem, Accordion, AddIcon, AccordionContentText, Card, Heading, 
    Icon, TrashIcon, HStack, VStack, LinkText, Link, Divider, RemoveIcon
} from '@gluestack-ui/themed';
import ImageCarousel from '../Components/ImageCarousel.js';


const Trip = (props) => {
    const isFocused = useIsFocused();
    const [tripProgram, setTripProgram] = useState([]);


    useEffect(() => {
        if (!isFocused) return;
        let { city, country, from, to, program } = props.route.params;
        // aici sa nu mai primesc programul string si sa il iau eu din baza de date parametrilor 
        if (typeof program === 'string') program = JSON.parse(program);
        setTripProgram(program);
    }, [isFocused]);

    const copyInClipboard = (text) => {
        Clipboard.setString(text);
    };

    return (
        <ScrollView >
            <Accordion  width="100%" maxWidth={900} >
                {tripProgram.map((dayProgram, index)=>{
                return <AccordionItem key={index} value={'item-' + (index + 1)} style={{marginBottom: 10}} >
                    <AccordionHeader  >
                        <AccordionTrigger style={{backgroundColor: '#C0C0C0', borderRadius: 10}} >
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
                        {dayProgram.activities.map((obActivity, index)=>{
                            return <Card key={index}  maxWidth={800} style={styles.card} >
                                <HStack justifyContent="space-between" alignItems="center">
                                    <Heading mb="$1" size="md">
                                        {obActivity.name}
                                    </Heading>
                                    <Pressable onPress={() => {console.log('vrem sa stergem acivitatea')}}>
                                        <Icon as={TrashIcon} m="$2" w="$6" h="$6" />
                                    </Pressable> 
                                </HStack>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text  style={{marginRight: 30}} fontSize="$sm" fontStyle="normal" fontWeight="$normal" lineHeight="$sm" mb="$2" sx={{ color: "$textLight700" }}>
                                        {obActivity.time}
                                    </Text>
                                    {/* <TimePicker isTimePickerVisible={isTimePickerVisible} setTimePickerVisibility={setTimePickerVisibility} 
                                        showDatePicker={()=>setTimePickerVisibility({type: true, index})} hideDatePicker={hideDatePicker} handleConfirm={handleConfirm}
                                    /> */}
                                </View>

                                {obActivity.address ? 
                                <Text size="m" style={{ marginTop: 10 }}>
                                    <Text bold={true}>Address: </Text> {obActivity.address}
                                    <Text style={styles.buttonText} onPress={() => copyInClipboard(`${obActivity.address}`)}>
                                    {' '}
                                    Copy
                                    </Text>
                                </Text> : <Text></Text>
                                }


                                <Text size="m" style={{ marginTop: 10 }}>
                                <Text bold={true}>Info:</Text> {obActivity.info}
                                </Text>
                                <Text size="m" style={{ marginTop: 10 }}>
                                <Text bold={true}>Description: </Text>
                                    {obActivity.description}
                                </Text>

                                <View style={{ flex: 1, marginTop: 20 }}>
                                    {obActivity.arrayWithLinkImages.length ? 
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
                                        {obActivity.urlLocation && obActivity.website ? 
                                        <Divider orientation="vertical" mx='$2.5' bg='$emerald500' h={15} />:
                                        <View></View>
                                        }
                                        <Link href={obActivity.urlLocation ? obActivity.urlLocation : ''} isExternal>
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

});
