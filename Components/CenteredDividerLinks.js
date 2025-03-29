import { VStack, HStack, Divider, Link, LinkText } from '@gluestack-ui/themed';

const CenteredDividerLinks = (props) => {
  return (
    <VStack space="md" justifyContent="center" alignItems="center">
      <HStack h="$10" alignItems="center">

        <HStack flex={1} justifyContent="flex-end">
          <Link href={props.website ? props.website : ''} isExternal>
            <LinkText
              size="sm"
              fontFamily="$heading"
              fontWeight="$semibold"
              color="$primary600"
              textDecorationLine="none"
            >
              {props.website ? 'Visit their website' : ''}
            </LinkText>
          </Link>
        </HStack>

        {props.urlLocation && props.website ? (
          <Divider
            orientation="vertical"
            bg="$emerald500"
            h={15}
            mx="$3"
            alignSelf="center"
          />
        ) : null}

        <HStack flex={1} justifyContent="flex-start">
          <Link href={props.urlLocation ? props.urlLocation : ''} isExternal>
            <LinkText
              size="sm"
              fontFamily="$heading"
              fontWeight="$semibold"
              color="$primary600"
              textDecorationLine="none"
            >
              {props.urlLocation ? 'Google location' : ''}
            </LinkText>
          </Link>
        </HStack>
      </HStack>
    </VStack>
  );
};

export default CenteredDividerLinks;
