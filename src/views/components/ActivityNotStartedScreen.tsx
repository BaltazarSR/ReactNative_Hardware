import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ActNotStartedProps } from '../../models/props/ActNotStartedProps';
import { WalkIcon, RunIcon } from './Icon';

export default function ActivityNotStartedScreen({
  handleGoToStats,
  handleStartWorkout
}: ActNotStartedProps) {

  return (
    <View style={styles.mainContainer}>
      
      <View style={styles.icons}>
        <WalkIcon
          size={200}
          color='#00a00b'
        />
        <RunIcon
          size={200}
          color='#00a00b'
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleStartWorkout}
      >
        <Text style={styles.buttonText}>
          Start workout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#161616ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icons: {
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
    marginBottom: 50,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00a00b',
    height: 80,
    width: '80%',
    borderRadius: 30,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: .6,
    shadowRadius: 5,
    position: 'absolute',
    bottom: 40,
  },
  buttonText: {
    color: '#FFFAFA',
    fontSize: 25,
    fontFamily: "StackSans-SemiBold",
  }
});
