import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Welcome from '../pages/Welcome';
import Cadastro from '../pages/Cadastro';
import Login from '../pages/Login';
import Senha from '../pages/Senha';
import Home from '../pages/Home';
import Status from '../pages/Status';
import Perfil from '../pages/Perfil'

const Stack = createNativeStackNavigator();

export default function MyStack() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Cadastro" component={Cadastro} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Senha" component={Senha} />
            <Stack.Screen name="Home" component={MyTabs} />
            <Stack.Screen name="Status" component={Status} />
            <Stack.Screen name="Perfil" component={Perfil} />
        </Stack.Navigator>
    );
}

const Tab = createBottomTabNavigator();

export function MyTabs() {
    return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Status') {
                            iconName = focused ? 'time' : 'time-outline';
                        } else if (route.name === 'Perfil') {
                            iconName = focused ? 'person' : 'person-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#00FF00',
                    tabBarInactiveTintColor: 'white',
                    tabBarStyle: {
                        backgroundColor: '#1a1a1a',
                        height: 70,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        margin: 5,
                    },
                    headerShown: false,
                })}
            >
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Status" component={Status} />
                <Tab.Screen name="Perfil" component={Perfil} />
            </Tab.Navigator>
    );
}
