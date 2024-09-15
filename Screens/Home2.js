import React, {useState, useEffect} from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Card } from '@gluestack-ui/themed';
import SearchDestination from '../Components/SearchDestination';
import Calendar from '../Components/Calendar';

const MyComponent = () => {

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState({type: false, date:''});

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
            <SearchDestination/>
        </Card>

        <Card size="md" variant="elevated" m="$3">
            <Text>okok</Text>
            <Calendar  dateFrom={dateFrom} setDateFrom={setDateFrom} 
            isDatePickerVisible={isDatePickerVisible} setDatePickerVisibility={setDatePickerVisibility} />
        </Card>

        <Card size="md" variant="elevated" m="$3">
            <Text>okok</Text>
            <Calendar  dateFrom={dateTo} setDateFrom={setDateTo} 
            isDatePickerVisible={isDatePickerVisible} setDatePickerVisibility={setDatePickerVisibility}/>
        </Card>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
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
