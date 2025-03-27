import { Pressable, View, StyleSheet } from 'react-native';
import { Card, Heading, Link, LinkText, Text, VStack, Divider, HStack, TrashIcon,  Icon } from "@gluestack-ui/themed";
import TimePicker from './Pickers/TimePicker.js';
import ImageCarousel from './ImageCarousel.js';
import CenteredDividerLinks from './CenteredDividerLinks.js';

const LocationCard = (props) => {

  const existsTwoNavigation = !!(props.website && props.urlLocation);

  return (
  <Card
    maxWidth={800}
    p={'$5'}
    borderRadius={'$lg'}
    m={props?.changeDefaultStyle ? '' : '$3'}
    style={ props?.changeDefaultStyle ? styles.customStyle : ''}
  >
    <HStack
      justifyContent="space-between"
      alignItems="center"
    >
      <Heading
        mb="$1"
        size="md"
      >
        {props.place}
      </Heading>
      <Pressable onPress={() => {props.deleteActivity(...props.deleteActivityParams)}}>
        <Icon
          as={TrashIcon}
          m="$2"
          w="$6"
          h="$6"
        />
      </Pressable>
    </HStack>

    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

      <Text
        style={{marginRight: 30}}
        fontSize="$sm" f
        ontStyle="normal"
        fontWeight="$normal"
        lineHeight="$sm"
        mb="$2"
        sx={{ color: "$textLight700" }}
      >
        {props.time}
      </Text>
      <TimePicker
        getTime={props.getTime}
        extraFunction={props.extraFunction}
      />

    </View>

    {props.address ?
      <Text size="m" style={{ marginTop: 10 }}>
        <Text bold={true}>Address: </Text> {props.address}
        <Text style={styles.buttonText} onPress={() => props.copyInClipboard(`${props.address}`)}>
          {' '}
          Copy
        </Text>
      </Text> : <Text></Text>
    }

    {props.info ?
      <Text size="m" style={{ marginTop: 10 }}>
        <Text bold={true}>Info:</Text> {props.info}
      </Text> : null
    }
    {props.description ?
      <Text size="m" style={{ marginTop: 10 }}>
        <Text bold={true}>Description: </Text>{props.description}
      </Text> : null
    }

    <View style={{ flex: 1, marginTop: 20 }}>
      {props.arrayWithLinkImages.length ?
        <ImageCarousel imageUrls={props.arrayWithLinkImages }/>
        : null
      }
    </View>


    {
      existsTwoNavigation ?
        <CenteredDividerLinks
          website={props.website}
          urlLocation={props.urlLocation}
        / >
      :
      <VStack
        space="md"
        justifyContent='center'
        alignItems='center'
      >
        <HStack
          h='$10'
          justifyContent='center'
          alignItems='center'
        >
          <Link
            href={props.website ? props.website : ''}
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
                {props.website ? 'Visit their website' : '' }
              </LinkText>
            </HStack>
          </Link>
          {props.urlLocation && props.website ?
            <Divider
              orientation="vertical"
              mx='$2.5'
              bg='$emerald500'
              h={15}
            />
            : null
          }
          <Link
            href={props.urlLocation ? props.urlLocation : ''}
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
                {props.urlLocation ? 'Google location' : ''}
              </LinkText>
            </HStack>
          </Link>
        </HStack>
      </VStack>
    }

  </Card>
  )
}

export default LocationCard

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#007AFF',
  },
  customStyle: {
    marginBottom: 15
  }
})