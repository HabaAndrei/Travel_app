import { View } from 'react-native'
import { useEffect, useState } from 'react'
import InputChanges from '../InputChanges.js';
import { FirebaseFirestore } from '../../Firebase.js';

/** Input for hotel address from the Trip Screen */
const InputHotelAddress = (props) => {

  const [address, setAddress] = useState(props.hotelAddress || '');
  const [isModified, setIsModified] = useState(false);

  const firebaseFirestore = new FirebaseFirestore();

  useEffect(()=>{
    if ( address.trim() != props.hotelAddress ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [address]);

  useEffect(()=>{
    if (props.hotelAddress === address) return;
    setAddress(props.hotelAddress);
  }, [props.hotelAddress])


  async function saveHotelAddress(){
    const trimAddress = address.trim();
    props.setHotelAddress(trimAddress);
    setIsModified(false);
    setAddress(trimAddress);
    const result = await firebaseFirestore.updateColumnsDatabase({
      database: 'programs',
      id: props.idFromDatabase,
      columnsWithValues: {
        'hotelAddress': trimAddress
      }
    });
  }

  function cancelSave(){
    setIsModified(false);
    setAddress(props.hotelAddress);
  }


  return (
    <View style={{
      paddingRight: 14,
      paddingLeft: 14,
      marginTop: 10,
    }}>
      <InputChanges
        title={'Hotel address'}
        onChange={(text) => setAddress(text)}
        value={address}
        pressOnSave={() => saveHotelAddress()}
        pressOnCancel={() => cancelSave()}
        isModified={isModified}
        placeholder='Write here your hotel address'
      />
    </View>
  )
}

export default InputHotelAddress;