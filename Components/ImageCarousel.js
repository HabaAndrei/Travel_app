import { StyleSheet, View, Image, PanResponder, Dimensions } from 'react-native';
import { useState } from 'react';

const ImageCarousel = (props) => {
  const [imageNumber, setImageNumber] = useState(0);
  const [startX, setStartX] = useState(0);
  const { width } = Dimensions.get('window');

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setStartX(evt.nativeEvent.pageX);
    },
    onPanResponderRelease: (evt) => {
      const endX = evt.nativeEvent.pageX;
      if (startX - endX > 20) {
        setImageNumber((number)=>{
          if(number >= props.imageUrls.length - 1 )return number;
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
      <Image source={{ uri: props.imageUrls[imageNumber] }}  style={{ width: width * 0.85, height: 450, alignSelf: 'center'}} />
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
    borderRadius: 15,
    padding: 5,
    marginBottom: 15,
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
    backgroundColor: '#007AFF',
  },
  inactiveDot: {
    backgroundColor: '#ccc',
  }
});
