import { StyleSheet, View } from 'react-native'
import {useState} from 'react'
import { Card, Heading, Select, SelectInput, Icon, ChevronDownIcon, SelectIcon, SelectItem,
  SelectTrigger, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, TextareaInput, Textarea  } from '@gluestack-ui/themed';
import {FirebaseFirestore} from '../../Firebase.js';
import CustomButton from '../../CustomElements/CustomButton.js';

const CardFeedback = (props) => {

  const [feedback, setFeedback] = useState('');
  const [feedbackCategoryState, setFeedbackCategoryState] = useState('');
  const feedbackCategory = ['Bugs and Issues', 'Functionality and Features', 'Good to Know', 'Ideas for Future Development', 'Usability and Navigation'];
  const firebaseFirestore = new FirebaseFirestore();

  function verifyFields(){
    if(!feedbackCategoryState.length){
      props.addNotification('error', 'Please choose a category for your feedback');
      return false;
    }else if(!feedback.replaceAll(' ', '').length){
      props.addNotification('error', 'Please write your feedback')
      return false;
    }
    return true;
  }


  async function sendFeedback(){
    if(!verifyFields())return;
    const rez = await firebaseFirestore.addIntoDatabase({
      database: 'feedback',
      id: false,
      columnsWithValues: {uid: props.user.uid, feedback, feedbackCategory: feedbackCategoryState}
    });

    if(rez.err){
      console.log(rez.err);
      props.addNotification('error', 'Unfortunately, the feedback could not be sent')
      return;
    }
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
            <SelectTrigger variant="outline" size="md" style={styles.selectTrigger}>
              <SelectInput placeholder="Select option" />
              <SelectIcon mr="$3">
                <Icon as={ChevronDownIcon} />
              </SelectIcon>
            </SelectTrigger>
            <SelectPortal>
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
          <Textarea style={styles.textarea}>
            <TextareaInput
              placeholder="Write your feedback here"
              value={feedback}
              onChangeText={(text) => setFeedback(text)}
            />
          </Textarea>
        </View>

        <CustomButton name={'Send feedback'} func={sendFeedback} style={styles.button}/>
      </Card>
    </View>
  )
}

export default CardFeedback

const styles = StyleSheet.create({
  selectTrigger: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  textarea: {
    backgroundColor: '#fff',
    marginTop: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
})