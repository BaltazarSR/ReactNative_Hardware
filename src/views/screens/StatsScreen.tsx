import { StyleSheet, Text, View } from 'react-native';
import { useStatsController } from '../../controllers/StatsController';

export default function StatsScreen() {
  const {
    handleMapSelected
  } = useStatsController();

  return (
    <View style={styles.container}>
      <Text>Stats Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
