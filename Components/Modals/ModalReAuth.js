import { StyleSheet, View, Modal } from 'react-native';
import { useEffect, useState } from 'react';
import { Input, InputField, Heading, Text } from '@gluestack-ui/themed';
import { FirebaseAuth } from '../../Firebase.js';
import CustomButton from '../../CustomElements/CustomButton.js';

const ModalReAuth = (props) => {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const firebaseAuth = new FirebaseAuth();

  async function reauthenticate() {
    if (!password.length) {
      setErr('Please add your password');
      return;
    }
    const rez = await firebaseAuth.reAuth(password);
    if (!rez.isResolved) {
      setErr('The password is not correct');
    } else {
      props.setModalVisibleReAuth(false);
    }
  }

  useEffect(() => {
    if (err) setErr('');
  }, [password]);

  function closeModal() {
    props.setModalVisibleReAuth(false);
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.isModalVisibleReAuth}
        onRequestClose={() => {
          props.setModalVisibleReAuth(false);
        }}
      >
        <View style={styles.modalView}>
          <View>
            <Heading>To perform this operation, you must re-authenticate</Heading>
            <Text color="$text500" lineHeight="$xs" style={{ marginTop: 10 }}>
              Password
            </Text>
            <Input>
              <InputField
                type="text"
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </Input>
            {err ? (
              <Text
                color="$text500"
                lineHeight="$xs"
                style={{ marginTop: 5, color: 'red' }}
              >
                {err}
              </Text>
            ) : (
              <Text></Text>
            )}
            <CustomButton name={'Reauthenticate'} func={reauthenticate} />
          </View>
          <CustomButton name={'Close'} func={closeModal} />
        </View>
      </Modal>
    </View>
  );
};

export default ModalReAuth;

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
});
