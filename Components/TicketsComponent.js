import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Linking } from 'react-native';
import CustomButton from '../CustomElements/CustomButton';

const TicketsComponent = ({ tickets }) => {

  const [showAll, setShowAll] = useState(false);
  const MAX_VISIBLE = 3;

  const visibleTickets = showAll ? tickets : tickets.slice(0, MAX_VISIBLE);

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  const handlePress = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎟️ Buy tickets</Text>
      <Text style={styles.description}>Tickets for this location and from surroundings</Text>

      <ScrollView>
        {visibleTickets.map((ticket, index) => (
          <TouchableOpacity
            key={index}
            style={styles.ticket}
            onPress={() => handlePress(ticket?.product_url)}
          >
            <Text style={styles.ticketText}>{ticket?.titile || ''}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {tickets.length > MAX_VISIBLE && (
        <CustomButton func={handleToggle} name={showAll ? 'See less' : 'See more'} />
      )}
    </View>
  );
};

export default TicketsComponent;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#e9edf2',
    borderRadius: 12,
    elevation: 2,
    margin: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  ticket: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  ticketText: {
    fontSize: 16,
    color: '#007bff',
  },
});