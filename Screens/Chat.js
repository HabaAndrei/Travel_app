import { useEffect, useState } from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView,
  Platform, Keyboard, Pressable} from 'react-native';
import {FirebaseFirestore} from '../Firebase.js';
import SelectConversation from '../Components/ChatComponents/SelectConversation.js';
import { useIsFocused } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import FontAwesome from '@expo/vector-icons/FontAwesome';

/** Chat screen */
const Chat = (props) => {

  const isFocused = useIsFocused();
  const [message, setMessage] = useState('');
  const [conversation , setConversation] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [idSelectedConversation, setIdSelectedConversation] = useState('');

  const firebaseFirestore = new FirebaseFirestore();

  useEffect(()=>{
    if(!isFocused)return;
    getConversations();
  }, []);

  useEffect(()=>{
    if(idSelectedConversation){_getMessages(idSelectedConversation)}
  }, [idSelectedConversation])

  async function _getMessages(idConv){
    const data = await firebaseFirestore.getMessages(idConv);
    if(data.isResolved){
      const mess = data?.data?.map((ob)=>{return {type: ob.type, mes: ob.mes}});
      if(!mess.length)return;
      setConversation(mess);
    }
  }

  async function getConversations(){
    const data = await firebaseFirestore.getConversations();
    if(data.isResolved){
      const convs = data.data.map((ob)=>{return {id: ob.id, name: ob.name}})
      setConversations(convs);
    }
  }

  async function getResponse(conv, idConv){
    const data = await firebaseFirestore.askQuestion(conv);
    if(data.isResolved){
      setConversation((prev)=>{
        const newConv = prev.map((ob)=>{
          return ob.type === 'pending' ? {type: "ai", mes: data?.data} : ob
        })
        return [...newConv];
      })
      const time = new Date().getTime();
      firebaseFirestore.addIntoDatabase({
        database: 'messages',
        id: false,
        columnsWithValues: {uid: props.user.uid, idConv, type: 'ai', mes: data?.data, time}
      });
    }else{
      props.addNotification("warning", "An error occurred while generating the message");
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
    let uuidConv = '';
    if(!idSelectedConversation){
      uuidConv = uuid.v4().slice(0, 5);
      const name = conv[0].mes.slice(0, 15);
      setConversations((prev) => [...prev, {id: uuidConv, name}])
      setIdSelectedConversation({id: uuidConv, name});
      firebaseFirestore.addIntoDatabase({
        database: 'conversations',
        id: false,
        columnsWithValues: {uid: props.user.uid, id: uuidConv, name}
      });
    }else{
      uuidConv = idSelectedConversation;
    }
    getResponse(conv, uuidConv);

    firebaseFirestore.addIntoDatabase({
      database: 'messages',
      id: false,
      columnsWithValues: {uid: props.user.uid, idConv: uuidConv, type: 'user', mes: message, time}
    });

    setMessage('');
  }

  async function _deleteChat(){
    if(!idSelectedConversation)return;
    const response = await props.areYouSure();
    if (!response) return;
    firebaseFirestore.deleteChat(idSelectedConversation);
    setConversations((prev)=>{
      let newConvs = [];
      prev.forEach((ob)=>{
        if(ob.id != idSelectedConversation)newConvs.push(ob);
      });
      return [...newConvs];
    })
    newChat();
  }

  function newChat(){
    setConversation([]);
    setIdSelectedConversation('');
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
          <Pressable onPress={_deleteChat} style={styles.sideButton}>
            <Text style={styles.buttonText}>Delete chat</Text>
          </Pressable>
          <SelectConversation setIdSelectedConversation={setIdSelectedConversation} conversations={conversations} />
          <Pressable onPress={newChat} style={styles.sideButton}>
            <Text style={styles.buttonText}>New chat</Text>
          </Pressable>
        </View>

        <View style={styles.middleSectionContainer}>

          {conversation.length ?
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
                    <Text style={ob.type !== 'ai' && ob.type !== 'pending' ? styles.sentMessageText : null}>
                      {ob.mes}
                    </Text>
                  </View>
                );
              })}
            </ScrollView> :
            <View style={styles.viewText}>
              <Text style={styles.greetingText}>
                ✨ Hey, I'm your personal assistant Eric! ✨{"\n\n"}
                🚀 I'll answer any questions about the app's features{"\n"}
                📅 Provide details about your travel itinerary{"\n"}
                💬 And much more!{"\n\n"}
              </Text>
            </View>
          }
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
            <FontAwesome name="send-o" size={18} color="white" />
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
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sideButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#0B3D91',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
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
    padding: 10,
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
  sentMessageText: {
    color: 'white',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e5e5e5',
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '70%',
  },
  viewText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333333',
    lineHeight: 26,
    marginVertical: 10,
  },
});


export default Chat;
