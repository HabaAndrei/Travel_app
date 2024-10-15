import { StyleSheet, Text, View, Image, PanResponder } from 'react-native';
import React, { useState } from 'react';

const ImageCarousel = (props) => {
    const [imageNumber, setImageNumber] = useState(0);
    const [startX, setStartX] = useState(0);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          setStartX(evt.nativeEvent.pageX);
        },
        onPanResponderRelease: (evt) => {
          const endX = evt.nativeEvent.pageX;
          if (startX - endX > 20) {
            setImageNumber((number)=>{
                if(number >= props.imageUrls.length )return number;
                else return number +=1;
            })
          } else if (endX - startX > 20) {
            setImageNumber((number)=>{
                if(number <= 0 )return number;
                else return number -=1;
            })
          }
        }
    });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Image source={{ uri: props.imageUrls[imageNumber] }} style={styles.image} />
      <View style={styles.dotsContainer}>
        {props.imageUrls.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === imageNumber ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#333',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  }
});
