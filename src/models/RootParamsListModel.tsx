import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Activity: undefined;
    Stats: undefined;
    Map: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;