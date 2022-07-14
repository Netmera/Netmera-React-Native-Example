/*
 * Copyright (c) 2022 Inomera Research.
 */

// Netmera Push Events

export const onPushRegister = async (message) => {
    console.log("onPushRegister: ", message);
};

export const onPushReceive = async (message) => {
    console.log("onPushReceive: ", message);
};

export const onPushOpen = async (message) => {
    console.log("onPushOpen: ", message);
};

export const onPushDismiss = async (message) => {
    console.log("onPushDismiss: ", message);
};

export const onPushButtonClicked = async (message) => {
    console.log("onPushButtonClicked: ", message);
};

export const onCarouselObjectSelected = async (message) => {
    console.log("onCarouselObjectSelected: ", message);
};