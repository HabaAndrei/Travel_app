import React, { useEffect, useState } from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, 
  Platform, Keyboard } from 'react-native';
import { Icon, ChevronsRightIcon } from '@gluestack-ui/themed';
import {askQuestion, storeConv, storeMes, getConversations, getMessages} from '../firebase.js';
import SelectConversation from '../Components/SelectConversation';
import { useIsFocused } from '@react-navigation/native'; 
import uuid from 'react-native-uuid';

const App = () => {

  const isFocused = useIsFocused();
  const [message, setMessage] = useState('');
  const [conversation , setConversation] = useState([]);
  const [conversations, setConversations] = useState([{id: 1, name: 'ok'}, {id: 2, name: 'ok2'}, {id: 3, name: 'ok3'}]);
  const [selectedConversation, setSelectedConversation] = useState('');

  useEffect(()=>{
    if(!isFocused)return;
    getConvs();
  }, []);

  useEffect(()=>{
    if(selectedConversation){getMess(selectedConversation)}
  }, [selectedConversation])

  async function getMess(idConv){
    const data = await getMessages(idConv);
    if(data.type){
      const mess = data?.data?.map((ob)=>{return {type: ob.type, mes: ob.mes}})
      setConversation(mess);
    }
  }

  async function getConvs(){
    const data = await getConversations();
    if(data.type){
      const convs = data.data.map((ob)=>{return {id: ob.id, name: ob.name}})
      setConversations(convs);
    }
  }


  async function getResponse(conv, idConv){
    const data = await askQuestion(conv);
    if(data.type){
      setConversation((prev)=>{
        const newConv = prev.map((ob)=>{
          return ob.type === 'pending' ? {type: "ai", mes: data?.data} : ob
        })
        return [...newConv];
      })
      const time = new Date().getTime();
      storeMes(idConv, 'ai', data?.data, time);

    }else{
      console.log('we catch err', data.err);
    }
  }

  function sendMes(){
    if(!message.replaceAll(' ', '').length)return;
    let conv = '';
    setConversation((prev)=>{
       conv = [...prev, {type: 'user', mes: message}, {type: 'pending'}];
      return [...conv];
    })
    const time = new Date().getTime();
    let uuidConv = uuid.v4().slice(0, 5);
    let name = conv[0].mes.slice(0, 15);
    if(!selectedConversation){
      setConversations((prev) => [...prev, {id: uuidConv, name}])
      setSelectedConversation({id: uuidConv, name});
      storeConv(uuidConv, name);
    }else{
      uuidConv = selectedConversation.id;
      name = selectedConversation.name;
    }
    getResponse(conv, uuidConv);
    storeMes(uuidConv, 'user', message, time);
    setMessage('');
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
    >
      <View style={styles.container}>

        <View style={styles.topSection}>
          <SelectConversation setSelectedConversation={setSelectedConversation} conversations={conversations}/>
        </View>

        <View style={styles.middleSectionContainer}>
          <ScrollView
            style={styles.middleSection}
            contentContainerStyle={styles.middleContent}
          >
            {conversation.map((ob, index) => {
              return (
                <View 
                  key={index} 
                  style={ob.type === 'ai' || ob.type === 'pending' ? styles.receivedMessage : styles.sentMessage}
                >
                  <Text>{ob.mes}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>


        <View style={styles.bottomSection}>
          <TextInput
            style={styles.input}
            placeholder="Write your message..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="gray"
            onSubmitEditing={Keyboard.dismiss} 
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMes} >
            <Icon as={ChevronsRightIcon} m="$2" w="$4" h="$4" color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
  },
  middleSectionContainer: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    paddingBottom: 50,
  },
  middleSection: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  middleContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  bottomSection: {
    position: 'absolute', 
    bottom: 0, 
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f1f1f1',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#0B3D91',
    padding: 7,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sentMessage: {
    alignSelf: 'flex-end',  
    backgroundColor: '#0B3D91',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '70%',
  },
  receivedMessage: {
    alignSelf: 'flex-start', 
    backgroundColor: '#e5e5e5',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '70%',
  },
});


export default App;
