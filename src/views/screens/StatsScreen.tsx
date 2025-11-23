import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useStatsController } from '../../controllers/StatsController';
import { StatsIcon, RulerIcon, FireIcon, StepsIcon, WalkIcon, RunIcon, CarIcon, ClockIcon } from '../components/Icon';

export default function StatsScreen() {
  const {
    sessions,
    totalDistance,
    totalCalories,
    totalSteps,
    walkingCount,
    runningCount,
    vehicleCount,
    loading,
    refreshing,
    handleBack,
    handleMapSelected,
    handleLogSelected,
    handleDeleteSession,
    handleClearAll,
    onRefresh,
    formatDistance,
    formatDate,
  } = useStatsController();

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFAFA" />
      }
    >

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Routes and Stats</Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <StatsIcon size={26} color="#a00000" />
          <Text style={styles.statsTitle}>General Stats</Text>
        </View>
        
        <View style={styles.statsGrid}>
          {/* Distance */}
          <View style={styles.statItem}>
            <RulerIcon size={40} color="#FFFAFA" />
            <Text style={styles.statValue}>{formatDistance(totalDistance)}</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>

          {/* Calories */}
          <View style={styles.statItem}>
            <FireIcon size={40} color="#FFFAFA" />
            <Text style={styles.statValue}>{Math.round(totalCalories)}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>

          {/* Steps */}
          <View style={styles.statItem}>
            <StepsIcon size={40} color="#FFFAFA" />
            <Text style={styles.statValue}>{totalSteps.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>

          {/* Walking */}
          <View style={styles.statItem}>
            <WalkIcon size={40} color="#FFFAFA" />
            <Text style={styles.statValue}>{walkingCount}</Text>
            <Text style={styles.statLabel}>Times walking</Text>
          </View>

          {/* Running */}
          <View style={styles.statItem}>
            <RunIcon size={40} color="#FFFAFA" />
            <Text style={styles.statValue}>{runningCount}</Text>
            <Text style={styles.statLabel}>Times running</Text>
          </View>

          {/* Vehicle */}
          <View style={styles.statItem}>
            <CarIcon size={40} color="#FFFAFA" />
            <Text style={styles.statValue}>{vehicleCount}</Text>
            <Text style={styles.statLabel}>Times driving</Text>
          </View>
        </View>
      </View>

      {/* Saved Routes */}
      <View style={styles.routesSection}>
        <View style={styles.routesHeader}>
          <Text style={styles.routesTitle}>Saved Sessions ({sessions.length})</Text>
        </View>

        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No sessions saved</Text>
            <Text style={styles.emptySubtext}>Start a workout to have your first session</Text>
          </View>
        ) : (
          sessions.map((session, index) => {
            const { dateStr, time } = formatDate(session.date);
            return (
              <View key={session.id} style={styles.routeCard}>
                <View style={styles.routeHeader}>
                  <Text style={styles.routeTitle}>{dateStr} • {time}</Text>
                </View>

                <View style={styles.routeStats}>
                  <View style={styles.routeStat}>
                    <RulerIcon size={30} color="#FFFAFA" />
                    <View style={styles.routeStatText}>
                      <Text style={styles.routeStatLabel}>Distance</Text>
                      <Text style={styles.routeStatValue}>{formatDistance(session.distance)}</Text>
                    </View>
                  </View>

                  <View style={styles.routeStat}>
                    <FireIcon size={30} color="#FFFAFA" />
                    <View style={styles.routeStatText}>
                      <Text style={styles.routeStatLabel}>Calories</Text>
                      <Text style={styles.routeStatValue}>{Math.round(session.calories)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.routeStats}>
                  <View style={styles.routeStat}>
                    <ClockIcon size={30} color="#FFFAFA" />
                    <View style={styles.routeStatText}>
                      <Text style={styles.routeStatLabel}>Duration</Text>
                      <Text style={styles.routeStatValue}>{session.duration}</Text>
                    </View>
                  </View>

                  <View style={styles.routeStat}>
                    <StepsIcon size={30} color="#FFFAFA" />
                    <View style={styles.routeStatText}>
                      <Text style={styles.routeStatLabel}>Steps</Text>
                      <Text style={styles.routeStatValue}>{session.steps || 0}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.divider}></View>

                <View style={styles.routeActions}>
                  <TouchableOpacity 
                    style={styles.mapButton}
                    onPress={() => handleMapSelected(session.id)}
                  >
                    <Text style={styles.mapButtonText}>See Map</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.logButton}
                    onPress={() => handleLogSelected(session.logs)}
                  >
                    <Text style={styles.logButtonText}>See Logs</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteSession(session.id)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#0e0d0d',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0e0d0d',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFAFA',
    fontFamily: 'StackSans-SemiBold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: 'StackSans-SemiBold',
    color: '#FFFAFA',
  },
  clearButton: {
    backgroundColor: '#a00000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  clearButtonText: {
    color: '#FFFAFA',
    fontSize: 13,
    fontFamily: 'StackSans-SemiBold',
  },
  statsCard: {
    backgroundColor: '#0e0d0d',
    margin: 20,
    padding: 20,
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontFamily: 'StackSans-SemiBold',
    color: '#FFFAFA',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  statItem: {
    width: '30%',
    backgroundColor: '#101010',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 100,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'StackSans-SemiBold',
    color: '#FFFAFA',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'StackSans-ExtraLight',
    color: '#FFFAFA',
    textAlign: 'center',
  },
  routesSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  routesHeader: {
    marginBottom: 15,
  },
  routesTitle: {
    fontSize: 20,
    fontFamily: 'StackSans-SemiBold',
    color: '#FFFAFA',
  },
  emptyState: {
    backgroundColor: '#0e0d0d',
    padding: 40,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'StackSans-SemiBold',
    color: '#FFFAFA',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: 'StackSans-ExtraLight',
    color: '#FFFAFA',
    textAlign: 'center',
  },
  routeCard: {
    backgroundColor: '#0e0d0d',
    padding: 20,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  routeHeader: {
    marginBottom: 15,
  },
  routeTitle: {
    fontSize: 16,
    fontFamily: 'StackSans-SemiBold',
    color: '#FFFAFA',
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  routeStatText: {
    flexDirection: 'column',
  },
  routeStatEmoji: {
    fontSize: 30,
  },
  routeStatLabel: {
    fontSize: 11,
    fontFamily: 'StackSans-ExtraLight',
    color: '#FFFAFA',
  },
  routeStatValue: {
    fontSize: 14,
    fontFamily: 'StackSans-SemiBold',
    color: '#FFFAFA',
  },
  divider: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#FFFAFA',
    marginVertical: 10,
  },
  routeActions: {
    flexDirection: 'row',
    gap: 10,
  },
  mapButton: {
    flex: 1,
    backgroundColor: '#007625ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 15,
  },
  mapButtonText: {
    color: '#FFFAFA',
    fontSize: 14,
    fontFamily: 'StackSans-SemiBold',
  },
  logButton: {
    backgroundColor: '#000e76ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
  },
  logButtonText: {
    color: '#FFFAFA',
    fontSize: 14,
    fontFamily: 'StackSans-SemiBold',
  },
  deleteButton: {
    backgroundColor: '#a00000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFAFA',
    fontSize: 14,
    fontFamily: 'StackSans-SemiBold',
  },
});
