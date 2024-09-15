import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Card } from '@gluestack-ui/themed';

const MyComponent = () => {
  return (
    <View >
        <Card style={styles.container}
        size="md" variant="elevated" m="$3">
            <Pressable style={styles.button} onPress={() => {}}>
                <Text style={styles.text}>Buton 1</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => {}}>
                <Text style={styles.text}>Buton 2</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => {}}>
                <Text style={styles.text}>Buton 2</Text>
            </Pressable>
        </Card>


        <Card p="$5" borderRadius="$lg" maxWidth={360} m="$3">
        
        </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Aranjează elementele în linie
    justifyContent: 'space-between', // Distribuie spațiul între butoane
    padding: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default MyComponent;
