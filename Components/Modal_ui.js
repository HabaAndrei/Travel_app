import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';

const Modal_ui = () => {
    const [visible, setVisible] = useState(true);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const containerStyle = {
        backgroundColor: 'white', 
        padding: 50,
        borderRadius: 10,
        zIndex: 1000, 
        // modalBacks: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     zIndex: 10000, // Asigură-te că modalul este deasupra altor elemente
    // }
    };

    return (
        <PaperProvider>
            <Portal>
                <Modal 
                    visible={visible} 
                    onDismiss={hideModal} 
                    contentContainerStyle={containerStyle}
                >
                    <Text>Example Modal. Click outside this area to dismiss.</Text>
                </Modal>
            </Portal>
        </PaperProvider>
    );
}

export default Modal_ui;

const styles = StyleSheet.create({
    
});
