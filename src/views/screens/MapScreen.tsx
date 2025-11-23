import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { useMapController } from '../../controllers/MapController';
import { MapScreenRouteProp } from '../../models/RootParamsListModel';
import { useRoute } from '@react-navigation/native';
import { StatsIcon, RulerIcon, FireIcon, StepsIcon, WalkIcon, RunIcon, CarIcon, ClockIcon, MapPinIcon } from '../components/Icon';

export default function MapScreen() {

  const route = useRoute<MapScreenRouteProp>();
  const { sessionId } = route.params;

  const {
    selectedRoute,
    loading,
    getMapRegion,
    getStartPoint,
    getEndPoint,
    formatDistance,
    formatDuration,
    formatCalories,
    formatPoints,
  } = useMapController( {sessionId} );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando rutas...</Text>
      </View>
    );
  }

  if (!selectedRoute || selectedRoute.route.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📍</Text>
        <Text style={styles.emptyTitle}>No hay rutas guardadas</Text>
        <Text style={styles.emptySubtitle}>
          Completa una actividad para ver tu ruta en el mapa
        </Text>
      </View>
    );
  }

  const startPoint = getStartPoint();
  const endPoint = getEndPoint();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={getMapRegion()}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={true}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <Polyline
          coordinates={selectedRoute.route}
          strokeColor="#007AFF"
          strokeWidth={4}
          lineCap="round"
          lineJoin="round"
        />

        {startPoint && (
          <Marker
            coordinate={startPoint}
            title="Inicio"
            pinColor="#4CD964"
          >
            <View style={styles.startMarker}>
            </View>
          </Marker>
        )}

        {/* End Marker */}
        {endPoint && (
          <Marker
            coordinate={endPoint}
            title="Fin"
            pinColor="#FF3B30"
          >
            <View style={styles.endMarker}>
            </View>
          </Marker>
        )}
      </MapView>

      {/* Stats Card Overlay */}
      <View style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <RulerIcon size={30} color="#FFFAFA" />
            <Text style={styles.statValue}>{formatDistance()}</Text>
          </View>

          <View style={styles.statItem}>
            <ClockIcon size={25} color="#FFFAFA" />
            <Text style={styles.statValue}>{formatDuration()}</Text>
          </View>

          <View style={styles.statItem}>
            <FireIcon size={30} color="#FFFAFA" />
            <Text style={styles.statValue}>{formatCalories()}</Text>
          </View>

          <View style={styles.statItem}>
            <MapPinIcon size={30} color="#FFFAFA" />
            <Text style={styles.statValue}>{formatPoints()}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  map: {
    flex: 1,
  },
  statsCard: {
    position: 'absolute',
    bottom: 60,
    right: 16,
    backgroundColor: '#101010',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 150,
  },
  statsGrid: {
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    paddingLeft: 10,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFAFA',
  },
  startMarker: {
    width: 20,
    height: 20,
    borderRadius: 18,
    backgroundColor: '#4CD964',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  endMarker: {
    width: 20,
    height: 20,
    borderRadius: 18,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  routeSelector: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
  },
  routeSelectorContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  routeButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  routeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  routeButtonTextActive: {
    color: '#FFF',
  },
});
