/*
 * Copyright (c) 2022 Inomera Research.
 */

import React from 'react';
import {Text, TouchableHighlight, View} from "react-native";
import styles from '../Style'
import {Netmera} from "react-native-netmera";
import {
    CustomPurchaseEvent,
    LoginEvent,
    NetmeraLineItem,
    RegisterEvent,
    TestEvent,
    ViewCartEvent
} from "../Models/Events";

const Event = () => {

    const sendLoginEvent = () => {
        const loginEvent = new LoginEvent()
        loginEvent.userId = "TestUserId"
        loginEvent.userIda = 21893718239812738
        loginEvent.userIdax = "21893718239812738"
        Netmera.sendEvent(loginEvent)
    }

    const sendRegisterEvent = () => {
        const registerEvent = new RegisterEvent();
        Netmera.sendEvent(registerEvent)
    }

    const sendViewCartEvent = () => {
        const viewCartEvent = new ViewCartEvent();
        viewCartEvent.subTotal = 96.7;
        viewCartEvent.itemCount = 9;
        Netmera.sendEvent(viewCartEvent)
    }

    const sendPurchaseEvent = () => {
        const netmeraLineItem = new NetmeraLineItem();
        netmeraLineItem.brandId = "TestBrandID";
        netmeraLineItem.brandName = "TestBrandName";
        netmeraLineItem.campaignId = "TestCampaignID";
        netmeraLineItem.categoryIds = ["TestCategoryID1", "TestCategoryID2"];
        netmeraLineItem.categoryNames = ["TestCategoryName1", "TestCategoryName2", "TestCategoryName3"];
        netmeraLineItem.keywords = ["keyword1", "keyword2", "keyword3"];
        netmeraLineItem.count = (2);
        netmeraLineItem.id = ("TestItemID");
        netmeraLineItem.price = (130);

        // CustomPurchaseEvent extends PurchaseEvent
        const purchaseEvent = new CustomPurchaseEvent();
        // Set default attributes
        purchaseEvent.coupon = "TEST_COUPON";
        purchaseEvent.discount = 10;
        purchaseEvent.grandTotal = 250.89;
        purchaseEvent.itemCount = 2;
        purchaseEvent.paymentMethod = "Credit";
        purchaseEvent.subTotal = 260.89;
        purchaseEvent.shippingCost = 0.0;
        purchaseEvent.purchaseLineItemEvent = [netmeraLineItem, netmeraLineItem];

        // Set custom attributes
        purchaseEvent.installment = "5";
        Netmera.sendEvent(purchaseEvent)
    }

    const sendCustomEvent = () => {
        // Custom event
        const testEvent = new TestEvent();
        testEvent.testAttribute = "TestAttribute";
        Netmera.sendEvent(testEvent);
    }

    return (
        <View style={styles.container}>
            <TouchableHighlight style={styles.button} onPress={() => sendLoginEvent()}>
                <Text style={styles.buttonText}>Login Event</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => sendRegisterEvent()}>
                <Text style={styles.buttonText}>Register Event</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => sendViewCartEvent()}>
                <Text style={styles.buttonText}>View Cart Event</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => sendPurchaseEvent()}>
                <Text style={styles.buttonText}>Purchase Event</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={() => sendCustomEvent()}>
                <Text style={styles.buttonText}>Custom Text Event</Text>
            </TouchableHighlight>
        </View>
    )
};

export default Event;