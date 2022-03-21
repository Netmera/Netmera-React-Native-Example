/*
 * Copyright (c) 2022 Inomera Research.
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Netmera} from "react-native-netmera";
import { onPushButtonClicked,
    onPushDismiss,
    onPushOpen,
    onPushReceive,
    onPushRegister
} from "./NetmeraPushHeadlessTask";

// Init Netmera broadcast receiver to listen push events.
Netmera.initBroadcastReceiver(
    onPushRegister,
    onPushReceive,
    onPushOpen,
    onPushDismiss,
    onPushButtonClicked
)

AppRegistry.registerComponent(appName, () => App);
