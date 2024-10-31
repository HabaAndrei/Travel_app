import { View, Text, Pressable, StyleSheet } from 'react-native';
import React from 'react';

const NavbarProgram = (props) => {

  function navigateSetUpTrip() {
    if (props.name === 'SetUpTrip') return;
    props.navigation.navigate('SetUpTrip');
  }

  function navigateLocations() {
    if (props.name === 'Locations') return;
    props.navigation.navigate('Locations');
  }

  function navigateProgram() {
    if (props.name === 'Program') return;
    props.navigation.navigate('Program');
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.navButton,
          props.name === 'SetUpTrip' && styles.activeButton,
          pressed && styles.pressedButton,
        ]}
        onPress={navigateSetUpTrip}
      >
        <Text style={[
          styles.navButtonText,
          props.name === 'SetUpTrip' && styles.activeText
        ]}>Set up trip</Text>
        <Text style={styles.stepText}>Step 1</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.navButton,
          props.name === 'Locations' && styles.activeButton,
          pressed && styles.pressedButton,
        ]}
        onPress={navigateLocations}
      >
        <Text style={[
          styles.navButtonText,
          props.name === 'Locations' && styles.activeText
        ]}>Locations</Text>
        <Text style={styles.stepText}>Step 2</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.navButton,
          props.name === 'Program' && styles.activeButton,
          pressed && styles.pressedButton,
        ]}
        onPress={navigateProgram}
      >
        <Text style={[
          styles.navButtonText,
          props.name === 'Program' && styles.activeText
        ]}>Program</Text>
        <Text style={styles.stepText}>Step 3</Text>
      </Pressable>
    </View>
  );
};

export default NavbarProgram;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#f2f2f2',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  navButtonText: {
    fontSize: 16,
    color: '#333',
  },
  stepText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#007AFF',
  },
  activeText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  pressedButton: {
    opacity: 0.7,
  },
});
