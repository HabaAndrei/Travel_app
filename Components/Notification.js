import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Alert, AlertIcon,Center,  AlertText, InfoIcon, Icon, CloseIcon } from "@gluestack-ui/themed"

const Notification = () => {
  return (
    <View style={{position: 'absolute',  zIndex: 9999,  width: 385 }} >

    <Alert mx="$2.5" action="warning" variant="solid"
     style={{margin: 10}}
     >
        <AlertIcon as={InfoIcon} mr="$3" />
        <AlertText>
            We have updated our terms of service. Please review and accept to continue
            using our service.
        </AlertText>
        <Icon as={CloseIcon} m="$2" w="$4" h="$4" />

    </Alert>

    <Alert mx="$2.5" action="success" variant="solid" 
      style={{margin: 10}}
    >
        <AlertIcon as={InfoIcon} mr="$3" />
        <AlertText>
            We have updated our terms of service. Please review and accept to continue
            using our service.
        </AlertText>
        <Icon as={CloseIcon} m="$2" w="$4" h="$4" />

    </Alert>
    <Alert mx="$2.5" action="error" variant="solid"
      style={{margin: 10}}
    >
        <AlertIcon as={InfoIcon} mr="$3" />
        <AlertText>
            We have updated our terms of service. Please review and accept to continue
            using our service.
        </AlertText>
        <Icon as={CloseIcon} m="$2" w="$4" h="$4" />

    </Alert>
    
    </View>
  )
}

export default Notification

const styles = StyleSheet.create({})