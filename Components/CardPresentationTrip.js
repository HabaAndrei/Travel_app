import { Pressable } from 'react-native'
import { ArrowRightIcon, Card, Image, Heading, Link, LinkText, Text, HStack, TrashIcon,  Icon } from "@gluestack-ui/themed";
import { getUrlImage } from '../diverse.js';

/** General card representing a presentation for a Trip */
const CardPresentationTrip = (props) => (
  <Card
    borderRadius="$lg"
    maxWidth={800}
    m="$3"
  >

    {props?.image ?
      <Image
        mb="$6"
        h={200}
        width="$full"
        borderRadius="$md"
        source={{
          uri: getUrlImage(props.image),
        }}
        alt={props.image}
      /> : null
    }

    <HStack
      justifyContent="space-between"
      alignItems="center"
    >
      <Text
        fontSize="$sm"
        fontStyle="normal"
        fontFamily="$heading"
        fontWeight="$normal"
        lineHeight="$sm"
        mb="$2"
        sx={{  color: "$textLight700" }}
      >
        {props.textDate}
      </Text>
      <Pressable onPress={()=>{props.deleteFunction(...props.deleteFunctionParameters)}} >
        <Icon
          as={TrashIcon}
          m="$2"
          w="$6"
          h="$6"
        />
      </Pressable>
    </HStack>

    <Heading
      size="md"
      fontFamily="$heading"
      mb="$4"
    >
      {props.title}
    </Heading>

    <Link onPress={()=>{props.functionRedirect(...props.functionRedirectParameters)}}>
      <HStack alignItems="center">
        <LinkText
          size="sm"
          fontFamily="$heading"
          fontWeight="$semibold"
          color="$primary600"
          $dark-color="$primary300"
          textDecorationLine="none"
        >
            {props.nameRedirect}
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

  </Card>
)
export default CardPresentationTrip;
