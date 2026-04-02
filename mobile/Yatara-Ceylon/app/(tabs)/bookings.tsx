import { StyleSheet, View, Text } from 'react-native';

export default function BookingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookings</Text>
      <Text style={styles.subtitle}>Recent reservations and schedules.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
