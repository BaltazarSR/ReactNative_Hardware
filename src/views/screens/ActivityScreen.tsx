import { StyleSheet, Text, View } from 'react-native';
import { useActivityController } from '../../controllers/ActivityController';
import ActivityStartedScreen from '../components/ActivityStartedScreen';
import ActivityNotStartedScreen from '../components/ActivityNotStartedScreen';

export default function ActivityScreen() {
  
  const {
    latitude,
    longitude,
    speed,
    acceleration,
    confidence,
    actKind,
    duration,
    distance,
    calories,
    steps,
    actStatus,
    handleGoToStats,
    handleCheckLogs,
    handleStopWorkout,
    handleStartWorkout
  } = useActivityController();

  return (
    <>
      {actStatus ? (
        <ActivityStartedScreen 
          latitude={latitude}
          longitude={longitude}
          speed={speed}
          acceleration={acceleration}
          confidence={confidence}
          actKind={actKind}
          duration={duration}
          distance={distance}
          calories={calories}
          steps={steps}
          handleCheckLogs={handleCheckLogs}
          handleStopWorkout={handleStopWorkout}
        />
      ) : ( 
        <ActivityNotStartedScreen 
          handleGoToStats={handleGoToStats}
          handleStartWorkout={handleStartWorkout}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});