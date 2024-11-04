import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Heading, HStack, CheckCircleIcon, Icon, AlertDialogBackdrop, AlertDialogHeader,  AlertDialog, AlertDialogContent, 
  AlertDialogFooter, ButtonText, Button, Center, AlertDialogBody } from '@gluestack-ui/themed'

const InfoChatSetUpTrip = (props) => {
  return (
    <>
      <AlertDialog
        isOpen={props.isOpenInfoChat}
        onClose={() => {
          props.setOpenInfoChat(false)
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader borderBottomWidth="$0">
            <HStack space="sm" alignItems="center">
              <Icon
                as={CheckCircleIcon}
                color="$success700"
                $dark-color="$success300"
              />
              <Heading size="lg">Order placed</Heading>
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="sm">
              Congratulations, your order has been placed! You will receive a
              confirmation email shortly. Thank you for shopping with us.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter borderTopWidth="$0">
            <Button
              variant="outline"
              size="sm"
              action="secondary"
              mr="$3"
              onPress={() => {
                props.setOpenInfoChat(false)
              }}
            >
              <ButtonText>Okay</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  ) 
}

export default InfoChatSetUpTrip

const styles = StyleSheet.create({})