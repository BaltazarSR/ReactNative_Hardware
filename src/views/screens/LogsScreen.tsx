import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useLogsController } from '../../controllers/LogsController';
import { ActivityType } from '../../models/ActivityType';
import { useRoute } from '@react-navigation/native';
import { LogsScreenRouteProp } from '../../models/RootParamsListModel';

export default function LogsScreen() {

  const route = useRoute<LogsScreenRouteProp>();
  const { logs } = route.params;

  const { 
    displayLogs 
  } = useLogsController({ logs });

  const getActivityColor = (activityType: ActivityType): string => {
    switch (activityType) {
      case ActivityType.RUNNING:
        return '#a00000';
      case ActivityType.WALKING:
        return '#007625ff';
      case ActivityType.VEHICLE:
        return '#0066cc';
      case ActivityType.IDLE:
        return '#cc8800';
      default:
        return '#666666';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>
            Workout Logs
          </Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {displayLogs.length} {displayLogs.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
      >
        {displayLogs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No logs yet</Text>
          </View>
        ) : (
          displayLogs.map((log) => (
            <View key={log.id} style={styles.logItem}>
              <View style={styles.logHeader}>
                <Text style={styles.logTime}>{log.duration}</Text>
                <View style={[
                  styles.activityBadge,
                  { backgroundColor: getActivityColor(log.activityType) }
                ]}>
                  <Text style={styles.activityText}>{log.activityType}</Text>
                </View>
              </View>
              
              <View style={styles.divider}></View>
              
              <View style={styles.logContent}>
                <View style={styles.logRow}>
                  <View style={styles.logColumn}>
                    <Text style={styles.logLabel}>Distance</Text>
                    <Text style={styles.logValue}>{log.distance} m</Text>
                  </View>
                  <View style={styles.logColumn}>
                    <Text style={styles.logLabel}>Steps</Text>
                    <Text style={styles.logValue}>{log.steps}</Text>
                  </View>
                  <View style={styles.logColumn}>
                    <Text style={styles.logLabel}>Calories</Text>
                    <Text style={styles.logValue}>{log.calories}</Text>
                  </View>
                </View>
                
                <View style={styles.logRow}>
                  <View style={styles.logColumn}>
                    <Text style={styles.logLabel}>Speed</Text>
                    <Text style={styles.logValue}>{log.speed} m/s</Text>
                  </View>
                  <View style={styles.logColumn}>
                    <Text style={styles.logLabel}>Acceleration</Text>
                    <Text style={styles.logValue}>{log.acceleration} m/s²</Text>
                  </View>
                  <View style={styles.logColumn}>
                    <Text style={styles.logLabel}>Confidence</Text>
                    <Text style={styles.logValue}>{log.confidence}%</Text>
                  </View>
                </View>
                
                <View style={styles.locationContainer}>
                  <Text style={styles.logLabel}>Location</Text>
                  <Text style={styles.locationValue}>
                    {log.latitude}, {log.longitude}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  header: {
    backgroundColor: '#0e0d0d',
    padding: 30,
    borderBottomWidth: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: 'StackSans-SemiBold',
    color: '#FFFAFA',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#FFFAFA',
    fontFamily: 'StackSans-ExtraLight',
    marginLeft: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'StackSans-SemiBold',
    color: '#666',
  },
  logItem: {
    backgroundColor: '#0e0d0d',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logTime: {
    fontSize: 18,
    fontFamily: 'StackSans-SemiBold',
    color: '#FFFAFA',
  },
  activityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activityText: {
    fontSize: 12,
    fontFamily: 'StackSans-SemiBold',
    color: '#FFFAFA',
  },
  divider: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#FFFAFA',
    marginVertical: 10,
  },
  logContent: {
    gap: 12,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logColumn: {
    flex: 1,
    alignItems: 'center',
  },
  logLabel: {
    fontSize: 11,
    color: '#FFFAFA',
    fontFamily: 'StackSans-ExtraLight',
    marginBottom: 4,
  },
  logValue: {
    fontSize: 14,
    fontFamily: 'StackSans-SemiBold',
    color: '#FFFAFA',
  },
  locationContainer: {
    marginTop: 4,
    alignItems: 'flex-start',
  },
  locationValue: {
    fontSize: 11,
    color: '#FFFAFA',
    fontFamily: 'StackSans-ExtraLight',
    marginTop: 4,
  },
});
