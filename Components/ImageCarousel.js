import { StyleSheet, View, Image, PanResponder, Dimensions } from 'react-native';
import { useState, useMemo } from 'react';
import { getUrlImage } from '../diverse.js';

const ImageMemo = ({ link }) => {
  const { width } = Dimensions.get('window');
  return (
    <Image
      source={{ uri: link }}
      style={{ width: width * 0.85, height: 450, alignSelf: 'center'}}
    />
  );
};

/** This component creates a custom image carousel */
const ImageCarousel = (props) => {
  const [imageNumber, setImageNumber] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy); // Detectăm dacă swipe-ul este orizontal
    },
    onPanResponderGrant: (evt) => {
      setStartX(evt.nativeEvent.pageX);
      setStartY(evt.nativeEvent.pageY);
    },
    onPanResponderRelease: (evt) => {
      const endX = evt.nativeEvent.pageX;
      const endY = evt.nativeEvent.pageY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 20) {
          setImageNumber((number) =>
            number >= props.imageUrls.length - 1 ? number : number + 1
          );
        } else if (diffX < -20) {
          setImageNumber((number) => (number <= 0 ? number : number - 1));
        }
      }
    },
  });

  const ImageCustom = useMemo(() => <ImageMemo link={getUrlImage(props.imageUrls[imageNumber])} />, [props.imageUrls, imageNumber]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {ImageCustom}
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
