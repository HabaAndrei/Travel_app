import { Pressable, StyleSheet, Text, View } from 'react-native'
import {useEffect, useState} from 'react'
import { Card, Heading, Select, SelectInput, Icon, ChevronDownIcon, SelectIcon, SelectItem, ButtonText, Button,
  SelectTrigger, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, TextareaInput, Textarea  } from '@gluestack-ui/themed';
import {store_feedback} from '../firebase.js';
import CustomButton from '../CustomElements/CustomButton.js';

const CardFeedback = (props) => {

  const [feedback, setFeedback] = useState('');
  const [feedbackCategoryState, setFeedbackCategoryState] = useState('');
  const feedbackCategory = ['Bugs and Issues', 'Functionality and Features', 'Good to Know', 'Ideas for Future Development', 'Usability and Navigation'];

  function verifyFields(){
    if(!feedbackCategoryState.length){
      props.addNotification('error', 'Please choose a category to your feedback');
      return false;
    }else if(!feedback.replaceAll(' ', '').length){
      props.addNotification('error', 'Please write your feedback')
      return false;
    }
    return true;
  }


  async function sendFeedback(){
    if(!verifyFields())return;
    const rez = await store_feedback(feedback, feedbackCategoryState);
    if(rez.err){
      console.log(rez.err);
      props.addNotification('error', 'Unfortunately, the feedback could not be sent')
      return;
    }
    setFeedbackCategoryState('');
    setFeedback('');
    props.addNotification('success', 'Thank you for your feedback');
  }

  return (
    <View>
      <Card p="$5" borderRadius="$lg" maxWidth={600} m="$3">
        <Heading size="md" fontFamily="$heading" mb="$4">
          Give us feedback
        </Heading>
        <View>
          <Select onValueChange={setFeedbackCategoryState}>
            <SelectTrigger variant="outline" size="md" >
              <SelectInput placeholder="Select option" />
              <SelectIcon mr="$3">
                <Icon as={ChevronDownIcon} />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal >
              <SelectBackdrop/>
              <SelectContent >
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator  />
                </SelectDragIndicatorWrapper>
                {feedbackCategory.map((name, index)=>{
                  return <SelectItem key={index} label={name} value={name} />
                })}
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>

        <View>
          <Textarea style={{ backgroundColor: 'white', marginTop: 10 }}>
            <TextareaInput
              placeholder="Write your feedback here"
              value={feedback}
              onChangeText={(text) => setFeedback(text)}
            />
          </Textarea>
        </View>

        <CustomButton name={'Send feedback'} func={sendFeedback}/>


      </Card>
    </View>
  )
}

export default CardFeedback

const styles = StyleSheet.create({})