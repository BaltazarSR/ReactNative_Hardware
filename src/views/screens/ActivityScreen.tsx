import { StyleSheet, Text, View } from 'react-native';
import { useActivityController } from '../../controllers/ActivityController';

export default function ActivityScreen() {
  
  const {
    handleGoToStats
  } = useActivityController();

  return (
    <View style={styles.container}>
      <Text>Activity Screen!</Text>
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
