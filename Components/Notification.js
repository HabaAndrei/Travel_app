import { StyleSheet } from 'react-native'
import { Alert, AlertIcon, Pressable, AlertText, InfoIcon, Icon, CloseIcon,
  Center } from "@gluestack-ui/themed"

/** Notification component for the entire app */
const Notification = (props) => {
  function deleteNotification(id) {
    let newAr = [];
    props.setNotification((prev) => {
      for (let i = 0; i < prev.length; i++) {
        if (prev[i].id !== id) newAr.push(prev[i]);
      }
      return [...newAr];
    });
  };

  return (
    <Center style={styles.centerContainer}>
      {props.notification.map((ob, index) => (
        <Alert
          key={index}
          mx="$2.5"
          action={ob.type}
          variant="solid"
          style={styles.alertContainer}
        >
          <AlertIcon
            as={InfoIcon}
            mr="$3"
          />
          <AlertText>{ob.mes}</AlertText>
          <Pressable onPress={() => deleteNotification(ob.id)}>
            <Icon
              as={CloseIcon}
              m="$2"
              w="$4"
              h="$4"
            />
          </Pressable>
        </Alert>
      ))}
    </Center>
  );
}

export default Notification;

const styles = StyleSheet.create({
  centerContainer: {
    position: 'absolute',
    zIndex: 9000,
    width: 385,
    marginTop: 50,
    alignSelf: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    margin: 10,
  },
});
