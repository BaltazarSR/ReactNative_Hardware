import { useState, useEffect, useRef } from "react";
import { logger } from "../utils/logger";

import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../models/RootParamsListModel';
import { ActivityType } from '../models/ActivityType';
import { ActivityLog } from "../models/ActivityLog";
import { LocationService, AccelerometerService, PedometerService, ActivityClassifierService, StorageService } from '../services';

export const useActivityController = () => {

    const navigation = useNavigation<NavigationProp>();

    // State
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
    
    // Refs for timer
    const startTimeRef = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Service instances
    const locationServiceRef = useRef(new LocationService());
    const accelerometerServiceRef = useRef(new AccelerometerService());
    const pedometerServiceRef = useRef(new PedometerService());
    const activityClassifierRef = useRef(new ActivityClassifierService());
    const storageServiceRef = useRef(new StorageService());
    
    // Refs for latest values (used in logging)
    const actStatusRef = useRef(actStatus);
    const latitudeRef = useRef(latitude);
    const longitudeRef = useRef(longitude);
    const speedRef = useRef(speed);
    const accelerationRef = useRef(acceleration);
    const confidenceRef = useRef(confidence);
    const actKindRef = useRef(actKind);
    const distanceRef = useRef(distance);
    const caloriesRef = useRef(calories);
    const stepsRef = useRef(steps);
    
    useEffect(() => {
        actStatusRef.current = actStatus;
        latitudeRef.current = latitude;
        longitudeRef.current = longitude;
        speedRef.current = speed;
        accelerationRef.current = acceleration;
        confidenceRef.current = confidence;
        actKindRef.current = actKind;
        distanceRef.current = distance;
        caloriesRef.current = calories;
        stepsRef.current = steps;
    }, [actStatus, latitude, longitude, speed, acceleration, confidence, actKind, distance, calories, steps]);

    // Function to format duration as MM:SS or HH:MM:SS if >= 1 hour
    const formatDuration = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hrs > 0) {
            return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    };

    // Effect to manage sensor tracking based on activity status
    useEffect(() => {
        if (!actStatus) {
            return;
        }

        const setupSensors = async () => {
            // Setup Location Service
            const locationStarted = await locationServiceRef.current.startTracking(
                (locationData, distanceIncrement, totalDistance) => {
                    setLatitude(locationData.lat.toFixed(6));
                    setLongitude(locationData.lon.toFixed(6));
                    setDistance(totalDistance.toFixed(0));
                    
                    const finalSpeed = locationData.speed ?? 0;
                    setSpeed(finalSpeed.toFixed(2));

                    // Classify activity based on current speed and acceleration
                    const currentAcceleration = parseFloat(accelerationRef.current);
                    const classification = activityClassifierRef.current.classifyActivity(
                        finalSpeed, 
                        currentAcceleration
                    );
                    setActKind(classification.activity);
                    setConfidence(classification.confidence.toString());
                }
            );

            if (!locationStarted) {
                logger.log('[Activity Controller] Failed to start location tracking');
            }

            // Setup Accelerometer Service
            const accelerometerStarted = await accelerometerServiceRef.current.startTracking(
                (accelerometerData, netAcceleration) => {
                    setAcceleration(netAcceleration.toFixed(2));
                }
            );

            if (!accelerometerStarted) {
                logger.log('[Activity Controller] Failed to start accelerometer tracking');
            }

            // Setup Pedometer Service
            const pedometerStarted = await pedometerServiceRef.current.startTracking(
                (stepCount, caloriesCount) => {
                    setSteps(stepCount.toFixed(0));
                    setCalories(caloriesCount.toFixed(0));
                }
            );

            if (!pedometerStarted) {
                logger.log('[Activity Controller] Failed to start pedometer tracking');
            }
        };

        setupSensors();

        return () => {
            // Clean up all services when activity stops
            locationServiceRef.current.stopTracking();
            accelerometerServiceRef.current.stopTracking();
            pedometerServiceRef.current.stopTracking();
        };
    }, [actStatus]);

    // Effect to manage the logging interval
    useEffect(() => {
        if (actStatus) {
            // Start logging
            startTimeRef.current = Date.now();
            
            intervalRef.current = setInterval(() => {
                const currentTime = Date.now();
                const elapsedSeconds = Math.floor((currentTime - startTimeRef.current) / 1000);
                setDuration(formatDuration(elapsedSeconds));

                // Create and add new log entry using refs for current values
                const currentTimeStamp = Date.now();
                setLogs(prevLogs => [...prevLogs, {
                    id: `${currentTimeStamp}-${Math.random()}`,
                    duration: formatDuration(elapsedSeconds),
                    distance: parseFloat(distanceRef.current).toFixed(2),
                    steps: stepsRef.current,
                    calories: parseFloat(caloriesRef.current).toFixed(0),
                    activityType: actKindRef.current,
                    speed: parseFloat(speedRef.current).toFixed(2),
                    acceleration: parseFloat(accelerationRef.current).toFixed(2),
                    confidence: parseFloat(confidenceRef.current).toFixed(0),
                    latitude: parseFloat(latitudeRef.current).toFixed(6),
                    longitude: parseFloat(longitudeRef.current).toFixed(6),
                }]);
                logger.log(`[Activity Controller] Log entry created: ${elapsedSeconds}s`);
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [actStatus]);

    const handleGoToStats = () => {
        logger.log('[Stats Controller] Navigation to: Stats');
        navigation.navigate('Stats');
    }

    const handleCheckLogs = () => {
        logger.log('[Stats Controller] Navigation to: Logs');
        navigation.navigate('Logs', { logs });
    }

    const handleStopWorkout = async () => {
        logger.log('[Activity Controller] Workout stopped');
        setActStatus(false);
        
        // Save workout session before resetting
        const saved = await storageServiceRef.current.saveWorkoutSession(
            parseFloat(distanceRef.current),
            duration,
            parseFloat(caloriesRef.current),
            parseFloat(stepsRef.current),
            logs
        );
        
        if (saved) {
            logger.log('[Activity Controller] Workout session saved successfully');
        } else {
            logger.log('[Activity Controller] Failed to save workout session');
        }
        
        // Reset all services
        locationServiceRef.current.reset();
        accelerometerServiceRef.current.reset();
        pedometerServiceRef.current.reset();
        
        // Reset display values
        setLatitude('0.000000');
        setLongitude('0.000000');
        setSpeed('0.00');
        setAcceleration('0.00');
    }

    const handleStartWorkout = () => {
        logger.log('[Activity Controller] Workout started');
        
        // Clear previous session data
        setLogs([]);
        setDuration('00:00');
        setDistance('0');
        setCalories('0');
        setSteps('0');
        
        // Reset all services
        locationServiceRef.current.reset();
        accelerometerServiceRef.current.reset();
        pedometerServiceRef.current.reset();
        
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