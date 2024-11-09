import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import { Card, Heading, Select, SelectInput, Icon, ChevronDownIcon, SelectIcon, SelectItem,
  SelectTrigger, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, TextareaInput, Textarea  } from '@gluestack-ui/themed';

const CardFeedback = () => {

  const [feedback, setFeedback] = useState('');
  const [feedbackCategoryState, setFeedbackCategoryState] = useState('');
  const feedbackCategory = ['Bugs and Issues', 'Functionality and Features', 'Good to Know', 'Ideas for Future Development', 'Usability and Navigation'];



  return (
    <View>
      <Card p="$5" borderRadius="$lg" maxWidth={360} m="$3">
        <Heading size="md" fontFamily="$heading" mb="$4">
          Give us feedback 
        </Heading>
        <Select>
          <SelectTrigger variant="outline" size="md" >
            <SelectInput placeholder="Select option" />
            <SelectIcon mr="$3">
              <Icon as={ChevronDownIcon} />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop/>
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator  />
              </SelectDragIndicatorWrapper>
              {feedbackCategory.map((name, index)=>{
                return <SelectItem onPress={()=>setFeedbackCategoryState(name)}
                key={index} label={name} value={name} />
              })}
            </SelectContent>
          </SelectPortal>
        </Select>
        
        <Textarea style={{ backgroundColor: 'white', marginTop: 10 }}>
          <TextareaInput 
            placeholder="Write your feedback here"
            value={feedback}
            onChangeText={(text) => setFeedback(text)}
          />
        </Textarea>

      </Card>
    </View>
  )
}

export default CardFeedback

const styles = StyleSheet.create({})