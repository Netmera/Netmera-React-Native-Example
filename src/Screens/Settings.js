/*
 * Copyright (c) 2022 Inomera Research.
 */

import React, {useEffect, useState} from "react";
import {Platform, Text, TouchableHighlight, View} from "react-native";
import styles from "../Style";
import {Netmera} from "react-native-netmera";

const Settings = () => {
    const [isPushEnabled, setIsPushEnabled] = useState(null)

    useEffect(() => {
        if (Platform.OS === 'ios') {
            Netmera.requestPushNotificationAuthorization()
        }
    }, [])

    const pushEnabledCheck = async () => {
        setIsPushEnabled("Is Push Enabled: " + await Netmera.isPushEnabled())
    }

    const enablePush = () => {
        Netmera.enablePush()
    }

    const disablePush = () => {
        Netmera.disablePush()
    }

    const disablePopupPresentation = () => {
        Netmera.disablePopupPresentation()
    }

    const enablePopupPresentation = () => {
        Netmera.enablePopupPresentation()
    }

    const requestPermissionsForLocation = () => {
        Netmera.requestPermissionsForLocation();
    }

    const setNetmeraMaxActiveRegions = () => {
        Netmera.setNetmeraMaxActiveRegions(10)
    }

    const turnOffSendingEventAndUserUpdate = () => {
        Netmera.turnOffSendingEventAndUserUpdate(false)
    }

    const getCurrentExternalId = async () => {
        setIsPushEnabled("Current External Id: " + await Netmera.currentExternalId())
    };

    return (
        <View style={styles.container}>
            <Text>{isPushEnabled != null ? isPushEnabled.toString() : ""}</Text>
            <TouchableHighlight style={styles.button} onPress={() => pushEnabledCheck()}>
                <Text style={styles.buttonText}>Is Push Enabled</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => enablePush()}>
                <Text style={styles.buttonText}>Enable Push</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => disablePush()}>
                <Text style={styles.buttonText}>Disable Push</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => disablePopupPresentation()}>
                <Text style={styles.buttonText}>Disable Popup Presentation</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => enablePopupPresentation()}>
                <Text style={styles.buttonText}>Enable Popup Presentation</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => requestPermissionsForLocation()}>
                <Text style={styles.buttonText}>Request Permissions For Location</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => setNetmeraMaxActiveRegions()}>
                <Text style={styles.buttonText}>Set Netmera Max Active Regions</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => turnOffSendingEventAndUserUpdate()}>
                <Text style={styles.buttonText}>Turn Off Sending Event And User Update</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => getCurrentExternalId()}>
                <Text style={styles.buttonText}>Current External Id</Text>
            </TouchableHighlight>
        </View>
    )
};

export default Settings;