import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../models/RootParamsListModel';

import ActivityScreen from '../views/screens/ActivityScreen';
import StatsScreen from '../views/screens/StatsScreen';
import MapScreen from '../views/screens/MapScreen';
import LogsScreen from '../views/screens/LogsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Activity"
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen 
                    name="Activity" 
                    component={ActivityScreen}
                    options={{ title: 'Activity' }}
                />
                <Stack.Screen
                    name="Stats"
                    component={StatsScreen}
                    options={{ title: 'Stats' }}
                />
                <Stack.Screen
                    name="Map"
                    component={MapScreen}
                    options={{
                        presentation: 'modal',
                    }}
                />
                <Stack.Screen
                    name="Logs"
                    component={LogsScreen}
                    options={{
                        presentation: 'modal',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}