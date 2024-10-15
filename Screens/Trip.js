import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native'; 
import {  AccordionIcon,  AccordionTitleText,  AccordionTrigger,  AccordionHeader, AccordionContent,
    AccordionItem, Accordion, MinusIcon, PlusIcon, AccordionContentText, Card, Heading, 
    Icon, TrashIcon, HStack
} from '@gluestack-ui/themed';

const Trip = (props) => {
    const isFocused = useIsFocused();
    const [tripProgram, setTripProgram] = useState([]);


    useEffect(() => {
        if (!isFocused) return;
        let { city, country, from, to, program } = props.route.params;
        if (typeof program === 'string') program = JSON.parse(program);
        setTripProgram(program);
    }, [isFocused]);

    return (
        <ScrollView >
            <Accordion m="$2" width="100%" maxWidth={900} shadowColor="transparent">
                {tripProgram.map((dayProgram, index)=>{
                return <AccordionItem key={index} value={'item-' + (index + 1)} borderRadius="$lg">
                    <AccordionHeader>
                        <AccordionTrigger>
                            {({ isExpanded }) => {
                                return (      
                                    <AccordionTitleText color="#333">
                                       Day {dayProgram.day} - {dayProgram.title}
                                    </AccordionTitleText>
                                );
                            }}
                        </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent >
                        <AccordionContentText color="#666">
                            {dayProgram.activities.map((obActivity, index)=>{
                                console.log(obActivity);
                                return <Card key={index} p="$5" borderRadius="$lg" maxWidth={400} m="$3">
                                    <HStack justifyContent="space-between" alignItems="center">
                                        <Heading mb="$1" size="md">
                                            {obActivity.name}
                                        </Heading>
                                        <Pressable onPress={() => {console.log('vrem sa stergem acivitatea')}}>
                                            <Icon as={TrashIcon} m="$2" w="$6" h="$6" />
                                        </Pressable> 
                                    </HStack>
                                </Card>
                            })}
                        </AccordionContentText>
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
