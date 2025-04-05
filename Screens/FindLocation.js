import { StyleSheet, Text, View, SafeAreaView, ScrollView, Button, Image } from 'react-native'
import {useState, useEffect} from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { EnvConfig } from '../providers/EnvConfig.js';

const FindLocation = () => {

  /////////////////////////////////
  const [image, setImage] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  async function analyseImage(){
    if (!image) {
      console.log('please select an image');
      return;
    }


    const data = await axios.post(EnvConfig.getInstance().get('address_function_find_location'),
      {image},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },

    );
    console.log(data.data);

  }

  /////////////////////////////////
  return (
    <SafeAreaView style={{flex: 1}} >
      <ScrollView>

        {/* ------------------------------------ */}

        <Button title="Pick an image from camera roll" onPress={pickImage} />


        {image ?
          <Image source={{ uri: image }} style={{width: 200, height: 200}} />
          : null
        }

        <Button title={'Analyse image'} onPress={analyseImage} />

        {/* ------------------------------------ */}

      </ScrollView>
    </SafeAreaView>
  )
}

export default FindLocation

const styles = StyleSheet.create({})