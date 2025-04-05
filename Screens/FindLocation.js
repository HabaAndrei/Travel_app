import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable } from 'react-native';
import { Heading, Center } from '@gluestack-ui/themed';
import { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { EnvConfig } from '../providers/EnvConfig.js';
import CustomButton from '../CustomElements/CustomButton.js';

const FindLocation = (props) => {

  const [image, setImage] = useState('');
  const [details, setDetails] = useState({});
  const [isImageNotFound, setImageNotFoud] = useState(false);
  const [isLoading, setLoading] = useState(false);

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
    if (!image) return;
    setLoading(true);
    const data = await axios.post(
      EnvConfig.getInstance().get('address_function_find_location'),
      {image}, { headers: { "Content-Type": "application/json"}}
    );
    setLoading(false);
    if (!data.data.isResolved) {
      props.addNotification("warning", "System error! Try again later");
    }
    setDetails(data?.data?.data)
  }

  return (
    <SafeAreaView style={{flex: 1}} >
      <ScrollView>

        <Center>
          <Heading>Find a place</Heading>
        </Center>

        <Pressable onPress={pickImage} >
          {image ? (
            <Image source={{ uri: image }} style={{width: '90%', height: 450, alignSelf: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#a9a9a9'}} />
          ) : (
            <View style={styles.noImageContainer} >
              <Text style={styles.noImageText}>You don’t have an image added</Text>
            </View>
          )}
        </Pressable>

        <CustomButton name={'Analyse image'} func={analyseImage} />

        {details?.isFoundPlace ? (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Location Details</Text>
            {details?.country && <Text style={styles.detailsText}>🌍 Country: {details.country}</Text>}
            {details?.city && <Text style={styles.detailsText}>🏙️ City: {details.city}</Text>}
            {details?.place && <Text style={styles.detailsText}>📍 Place: {details.place}</Text>}
            {details?.description && <Text style={styles.detailsText}>📝 Description: {details.description}</Text>}
          </View>
        ) : null}

      </ScrollView>
    </SafeAreaView>
  )
}

export default FindLocation

const styles = StyleSheet.create({
  noImageContainer: {
    width: '90%',
    height: 450,
    alignSelf: 'center',
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a9a9a9'
  },
  noImageText: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold'
  },
  detailsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center'
  },
  detailsText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5
  }
});