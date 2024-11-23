import React, { useState } from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, 
  Platform, Keyboard } from 'react-native';
import { Icon, ChevronsRightIcon } from '@gluestack-ui/themed';

const App = () => {
  const [message, setMessage] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} 
    >
      <View style={styles.container}>

        <View style={styles.topSection}>
          <Text style={styles.text}>Partea de Sus (Fixă)</Text>
        </View>

        <View style={styles.middleSectionContainer}>
          <ScrollView
            style={styles.middleSection}
            contentContainerStyle={styles.middleContent}
          >
            <Text style={styles.text}>Partea de Mijloc (Scroll Separat)</Text>
            {Array.from({ length: 50 }, (_, i) => (
              <Text key={i} style={styles.scrollText}>
                Element {i + 1}
              </Text>
            ))}
          </ScrollView>
        </View  >

        <View style={styles.bottomSection}>
          <TextInput
            style={styles.input}
            placeholder="Write your message..."
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="gray"
            onSubmitEditing={Keyboard.dismiss} 
          />
          <TouchableOpacity style={styles.sendButton}>
            <Icon as={ChevronsRightIcon} m="$2" w="$4" h="$4" color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF', 
  },
  middleSectionContainer: {
    flex: 1,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    paddingBottom: 50
  },
  middleSection: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  middleContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  bottomSection: {
    position: 'absolute', 
    bottom: 0, 
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#f1f1f1',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 18,
  },
  scrollText: {
    marginVertical: 5,
    fontSize: 16,
  },
});

export default App;
