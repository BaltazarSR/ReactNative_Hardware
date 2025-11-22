import { useState, useEffect, useRef, useCallback } from "react";
import { logger } from "../utils/logger";
import * as Location from 'expo-location';
import { Accelerometer, Pedometer } from 'expo-sensors';

import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { ActivityType } from '../models/ActivityType';
import { LocationData } from '../models/LocationData';
import { AccelerometerData } from '../models/AccelerometerData';
import { ActivityLog } from "../models/ActivityLog";

export const useActivityController = () => {

    const navigation = useNavigation<NavigationProp>();

    const [actStatus, setActStatus] = useState(false);
    const [latitude, setLatitude] = useState('0.000000');
    const [longitude, setLongitude] = useState('0.000000');
    const [speed, setSpeed] = useState('0.00');
    const [acceleration, setAcceleration] = useState('0.00');
    const [confidence, setConfidence] = useState('0');
    const [actKind, setActKind] = useState<ActivityType>(ActivityType.UNKNOWN);
    const [duration, setDuration] = useState('00:00');
    const [distance, setDistance] = useState('0');
    const [calories, setCalories] = useState('0');
    const [steps, setSteps] = useState('0');
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);

    // Function to format duration as MM:SS or HH:MM:SS if >= 1 hour
    const formatDuration = useCallback((seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }, []);

    // Function to create a log entry
    const createLogEntry = useCallback((elapsedSeconds: number): ActivityLog => {
        const currentTime = Date.now();
        return {
            id: `${currentTime}-${Math.random()}`,
            duration: formatDuration(elapsedSeconds),
            distance: parseFloat(distance).toFixed(2),
            steps: steps,
            calories: parseFloat(calories).toFixed(0),
            activityType: actKind,
            speed: parseFloat(speed).toFixed(2),
            acceleration: parseFloat(acceleration).toFixed(2),
            confidence: parseFloat(confidence).toFixed(0),
            latitude: parseFloat(latitude).toFixed(6),
            longitude: parseFloat(longitude).toFixed(6),
        };
    }, [formatDuration, distance, steps, calories, actKind, speed, acceleration, confidence, latitude, longitude]);

    // Effect to manage the logging interval
    useEffect(() => {
        if (actStatus) {
            // Start logging
            startTimeRef.current = Date.now();
            
            intervalRef.current = setInterval(() => {
                const currentTime = Date.now();
                const elapsedSeconds = Math.floor((currentTime - startTimeRef.current) / 1000);
                setDuration(formatDuration(elapsedSeconds));

                // Create and add new log entry
                const newLog = createLogEntry(elapsedSeconds);
                setLogs(prevLogs => [...prevLogs, newLog]);
                logger.log(`[Activity Controller] Log entry created: ${elapsedSeconds}s`);
            }, 1000);
        } else {
            // Stop logging
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [actStatus, createLogEntry]);

    const handleGoToStats = () => {
        logger.log('[Stats Controller] Navigation to: Stats');
        navigation.navigate('Stats');
    }

    const handleCheckLogs = () => {
        logger.log('[Stats Controller] Navigation to: Logs');
        navigation.navigate('Logs', { logs });
    }

    const handleStopWorkout = () => {
        logger.log('[Stats Controller] Workout stopped');
        setActStatus(false);
    }

    const handleStartWorkout = () => {
        logger.log('[Stats Controller] Workout started' );
        setLogs([]); // Clear previous logs
        setDuration('00:00');
        setDistance('0');
        setCalories('0');
        setSteps('0');
        setActStatus(true);
    }

    return {
        // info
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
        logs,

        // nav
        handleGoToStats,
        handleCheckLogs,
        
        // methods
        handleStopWorkout,
        handleStartWorkout

    };
}