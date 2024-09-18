import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Icon, GlobeIcon, CalendarDaysIcon } from "@gluestack-ui/themed";

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
            <Icon as={GlobeIcon} m="$2" w="$5" h="$5"  color="white"/>
            <Text style={styles.pressableText}>Home</Text>
          </Pressable>

          <Pressable style={styles.pressable} onPress={() => navigation.navigate('Program')} >
            <Icon as={CalendarDaysIcon} m="$2" w="$5" h="$5" color="white" />
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
    paddingTop: 50,
    backgroundColor: '#AAAABAD', 
  },
  content: {
    flex: 1,
  },


  footerContainer: {
    height: 80, 
    paddingBottom: 20, 
    backgroundColor: '#040404',
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
    color: 'white', 
  },
});

export default Layout;


// Golden top: #d8ab4e

// Golden bottom: #b48c36

// Charcoal Black: #040404