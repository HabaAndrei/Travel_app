import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>

      <View style={styles.topSection}>
        <Text style={styles.text}>Partea de Sus (50px)</Text>
      </View>

      <ScrollView style={styles.middleSection}>
        <Text style={styles.text}>Partea de Mijloc (Restul)</Text>
        {Array.from({ length: 20 }, (_, i) => (
          <Text key={i} style={styles.scrollText}>
            Element {i + 1}
          </Text>
        ))}
      </ScrollView>

      <View style={styles.bottomSection}>
        <Text style={styles.text}>Partea de Jos (50px)</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topSection: {
    height: 50, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleSection: {
    flex: 1,
    padding: 10,
  },
  bottomSection: {
    height: 50, 
    backgroundColor: '#4682b4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },
  scrollText: {
    marginVertical: 5,
    fontSize: 16,
  },
});

export default App;
