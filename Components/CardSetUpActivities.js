import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import { Card, Pressable, Heading, ScrollView, 
  FormControl, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, Textarea, TextareaInput
} from '@gluestack-ui/themed';

const CardSetUpActivities = () => {
  
  const [inputSearch, setInputSearch] = useState('');

  return (
    <View>
      
      <Card p="$5" borderRadius="$lg"  m="$3" maxWidth={400} style={styles.shadow}>

      </Card>

      <View>
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Comment</FormControlLabelText>
          </FormControlLabel>
          <Textarea                 
          // isDisabled={true}
          >
            <TextareaInput 
              value={inputSearch}
              onChangeText={(text) => setInputSearch(text)}
            />
          </Textarea>
          <FormControlHelper>
            <FormControlHelperText>Type your comment above</FormControlHelperText>
          </FormControlHelper>
        </FormControl>
      </View>
    </View>
  )
}

export default CardSetUpActivities

const styles = StyleSheet.create({})