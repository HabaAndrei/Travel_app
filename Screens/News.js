import { StyleSheet, SafeAreaView, ScrollView, Image, View } from 'react-native';
import CustomButton from '../CustomElements/CustomButton.js';
import { Text, Heading, LinkText, Link, Icon, ArrowRightIcon, HStack } from '@gluestack-ui/themed';

const News = (props) => {
  const { data } = props.route.params;

  function goBack() {
    props.navigation.navigate('MyTrips');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.infoText}>
          {data.country.length === 1 ? 'Country:' : 'Countries:'} {data.country.join(', ')}
        </Text>

        <Text style={styles.publishedText}>
          Published at {data?.pubDate}
        </Text>

        <Heading style={styles.title}>{data?.title}</Heading>

        <Text style={styles.description}>{data?.description}</Text>

        <Text style={styles.infoText}>Source name: {data.source_name}</Text>

        {data.image_url && (
          <Image
            source={{ uri: data.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <Link href={`${data?.link}`} style={styles.linkText} isExternal>
          <HStack alignItems="center">
            <LinkText
              size="sm"
              fontFamily="$heading"
              fontWeight="$semibold"
              color="$primary600"
              $dark-color="$primary300"
              textDecorationLine="none"
            >
              See on their website
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

        <View style={styles.buttonContainer}>
          <CustomButton name="Go back" func={goBack} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 4,
    color: '#333',
  },
  publishedText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#444',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  linkText: {
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
