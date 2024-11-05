import { StyleSheet, Text, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import React from 'react';
import { 
  Heading, HStack, CheckCircleIcon, Icon, AlertCircleIcon, 
  AlertDialogBackdrop, AlertDialogHeader, AlertDialog, AlertDialogContent, 
  AlertDialogFooter, ButtonText, Button, Center, AlertDialogBody 
} from '@gluestack-ui/themed';

const ModalInfo = (props) => {
  const screenHeight = Dimensions.get('window').height;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AlertDialog
        isOpen={props.isOpenModalInfo}
        onClose={() => {
          props.setOpenModalInfo(false);
        }}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader borderBottomWidth="$0">
            <HStack space="sm" alignItems="center">
              <Icon
                as={AlertCircleIcon}
                color="blue"
                $dark-color="$success300"
              />
              <Heading size="lg">Info</Heading>
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            <ScrollView contentContainerStyle={{ paddingVertical: 10, maxHeight: screenHeight * 0.60 }}>
              <Text size="sm">
                {props.mes}
              </Text>
            </ScrollView>
          </AlertDialogBody>
          <AlertDialogFooter borderTopWidth="$0">
            <Button
              variant="outline"
              size="sm"
              action="secondary"
              mr="$3"
              onPress={() => {
                props.setOpenModalInfo(false);
              }}
            >
              <ButtonText>Okay</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
};

export default ModalInfo;

const styles = StyleSheet.create({});
