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
          props.name === 'SetUpTrip' ? styles.activeText : styles.inactiveText // Schimbăm culoarea textului
        ]}>Set up trip</Text>
        <Text style={props.name === 'SetUpTrip' ? styles.activeStepText : styles.stepText}>Step 1</Text>
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
          props.name === 'Locations' ? styles.activeText : styles.inactiveText // Schimbăm culoarea textului
        ]}>Locations</Text>
        <Text style={props.name === 'Locations' ? styles.activeStepText : styles.stepText}>Step 2</Text>
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
          props.name === 'Program' ? styles.activeText : styles.inactiveText // Schimbăm culoarea textului
        ]}>Program</Text>
        <Text style={props.name === 'Program' ? styles.activeStepText : styles.stepText}>Step 3</Text>
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
    backgroundColor: '#0B3D91', 
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  navButtonText: {
    fontSize: 16,
  },
  stepText: {
    fontSize: 12,
    color: '#FFFFFF', 
    marginTop: 4,
  },
  activeStepText: {
    fontSize: 12,
    color: '#000000', 
    marginTop: 4,
  },
  activeButton: {
    backgroundColor: '#007AFF', 
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
  },
  activeText: {
    color: '#000000', 
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#FFFFFF', 
    fontWeight: 'bold',
  },
  pressedButton: {
    opacity: 0.85,
  },
});

