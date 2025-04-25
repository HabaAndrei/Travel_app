import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image, Pressable, Dimensions } from 'react-native';
import { Heading, Center, Spinner } from '@gluestack-ui/themed';
import { useState } from 'react';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { EnvConfig } from '../providers/EnvConfig.js';
import CustomButton from '../CustomElements/CustomButton.js';
import { FirebaseAuth } from '../Firebase.js';
import { isBase64 } from '../diverse.js';
import * as FileSystem from 'expo-file-system';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function ViewSpinner(props) {
  return props.isLoading ? (
    <View style={styles.spinnerContainer}>
      <Spinner size="large" color="blue" style={{backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: '50%'}} />
    </View>
  ) : null;
}

const FindLocation = (props) => {
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState({});
  const [isImageNotFound, setImageNotFoud] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const firebaseAuth = new FirebaseAuth();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [7, 7],
      quality: 0,
    });
    if (result.canceled) return;

    const { height, width } = result.assets[0];

    const maxWidth = screenWidth * 0.9;
    const maxHeight = screenHeight * 0.5;
    let newWidth = width;
    let newHeight = height;

    if (width > maxWidth) {
      newWidth = maxWidth;
      newHeight = (height / width) * newWidth;
    }

    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = (width / height) * newHeight;
    }

    let image = result.assets[0].uri;

    if ( !isBase64(image) ) {
      let base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
      if (!base64.includes('data:image/jpeg;base64,')) {
        image = 'data:image/jpeg;base64,' + base64
      } else {
        image = base64;
      }
    }

    setImage({
      uri: image,
      width: newWidth,
      height: newHeight,
    });
  };

  async function analyseImage() {
    if (!image) return;
    setLoading(true);
    setDetails({});
    setImageNotFoud(false);

    try {
      const data = await axios.post(
        EnvConfig.getInstance().get('address_function_find_location'),
        { image: image.uri },
        { headers: { "Content-Type": "application/json" } }
      );
      setLoading(false);
      if (!data?.data?.isResolved) {
        props.addNotification("warning", "System error! Try again later");
      }
      if (data?.data?.data?.isFoundPlace === false) setImageNotFoud(true);
      setDetails(data?.data?.data);
    } catch (err) {
      setLoading(false);
      console.log(err);
      props.addNotification("warning", "System error! Try again later");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 20 }}>
      <ViewSpinner isLoading={isLoading} />
      <ScrollView>
        <Center style={styles.centerContainer}>
          <Heading>Find a Place</Heading>
          <Text style={styles.centerText}>
            Find a place based on an image that includes a building, landscape, or something that we can research about that place.
          </Text>
        </Center>

        <Pressable onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image.uri }}
              style={{
                width: image.width,
                height: image.height,
                alignSelf: 'center',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#a9a9a9',
              }}
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>You don’t have an image added</Text>
            </View>
          )}
        </Pressable>

        <CustomButton name={'Analyse image'} func={analyseImage} />

        {details?.isFoundPlace && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Location Details</Text>
            {details?.country && <Text style={styles.detailsText}>🌍 Country: {details.country}</Text>}
            {details?.city && <Text style={styles.detailsText}>🏙️ City: {details.city}</Text>}
            {details?.place && <Text style={styles.detailsText}>📍 Place: {details.place}</Text>}
            {details?.description && <Text style={styles.detailsText}>📝 Description: {details.description}</Text>}
          </View>
        )}

        {isImageNotFound && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Please add an image of a place with more context</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FindLocation;

const styles = StyleSheet.create({
  centerContainer: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centerText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginTop: 5,
  },
  noImageContainer: {
    width: '90%',
    height: 450,
    alignSelf: 'center',
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a9a9a9',
  },
  noImageText: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
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
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  detailsText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});