import { useState, useEffect } from "react";
import { logger } from "../utils/logger";
import { Alert } from "react-native";

import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { StorageService } from '../services/StorageService';
import { SessionStatsModel } from '../models/SessionStatsModel';
import { ActivityType } from '../models/ActivityType';
import { ActivityLog } from "../models/ActivityLog";

export const useStatsController = () => {

    const navigation = useNavigation<NavigationProp>();
    const storageService = new StorageService();

    const [sessions, setSessions] = useState<SessionStatsModel[]>([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalSteps, setTotalSteps] = useState(0);
    const [walkingCount, setWalkingCount] = useState(0);
    const [runningCount, setRunningCount] = useState(0);
    const [vehicleCount, setVehicleCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const allSessions = await storageService.getAllSessions();
            setSessions(allSessions);

            const totalStats = await storageService.getTotalStats();
            setTotalDistance(totalStats.totalDistance);
            setTotalCalories(totalStats.totalCalories);
            setTotalSteps(totalStats.totalSteps);

            let walking = 0;
            let running = 0;
            let vehicle = 0;

            allSessions.forEach(session => {
                let previousActivity: ActivityType | null = null;
                
                session.logs.forEach(log => {
                    // Only count if the activity type is different from the previous one
                    if (log.activityType !== previousActivity) {
                        if (log.activityType === ActivityType.WALKING) walking++;
                        else if (log.activityType === ActivityType.RUNNING) running++;
                        else if (log.activityType === ActivityType.VEHICLE) vehicle++;
                        
                        previousActivity = log.activityType;
                    }
                });
            });

            setWalkingCount(walking);
            setRunningCount(running);
            setVehicleCount(vehicle);

            logger.log(`[Stats Controller] Loaded ${allSessions.length} sessions`);
        } catch (error) {
            logger.log(`[Stats Controller] Error loading stats: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        logger.log('[Stats Controller] Navigating back');
        navigation.goBack();
    };

    const handleMapSelected = (sessionId: string) => {
        logger.log(`[Stats Controller] Navigation to: Map`);
        navigation.navigate('Map', { sessionId } as any);
    };

    const handleLogSelected = (sessionLogs: ActivityLog[]) => {
        logger.log(`[Stats Controller] Navigation to: Log`);
        navigation.navigate('Logs', { logs: sessionLogs });
    };

    const handleDeleteSession = async (sessionId: string) => {
        Alert.alert(
            'Delete session',
            'Are you sure you want to delete this session?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await storageService.deleteSession(sessionId);
                        if (success) {
                            logger.log(`[Stats Controller] Session deleted: ${sessionId}`);
                            loadStats();
                        }
                    },
                },
            ]
        );
    };

    const handleClearAll = async () => {
        Alert.alert(
            'Clear all',
            'Are you sure you want to clear all stats and sessions?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await storageService.clearAllSessions();
                        if (success) {
                            logger.log('[Stats Controller] All sessions cleared');
                            loadStats();
                        }
                    },
                },
            ]
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadStats();
        setRefreshing(false);
    };

    const formatDistance = (distance: number) => {
        if (distance >= 1000) {
            return `${(distance / 1000).toFixed(2)} km`;
        }
        return `${Math.round(distance)} m`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('es-ES', { month: 'short' });
        const year = date.getFullYear();
        const time = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        return { dateStr: `${day} ${month} ${year}`, time };
    };

    return {
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
    };
}