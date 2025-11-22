import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ActivityLog } from './ActivityLog';

export type RootStackParamList = {
    Activity: undefined;
    Stats: undefined;
    Map: undefined;
    Logs: { logs: ActivityLog[] };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type LogsScreenRouteProp = RouteProp<RootStackParamList, 'Logs'>;