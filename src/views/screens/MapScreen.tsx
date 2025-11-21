import { StyleSheet, Text, View } from 'react-native';
import { useMapController } from '../../controllers/MapController';

export default function MapScreen() {

  const {
    handleTap
  } = useMapController();

  return (
    <View style={styles.container}>
      <Text>Map Screen!</Text>
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
