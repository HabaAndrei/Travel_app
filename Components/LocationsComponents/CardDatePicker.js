import { StyleSheet, Text, View } from 'react-native';
import {formatDateFromMilliseconds} from '../../diverse.js';
import { Card } from '@gluestack-ui/themed';
import DatePicker from '../Pickers/DatePicker.js';

/** Date picker that helps to create the program */
const CardDatePicker = (props) => {
  const date = (data) => new Date(formatDateFromMilliseconds(data)).toString().slice(0, 15)
  return (
    <View style={{ alignItems: 'center' }}>
      <Card
        style={styles.shadow}
        size="md"
        variant="elevated"
        m="$3"
        maxWidth={600}
      >
        <Text style={styles.title}>Select Your Date Range</Text>
        <View style={styles.row}>
          <View style={styles.buttonContainer}>
            {props.dateFrom ? (
              <Text style={styles.centeredBoldText}>
                From: {date(props.dateFrom)}
              </Text>
            ) : (
              <Text></Text>
            )}
            <DatePicker
              name={'Select start date'}
              getDate={(date)=>{
                props.setDateFrom(date)
              }}
            />
          </View>

          <View style={styles.buttonContainer}>
            {props.dateTo ? (
              <Text style={styles.centeredBoldText}>
                To: {date(props.dateTo)}
              </Text>
            ) : (
              <Text></Text>
            )}
            <DatePicker
              name={'Select end date'}
              getDate={(date)=>{
                props.setDateTo(date)
              }}
            />
          </View>
        </View>
      </Card>
    </View>
  )
}

export default CardDatePicker

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    flex: 1,
    width: 150
  },
  centeredBoldText: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  shadow:{
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
})
