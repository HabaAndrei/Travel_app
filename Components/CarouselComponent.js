import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth } = Dimensions.get('window');
const sliderWidth = viewportWidth;
const itemWidth = viewportWidth * 0.75;

const CarouselComponent = () => {
  const data = [
    { title: 'Item 1' },
    { title: 'Item 2' },
    { title: 'Item 3' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item.title}</Text>
    </View>
  );

  return (
    <Carousel
      data={data}
      renderItem={renderItem}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    borderRadius: 8,
    padding: 20,
    marginLeft: 25,
    marginRight: 25,
  },
  text: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
  },
});

export default CarouselComponent;
