import { ActivityType } from '../ActivityType';

export interface ActStartedProps {
    latitude: string;
    longitude: string;
    speed: string;
    acceleration: string;
    confidence: string;
    actKind: ActivityType;
    duration: string;
    distance: string;
    calories: string;
    steps: string;
    handleCheckLogs: () => void;
    handleStopWorkout: () => void;
}