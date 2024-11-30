import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'

const ListPackeges = (props) => {

  return (
    <View>
      {props?.dataTimeLocation?.packages ? (
        <View style={styles.container}>
          {Object.values(props?.dataTimeLocation?.packages).map((ob, index) => {
            const isSelected = ob.selected;
            return (
              <Pressable
                onPress={()=>props.selectPackage(props.indexLocation, index)}
                key={index}
                style={[
                  styles.navButton,
                  isSelected ? styles.selectedButton : styles.unselectedButton,
                ]}
              >
                <Text
                  style={[
                    styles.nameText,
                    isSelected ? styles.selectedText : styles.unselectedText,
                  ]}
                >
                  {ob.name}
                </Text>
                <Text
                  style={[
                    styles.averageTimeText,
                    isSelected ? styles.selectedText : styles.unselectedText,
                  ]}
                >
                  Average time: {ob.average_visiting_hours} h
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};

export default ListPackeges;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    height: 120,
    width: '45%',
    marginVertical: 10,
  },
  selectedButton: {
    backgroundColor: '#0B3D91',
  },
  unselectedButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0B3D91',
  },
  nameText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  averageTimeText: {
    fontSize: 14,
  },
  selectedText: {
    color: '#fff',
  },
  unselectedText: {
    color: '#0B3D91',
  },
});
