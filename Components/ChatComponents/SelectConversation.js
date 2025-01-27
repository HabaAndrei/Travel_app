import { StyleSheet, View } from 'react-native'
import {  Select, SelectInput, Icon, ChevronDownIcon, SelectIcon, SelectItem,
  SelectTrigger, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator,
  SelectDragIndicatorWrapper, } from '@gluestack-ui/themed';

/** Component that represents a custom select element */
const SelectConversation = (props) => {

  return (
    <View style={{width: 100}} >
      <Select onValueChange={props.setIdSelectedConversation}>
        <SelectTrigger  size="sm" >
          <SelectInput placeholder="Chats" />
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
            {props.conversations.map((ob)=>{
              return <SelectItem key={ob.id} label={ob.name} value={ob.id} />
            })}
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>
  )
}

export default SelectConversation

const styles = StyleSheet.create({})