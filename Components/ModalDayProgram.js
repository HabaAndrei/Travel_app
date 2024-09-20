import React, {useState, useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import {Card, Heading} from "@gluestack-ui/themed";



const ModalDayProgram = (props) => {


  useEffect(()=>{

    // console.log(props.modalVisible)
  }, [props.modalVisible])

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible.isOpen}
        >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            
            <Card p="$5" borderRadius="$lg" maxWidth={360} m="$3">
              <Heading size="md" fontFamily="$heading" mb="$4">
                The Power of Positive Thinking
              </Heading>

              {/* aici adaug sa se vada fain pentru utilizator */}



            </Card>
            
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => props.setModalVisible((prev)=>{return {...prev, isOpen:false}})}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 30,
    marginTop: 90,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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