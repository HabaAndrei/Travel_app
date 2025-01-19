import { View } from 'react-native'
import { useEffect, useState } from 'react'
import InputChanges from '../InputChanges.js';
import { getDataFromAsyncStorage, addDataToAsyncStorage } from '../../diverse.js';

const InputHotelAddress = (props) => {

  const [address, setAddress] = useState(props.hotelAddress || '');
  const [isModified, setIsModified] = useState(false);

  useEffect(()=>{
    if ( address?.trim() != props.hotelAddress ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  }, [address]);

  async function saveHotelAddress(){
    const rez = await getDataFromAsyncStorage("travelParameter");
    if(!rez.isResolved)return
    addDataToAsyncStorage("travelParameter", { ...rez.data, hotelAddress: address.trim()});
    props.setHotelAddress(address.trim());
    setIsModified(false);
    setAddress((prev)=>prev.trim());
  }

  function cancelSave(){
    setIsModified(true);
    setAddress(props.hotelAddress);
  }

  return (
    <View style={{paddingRight: 14, paddingLeft: 14, marginTop: 10}}>
      <InputChanges
        title={'Hotel address'}
        onChange={(text)=>setAddress(text)}
        value={address}
        pressOnSave={()=>saveHotelAddress()}
        pressOnCancel={()=>cancelSave()}
        isModified={isModified}
        placeholder='Write here your hotel address'
      />
    </View>
  )
}

export default InputHotelAddress;