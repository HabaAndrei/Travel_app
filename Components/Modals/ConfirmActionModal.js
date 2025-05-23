import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';

/** Modal that represent a verification for client to think if they realy want to do that operation */
const ConfirmActionModal = (props) => {

  const closeWithResponse = (response) => {
    props.handleModalResponse(response);
    props.setConfirmActionModal(false);
  };

  return (
   <View>
    {props.isConfirmActionModal ?

      <View style={styles.centeredView}>
        <Modal
        animationType="slide"
        transparent={true}
        >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text style={styles.modalText}>
                Are you sure you want to do this ?
            </Text>

            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.button, styles.buttonYes]}
                    onPress={() => closeWithResponse(true)}
                >
                    <Text style={styles.textStyle}>Yes</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, styles.buttonNo]}
                    onPress={() => closeWithResponse(false)}>
                    <Text style={styles.textStyle}>No</Text>
                </Pressable>
            </View>
            </View>
        </View>
        </Modal>
      </View>

    :<View></View> }
   </View>
  );
};

export default ConfirmActionModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '40%',
  },
  buttonYes: {
    backgroundColor: '#4CAF50',
  },
  buttonNo: {
    backgroundColor: '#F44336',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
