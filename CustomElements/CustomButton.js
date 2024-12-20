import { StyleSheet, Text, View } from 'react-native';
import { Button, Icon } from "@gluestack-ui/themed";

const CustomButton = (props) => {

  return (
    <View style={styles.buttonContainer}>
      <Button style={[styles.button, styles.shadow]}
        onPress={()=>{
          if(JSON.stringify(props?.paramFunc)?.length && typeof(props?.paramFunc) != 'undefined'){
            return props.func(props.paramFunc);
          }else{
            return props.func()
          }
        }}
      >
        <Text style={styles.buttonText}>{props.name}</Text>
        {props.icon ?
        <Icon as={props.icon} color="white" style={styles.icon} />
        :
        null
        }
      </Button>
    </View>
  )
}

export default CustomButton

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B3D91',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 180,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    color: 'white',
    marginRight: 8,
    marginLeft: 3
  },
})