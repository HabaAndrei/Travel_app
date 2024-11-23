import { StyleSheet, Text, View } from 'react-native'
import React, {useState} from 'react'
import { Card, Heading, Select, SelectInput, Icon, ChevronDownIcon, 
  SelectIcon, SelectItem, ButtonText, Button, 
  SelectTrigger, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, 
  SelectDragIndicatorWrapper, 
  TextareaInput, Textarea  } from '@gluestack-ui/themed';

const SelectConversation = () => {

  const [conservations, setConversations] = useState(['ok', 'ok2', 'ok3']);
  const [selectedConversation, setSelectedConversation] = useState('');

  return (
    <View style={{width: 100}} >
      <Select onValueChange={setSelectedConversation}>
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
            {conservations.map((name, index)=>{
              return <SelectItem key={index} label={name} value={name} />
            })}
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>
  )
}

export default SelectConversation

const styles = StyleSheet.create({})