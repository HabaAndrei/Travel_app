import { StyleSheet, View, PanResponder } from 'react-native'
import { useState, useEffect } from 'react'
import { FirebaseFirestore } from '../firebase';
import { useIsFocused } from '@react-navigation/native';
import { Card, Text, Heading, LinkText, Link, Icon, ArrowRightIcon, HStack } from '@gluestack-ui/themed';

const NewsCarousel = () => {

  const [newsNumber, setNewsNumber] = useState(0);
  const [news, setNews] = useState([]);
  const [startX, setStartX] = useState(0);
  const isFocused = useIsFocused();
  const firebaseFirestore = new FirebaseFirestore();

  useEffect(() => {
    if (!isFocused) return;
    _getNews();
  }, [isFocused]);

  async function _getNews(){
    const data = await firebaseFirestore.getNews();
    if(data.isResolve){
      setNews(data.data);
    }
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setStartX(evt.nativeEvent.pageX);
    },
    onPanResponderRelease: (evt) => {
      const endX = evt.nativeEvent.pageX;
      if (startX - endX > 20) {
        setNewsNumber((number)=>{
          if(number >= news.length - 1 )return number;
          else return number +=1;
        })
      } else if (endX - startX > 20) {
        setNewsNumber((number)=>{
          if(number <= 0 )return number;
          else return number -=1;
        })
      }
    }
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {news?.[newsNumber] ?
      <Card  maxWidth={900} >
        <Text
          fontSize="$sm"
          fontStyle="normal"
          fontFamily="$heading"
          fontWeight="$normal"
          lineHeight="$sm"
          mb="$2"
          sx={{
            color: "$textLight700",
            _dark: {
              color: "$textDark200",
            },
          }}
        >
          {news?.[newsNumber]?.pubDate}
        </Text>
        <Heading size="md" fontFamily="$heading" mb="$4">
          {news?.[newsNumber]?.title}
        </Heading>

        <Link style={styles.linkText} isExternal>
          <HStack alignItems="center">
            <LinkText
              size="sm"
              fontFamily="$heading"
              fontWeight="$semibold"
              color="$primary600"
              $dark-color="$primary300"
              textDecorationLine="none"
            >
              Read more
            </LinkText>
            <Icon
              as={ArrowRightIcon}
              size="sm"
              color="$primary600"
              mt="$0.5"
              ml="$0.5"
              $dark-color="$primary300"
            />
          </HStack>
        </Link>
      </Card> : null
      }
      <View style={styles.dotsContainer}>
        {news.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === newsNumber ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  )
}

export default NewsCarousel

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    padding: 5,
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
  },
  linkText:{
    alignSelf: 'flex-end',
    margin: 10
  }
})