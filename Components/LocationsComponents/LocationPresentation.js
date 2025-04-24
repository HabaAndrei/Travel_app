import { StyleSheet, View } from 'react-native'
import { Card, HStack, Heading, Center, Link, Divider, LinkText, VStack } from '@gluestack-ui/themed';
import ImageCarousel from '../ImageCarousel.js';
import CustomButton from '../../CustomElements/CustomButton.js';
import ListPackeges from './ListPackeges.js';

/** This component represents a presentation of a location */
const LocationPresentation = (props) => {
  return (
    <Card
      p="$5"
      borderRadius="$lg"
      maxWidth={400}
      m="$3"
      style={[styles.cardPressable, props.location.selected && styles.selectedCard]}
    >
      <Heading size="md" fontFamily="$heading" mb="$4">
        {props.location?.name}
      </Heading>

      <View style={{ flex: 1, marginTop: 20 }}>
        {props?.location?.arrayWithLinkImages?.length ? (
          <ImageCarousel imageUrls={props?.location?.arrayWithLinkImages} />
        ) : null}
      </View>

      <VStack space="md" justifyContent="center" alignItems="center">
        <HStack h="$10" justifyContent="center" alignItems="center">
          <Link
            href={props?.location?.website ? props?.location?.website : ''}
            isExternal
          >
            <HStack alignItems="center">
              <LinkText
                size="sm"
                fontFamily="$heading"
                fontWeight="$semibold"
                color="$primary600"
                textDecorationLine="none"
              >
                {props?.location?.website ? 'Visit their website' : ''}
              </LinkText>
            </HStack>
          </Link>

          {props?.location?.urlLocation && props?.location?.website ? (
            <Divider orientation="vertical" mx="$2.5" bg="$emerald500" h={15} />
          ) : null}

          <Link
            href={props?.location?.urlLocation ? props?.location?.urlLocation : ''}
            isExternal
          >
            <HStack alignItems="center">
              <LinkText
                size="sm"
                fontFamily="$heading"
                fontWeight="$semibold"
                color="$primary600"
                textDecorationLine="none"
              >
                {props?.location?.urlLocation ? 'Google location' : ''}
              </LinkText>
            </HStack>
          </Link>
        </HStack>
      </VStack>

      <Center>
        <CustomButton
          name={props?.location?.selected ? 'Remove location from your visit' : 'Pick location for your visit'}
          func={props?.pressOnLocations}
          paramFunc={props?.index}
        />
      </Center>

      {props?.location?.dataTimeLocation && props?.location?.selected ? (
        <ListPackeges
          dataTimeLocation={props?.location?.dataTimeLocation}
          indexLocation={props?.index}
          selectPackage={props?.selectPackage}
        />
      ) : null}
    </Card>
  )
}

export default LocationPresentation;

const styles = StyleSheet.create({
  cardPressable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectedCard: {
    backgroundColor: '#ADD8E6',
  },
});