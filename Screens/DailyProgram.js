import React, { useEffect, useState } from 'react';
import { ScrollView, Pressable, View, Clipboard, StyleSheet } from 'react-native';
import { Card, Heading, Text, LinkText, Icon, TrashIcon, HStack, Link, ArrowRightIcon } from '@gluestack-ui/themed';

const ModalDayProgram = (props) => {
  const [dailyProgram, setDailyProgram] = useState({data: {}, index: '',});

  useEffect(() => {
    const { data, index } = props.route.params;
    console.log(data, index);
    console.log(props);
    setDailyProgram({ data, index });
  }, []);

  const copyInClipboard = (text) => {
    Clipboard.setString(text);
  };

  async function  deleteActivity(indexActivity){
    const response = await props.areYouSureDeleting();
    if (response) {
      props.setProgram((prev) => {
        let newProgram = [];
        prev.forEach((day, index) => {
          if (index === dailyProgram.index) {
            const activities = day.activities;
            const newActivities = activities.filter((_, i) => i !== indexActivity);
            day.activities = newActivities;
            newProgram.push(day);
          } else {
            newProgram.push(day);
          }
        });
        return [...newProgram];
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View>
        <Text style={styles.title}>{dailyProgram.data.title}</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.date}>{dailyProgram.data.date}</Text>
          <Text style={styles.dayText}>Day {dailyProgram.data.day}</Text>
        </View>

        {dailyProgram?.data?.activities?.map((ob, index) => (
          <Card key={index} p="$5" borderRadius="$lg" maxWidth={360} m="$3">
            <HStack justifyContent="space-between" alignItems="center">
              <Heading mb="$1" size="md">
                {ob.place}
              </Heading>
              <Pressable onPress={() => deleteActivity(index)}>
                <Icon as={TrashIcon} m="$2" w="$6" h="$6" />
              </Pressable>
            </HStack>

            <Text fontSize="$sm" fontStyle="normal" fontWeight="$normal" lineHeight="$sm" mb="$2" sx={{ color: "$textLight700" }}>
              {ob.time}
            </Text>
            <Text size="m" style={{ marginTop: 10 }}>
              <Text bold={true}>Address: </Text> {ob.address}
              <Text style={styles.buttonText} onPress={() => copyInClipboard(`${ob.address}`)}>
                {' '}
                Copy
              </Text>
            </Text>
            <Text size="m" style={{ marginTop: 10 }}>
              <Text bold={true}>Info:</Text> {ob.info}
            </Text>
            <Text size="m" style={{ marginTop: 10 }}>
              <Text bold={true}>Description: </Text>
              {ob.description}
            </Text>
            {ob.link ? (
              <Link href={ob.link} isExternal style={{ marginTop: 20 }}>
                <HStack alignItems="center">
                  <LinkText size="sm" fontWeight="$semibold" color="$primary600" textDecorationLine="none">
                    More details
                  </LinkText>
                  <Icon as={ArrowRightIcon} size="sm" color="$primary600" mt="$0.5" ml="$0.5" />
                </HStack>
              </Link>
            ) : (
              <Text></Text>
            )}
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  date: {
    fontSize: 16,
    color: '#777',
    marginRight: 10,
  },
  dayText: {
    fontSize: 16,
    color: '#007AFF',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20, // added padding for extra scrolling space
  },
});

export default ModalDayProgram;
