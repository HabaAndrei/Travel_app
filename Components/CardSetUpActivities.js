import { StyleSheet, View, Pressable, KeyboardAvoidingView, Platform, } from 'react-native'
import React, {useState} from 'react'
import { Card, Text, Heading, ScrollView, Button, Center,
  FormControl, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, Textarea, TextareaInput, 
  RadioGroup, HStack, Radio, RadioIndicator, RadioIcon, RadioLabel, CircleIcon
} from '@gluestack-ui/themed';

const CardSetUpActivities = (props) => {

  return (
    <View>

      <Card p="$5" borderRadius="$lg"  m="$3" maxWidth={400} style={styles.shadow}>
     
        <Center>
          <RadioGroup value={props.valueRadio} onChange={props.setValueRadio}>
            <HStack space="2xl">
              <Radio value="Activities">
                <RadioIndicator mr="$2">
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>Activities</RadioLabel>
              </Radio>
              <Radio value="Chat">
                <RadioIndicator mr="$2">
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>Chat</RadioLabel>
              </Radio>
            </HStack>
          </RadioGroup>
        </Center>

        <View style={styles.buttonGo} >
          <Button style={styles.buttonGoPressAc}
           isDisabled={props.valueRadio != 'Activities'} onPress={()=>props.openModalActivities()} >
            <Text style={styles.text} >
              Choose activities
            </Text>
          </Button>
        </View>

        <FormControl
          isDisabled={props.valueRadio != 'Chat'}             
        >
          <FormControlLabel>
            <FormControlLabelText>Chat</FormControlLabelText>
          </FormControlLabel>
            <KeyboardAvoidingView style={{ flex: 1, paddingBottom: Platform.OS === 'ios' ? 60 : 0}} behavior="position">
              <Textarea >
                <TextareaInput 
                  placeholder="The oldest breweries in the city"
                  value={props.inputSearch}
                  onChangeText={(text) => props.setInputSearch(text)}
                />
              </Textarea>

            </KeyboardAvoidingView>
        </FormControl>

      </Card>
    </View>
  )
}

export default CardSetUpActivities

const styles = StyleSheet.create({
  buttonGo: {
    marginTop: 30,
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGoPressAc:{
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    height: 40,
    width: 160,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  shadow:{
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
})