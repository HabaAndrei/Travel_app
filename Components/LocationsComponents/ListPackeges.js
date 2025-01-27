import { StyleSheet, Text, View, Pressable } from 'react-native'

/** This component represents a list of packages for each location */
const ListPackeges = (props) => {
  return (
    <View>
      {props?.dataTimeLocation?.packages ? (
        <View style={styles.container}>
          {props?.dataTimeLocation?.packages.map((ob, index) => {
            const isSelected = ob.selected;
            return (
              <Pressable
                onPress={() => props.selectPackage(props.indexLocation, index)}
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
                  {ob?.package_description}
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
    flexDirection: 'column',
    padding: 10,
  },
  navButton: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    height: 'auto',
    width: '100%',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
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
    color: '#333',
  },
  averageTimeText: {
    fontSize: 16,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
  unselectedText: {
    color: '#0B3D91',
  },
});
