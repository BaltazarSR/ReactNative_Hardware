import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ActStartedProps } from '../../models/props/ActStartedProps';
import { ActivityType } from '../../models/ActivityType';
import { MapPinIcon, RunIcon, WalkIcon, CarIcon, QuestionIcon, StatsIcon, StepsIcon, RulerIcon, FireIcon, ClockIcon } from './Icon';

export default function ActivityStartedScreen({
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
    handleCheckLogs,
    handleStopWorkout,
}: ActStartedProps) {

  const renderKindIcon = () => {
    const color = "#007625ff"
    const size = 70
    switch (actKind) {
      case ActivityType.WALKING:
        return (
          <WalkIcon
            size={size}
            color={color}
          />
        );
      case ActivityType.RUNNING:
        return (
          <RunIcon
            size={size}
            color={color}
          />
        );
      case ActivityType.VEHICLE:
        return (
          <CarIcon
            size={size}
            color={color}
          />
        );
      case ActivityType.IDLE:
        return (
          <CarIcon
            size={size}
            color={color}
          />
        );
      case ActivityType.UNKNOWN:
      default:
        return (
          <QuestionIcon
            size={size}
            color={color}
          />
        );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.uiContainer}>

        <View style={styles.locationContainer}>
          <View style={styles.titleContainer}>
            <MapPinIcon
            size={30}
            color='#a00000'
            />
            <Text style={styles.titleText}>
              Location
            </Text>
          </View>
          <View style={styles.coordinatesContainer}>
            <View style={styles.indCoordinateContainer}>
              <Text style={styles.coordinatesText}>
                Lat: {latitude}
              </Text>
            </View>
            <View style={styles.indCoordinateContainer}>
              <Text style={styles.coordinatesText}>
                Lon: {longitude}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.activityContainer}>
          <View style={styles.activityKindContainer}>
            {renderKindIcon()}
            <Text style={styles.activityKindText}>
              {actKind}
            </Text>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.actKindInfoContainer}>


            <View style={styles.infoContainer}>
              <Text style={styles.infoTitleText}>
                Acceleration
              </Text>
              <Text style={styles.infoDataText}>
                {acceleration} m/s²
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoTitleText}>
                Speed
              </Text>
              <Text style={styles.infoDataText}>
                {speed} m/s
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoTitleText}>
                Confidence
              </Text>
              <Text style={styles.infoDataText}>
                {confidence}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.titleContainer}>
            <StatsIcon
              size={30}
              color='#a00000'
            />
            <Text style={styles.titleText}>
              Stats of the session
            </Text>
          </View>
          <View style={styles.statsInfoContainer}>
            <View style={styles.statsDataContainer}>
              <ClockIcon
                size={40}
                color='#FFFAFA'
              />
              <View style={styles.statsTextContainer}>
                <Text style={styles.infoTitleText}>
                  Duration
                </Text>
                <Text style={styles.infoDataText}>
                  {duration}s
                </Text>
              </View>
            </View>
            <View style={styles.statsDataContainer}>
              <RulerIcon
                size={50}
                color='#FFFAFA'
              />
              <View style={styles.statsTextContainer}>
                <Text style={styles.infoTitleText}>
                  Distance
                </Text>
                <Text style={styles.infoDataText}>
                  {distance} m
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.statsInfoContainer}>
            <View style={styles.statsDataContainer}>
              <FireIcon
                size={50}
                color='#FFFAFA'
              />
              <View style={styles.statsTextContainer}>
                <Text style={styles.infoTitleText}>
                  Calories
                </Text>
                <Text style={styles.infoDataText}>
                  {calories}
                </Text>
              </View>
            </View>
            <View style={styles.statsDataContainer}>
              <StepsIcon
                size={50}
                color='#FFFAFA'
              />
              <View style={styles.statsTextContainer}>
                <Text style={styles.infoTitleText}>
                  Steps
                </Text>
                <Text style={styles.infoDataText}>
                  {steps}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logsButton}
          onPress={handleCheckLogs}
        >
          <Text style={styles.logsButtonText}>
            Check Logs
          </Text>
        </TouchableOpacity>

      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleStopWorkout}
      >
        <Text style={styles.buttonText}>
          Stop workout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Log modal

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#101010',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uiContainer:{
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 90,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },  
  titleText: {
    color: '#FFFAFA',
    fontFamily: "StackSans-SemiBold",
    fontSize: 22
  },
  locationContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#0e0d0d',
    padding: 15,
    borderRadius: 25,
    width: '90%',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: .6,
    shadowRadius: 2,
    gap: 10,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    gap: 5,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  indCoordinateContainer: {
    width: 120,
  },
  coordinatesText: {
    color: '#FFFAFA',
    fontFamily: "StackSans-ExtraLight",
    fontSize: 14
  },
  activityContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0e0d0d',
    padding: 30,
    borderRadius: 25,
    width: '90%',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: .6,
    shadowRadius: 2,
    gap: 10,
  },
  activityKindContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  activityKindText: {
    color: '#FFFAFA',
    fontFamily: "StackSans-SemiBold",
    fontSize: 30
  },
  actKindInfoContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  infoTitleText: {
    color: '#FFFAFA',
    fontFamily: "StackSans-ExtraLight",
    fontSize: 13
  },
  infoDataText: {
    color: '#FFFAFA',
    fontFamily: "StackSans-SemiBold",
    fontSize: 14
  },
  statsContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#0e0d0d',
    padding: 15,
    borderRadius: 25,
    width: '90%',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: .6,
    shadowRadius: 2,
    gap: 15,
  },
  statsInfoContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-evenly',
    gap: 5,
  },
  statsDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    gap: 15,
    height: 50,
    width: 150,
  },
  statsTextContainer: {
    flexDirection: 'column'
  },
  logsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0e0d0d',
    height: 50,
    width: '90%',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: .6,
    shadowRadius: 3,
  },
  logsButtonText: {
    color: '#FFFAFA',
    fontSize: 16,
    fontFamily: "StackSans-Regular",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a00000',
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
  },
  divider: {
    width: '100%',
    borderWidth: .5,
    borderColor: "#FFFAFA",
    marginVertical: 10,
  },  
});

