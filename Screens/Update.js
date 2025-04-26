import { StyleSheet, Text, View } from 'react-native'
import CustomButton from '../CustomElements/CustomButton';
import * as Linking from 'expo-linking';

const Update = (props) => {
  const handleUpdatePress = () => {
    Linking.openURL(props?.route?.params?.updateApp?.url);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Available!</Text>
      <Text style={styles.subtitle}>
        A new version of the app is available. Update now to get the latest features and improvements!
      </Text>
      <CustomButton name={'Update Now'} func={handleUpdatePress} />
    </View>
  )
}

export default Update

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
});