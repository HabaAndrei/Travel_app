import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native'; 
import {  AccordionIcon,  AccordionTitleText,  AccordionTrigger,  AccordionHeader, AccordionContent,
    AccordionItem, Accordion, MinusIcon, PlusIcon, AccordionContentText} from '@gluestack-ui/themed';

const Trip = (props) => {
    const isFocused = useIsFocused();
    useEffect(() => {
        if (!isFocused) return;
        let { city, country, from, to, program } = props.route.params;
        if (typeof program === 'string') program = JSON.parse(program);
        console.log(city, country, from, to, program);
    }, [isFocused]);

    return (
        <View >
            <Accordion m="$2" width="100%" maxWidth={900} shadowColor="transparent">
                <AccordionItem value="item-1" borderRadius="$lg">
                    <AccordionHeader>
                        <AccordionTrigger>
                            {({ isExpanded }) => {
                                return (      
                                    <AccordionTitleText color="#333">
                                        How do I place an order?
                                    </AccordionTitleText>
                                );
                            }}
                        </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent >
                        <AccordionContentText color="#666">
                            To place an order, simply select the products you want, proceed to
                            checkout, provide shipping and payment information, and finalize
                            your purchase.
                        </AccordionContentText>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" mt="$2" borderRadius="$lg">
                    <AccordionHeader>
                        <AccordionTrigger
                            sx={{
                                ":focusVisible": {
                                    borderRadius: "$lg",
                                },
                            }}
                        >
                            {({ isExpanded }) => {
                                return (
                                    <>
                                        {isExpanded ? (
                                            <AccordionIcon as={MinusIcon} mr="$1" color="#333" />
                                        ) : (
                                            <AccordionIcon as={PlusIcon} mr="$1" color="#333" />
                                        )}
                                        <AccordionTitleText color="#333">
                                            What payment methods do you accept?
                                        </AccordionTitleText>
                                    </>
                                );
                            }}
                        </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent ml="$6">
                        <AccordionContentText color="#666">
                            We accept all major credit cards, including Visa, Mastercard, and
                            American Express. We also support payments through PayPal.
                        </AccordionContentText>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </View>
    );
};

export default Trip;

const styles = StyleSheet.create({

});
