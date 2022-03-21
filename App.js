/*
 * Copyright (c) 2022 Inomera Research.
 */

import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Event from "./src/Screens/Event";
import User from "./src/Screens/User";
import PushInbox from "./src/Screens/PushInbox";
import Settings from "./src/Screens/Settings";
import Category from "./src/Screens/Category";
import {Platform, StatusBar} from "react-native";
import Config from "react-native-config";

const Tab = createBottomTabNavigator();

const App = () => {
    let tabBarOptions = {
        tabBarLabelPosition: "beside-icon",
        tabBarIconStyle: {
            display: 'none',
        },
        tabBarLabelStyle: {
            position: "absolute",
            fontWeight: "700",
            fontSize: 12,
        },
    };

    return (
        <NavigationContainer>
            <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}/>
            <Tab.Navigator>
                <Tab.Screen name={"Event"} component={Event} options={tabBarOptions}/>
                <Tab.Screen name={"User"} component={User} options={tabBarOptions}/>
                <Tab.Screen name={"PushInbox"} component={PushInbox} options={tabBarOptions}/>
                <Tab.Screen name={"Settings"} component={Settings} options={tabBarOptions}/>
                <Tab.Screen name={"Category"} component={Category} options={tabBarOptions}/>
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default App;
