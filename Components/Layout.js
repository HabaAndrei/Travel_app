import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Icon, AddIcon } from "@gluestack-ui/themed";

const Layout = ({ children, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>

      <View style={styles.footerContainer}>
        <ScrollView 
          horizontal={true} 
          style={styles.footer} 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.footerContent}
        >
          <Pressable style={styles.pressable} onPress={() => navigation.navigate('Home')} >
            <Icon as={AddIcon} m="$2" w="$4" h="$4" />
            <Text style={styles.pressableText}>Home</Text>
          </Pressable>

          <Pressable style={styles.pressable} onPress={() => navigation.navigate('Program')} >
            <Icon as={AddIcon} m="$2" w="$4" h="$4" />
            <Text style={styles.pressableText}>Program</Text>
          </Pressable>
          

          


        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20, 
    backgroundColor: '#e0e0e0', 

  },
  content: {
    flex: 1,
  },
  footerContainer: {
    height: 60, 
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  footer: {
    flex: 1,
  },
  footerContent: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  pressable: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10, 
    padding: 10, 
    borderRadius: 8, 
  },
  pressableText: {
    marginTop: 4,
    fontSize: 12, 
    color: '#333', 
  },
});

export default Layout;
