import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Pressable, View, ScrollView, Clipboard, TextInput } from 'react-native';
import { Card, Heading, Text, LinkText, Icon, HStack, Link, ArrowRightIcon } from '@gluestack-ui/themed';


const ModalDayProgram = (props) => {

  const [inputTest, setInputTest] = useState('');

  useEffect(() => {
    // console.log(props.modalVisible)
  }, [props.modalVisible]);

  function copyInClipboard(text){
    Clipboard.setString(text);
  }

  return (

    
    <View style={[styles.centeredView, { zIndex: 9998 }]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible.isOpen}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.title}>{props.modalVisible.data.title}</Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.date}>{props.modalVisible.data.date}</Text>
                <Text style={styles.dayText}>Day {props.modalVisible.data.day}</Text>
              </View>

              <View>
                {props.modalVisible?.data?.activities?.map((ob, index) => {
                  return (
                    
                    <Card key={index} p="$5" borderRadius="$lg" maxWidth={360} m="$3">
                      <Heading mb="$1" size="md">{ob.place}</Heading>
                      <Text  fontSize="$sm" fontStyle="normal" fontWeight="$normal" lineHeight="$sm" mb="$2" sx={{ color: "$textLight700" }}> 
                        {ob.time}
                      </Text>
                      <Text size="m" style={{marginTop: 10}} >
                        <Text bold={true} >Address: </Text> {ob.address}
                        <Text style={styles.buttonText} onPress={()=>copyInClipboard(`${ob.address}`)} >  Copy</Text>
                      </Text>
                      <Text size="m" style={{marginTop: 10}}>
                        <Text bold={true} >Info:</Text> {ob.info}
                      </Text>
                      <Text size="m" style={{marginTop: 10}} >  
                        <Text bold={true}  >Description: </Text>{ob.description}
                      </Text>
                      {ob.link ?
                        <Link href={ob.link} isExternal style={{marginTop: 20}} >
                          <HStack alignItems="center">
                            <LinkText size="sm" fontWeight="$semibold" color="$primary600" textDecorationLine="none">  More details </LinkText>
                            <Icon as={ArrowRightIcon} size="sm" color="$primary600" mt="$0.5" ml="$0.5" />
                          </HStack>
                        </Link>
                        : <Text></Text>
                      }
                    </Card>
                  );
                })}
              </View>


              <TextInput
        onChangeText={(e)=>{setInputTest(e); console.log(e)}}
        value={inputTest}
        placeholder="AAAAAAAAA"
        inputMode=''
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          padding: 10,
          borderRadius: 5,
          color: 'black',
          backgroundColor: 'white',
        
   
      }}
      />
            </ScrollView>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => props.setModalVisible((prev) => { return { ...prev, isOpen: false }; })}
            >
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>



            
          </View>
        </View>
      </Modal>
    </View>

  );
};

const styles = StyleSheet.create({
  buttonText:{
    fontSize: 16, 
    fontWeight: 'bold',
    marginTop: 10, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  date: {
    fontSize: 16,
    color: '#777',
    marginRight: 10,
  },
  dayText: {
    fontSize: 16,
    color: '#007AFF',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollViewContent: {
    flexGrow: 1, 
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 20, 
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ModalDayProgram;
