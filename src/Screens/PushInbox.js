/*
 * Copyright (c) 2022 Inomera Research.
 */

import React, {useState} from "react";
import {Alert, FlatList, Text, TouchableHighlight, View} from "react-native";
import styles from "../Style";
import {Netmera, NetmeraInboxFilter, NMInboxStatus, NMInboxStatusCountFilter} from "react-native-netmera";
import SelectDropdown from 'react-native-select-dropdown'

const PushInbox = () => {

    const [inbox, setInbox] = useState([])
    const [inboxState, setInboxState] = useState(NMInboxStatus.STATUS_ALL)
    const [statusCount, setStatusCount] = useState(0)

    const states = ["ALL", "DELETED", "READ_OR_UNREAD", "READ", "UNREAD"];

    const fetchInbox = async () => {
        try {
            const netmeraInboxFilter = new NetmeraInboxFilter();
            netmeraInboxFilter.status = inboxState;
            netmeraInboxFilter.pageSize = 2; // Fetch two push object
            const inbox = await Netmera.fetchInbox(netmeraInboxFilter);
            console.log("inbox", inbox);
            setInbox(inbox)
        } catch (e) {
            console.log("error", e)
        }
    }

    const fetchNextPage = async () => {
        try {
            const inbox = await Netmera.fetchNextPage();
            setInbox(inbox)
            console.log("inbox", inbox)
        } catch (e) {
            console.log("error", e)
        }
    }

    const updateAll = async () => {
        if (!inbox !== undefined) {
            if (inboxState === NMInboxStatus.STATUS_ALL) {
                Alert.alert("Error", "Please select different status than all!!")
                console.log("Please select different status than all!!");
                return
            }

            try {
                Netmera.updateAll(inboxState)
                    .then(() => fetchInbox())
                    .catch((error) => console.log("error: " + error))
            } catch (error) {
                console.log("error: " + error)
            }
        }
    }

    // Handles first push object
    const handlePushObject = async () => {
        if (inbox !== undefined && inbox.length > 0) {
            Netmera.handlePushObject(inbox[0].pushId)
        }
    }

    // Handles interactive action of first push object.
    const handleInteractiveAction = async () => {
        if (inbox !== undefined && inbox.length > 0) {
            for (let i = 0; i < inbox.length; i++) {
                const element = inbox[i]
                if (element.interactiveActions !== undefined && element.interactiveActions.length > 0) {
                    const action = JSON.parse(element.interactiveActions)[0]
                    Netmera.handleInteractiveAction(action.id)
                    return
                }
            }
        }
    }

    // Returns push object count by selected status.
    const countForStatus = async () => {
        try {
            const count = await Netmera.countForStatus(inboxState)
            setStatusCount(count)
        } catch (error) {
            console.log("error: " + error)
        }
    }

    // Update first two push object status to "UNREAD".
    const inboxUpdateStatus = async () => {
        if (inbox === undefined || inbox < 2) {
            Alert.alert("Error", "Push objects count is less then 2!")
            console.log("Push objects count is less then 2!")
            return
        }
        Netmera.inboxUpdateStatus(0, 2, NMInboxStatus.STATUS_UNREAD).then(() => {
            console.log("2 push object status was changed successfully.")
        }).catch((error) => {
            console.log("error: " + error)
        })
    }

    // Returns inbox count by selected status.
    const inboxCountForStatus = async () => {
        try {
            const filter = new NMInboxStatusCountFilter();
            filter.nmInboxStatus = inboxState;
            filter.includeExpired = true;
            const nmInboxStatusCount = await Netmera.getInboxCountForStatus(filter);

            let countStatusText = "ALL: " + nmInboxStatusCount[NMInboxStatus.STATUS_ALL] + ", " +
                "READ: " + nmInboxStatusCount[NMInboxStatus.STATUS_READ] + ", " +
                "UNREAD: " + nmInboxStatusCount[NMInboxStatus.STATUS_UNREAD] + ", " +
                "DELETED: " + nmInboxStatusCount[NMInboxStatus.STATUS_DELETED]

            setStatusCount(countStatusText)
            console.log("nmInboxStatusCount: ", countStatusText);
        } catch (e) {
            console.log("error", e)
        }
    };

    const updateInboxState = (value) => {
        switch (value) {
            case "ALL":
                setInboxState(NMInboxStatus.STATUS_ALL)
                break;

            case "DELETED":
                setInboxState(NMInboxStatus.STATUS_DELETED)
                break;

            case "READ_OR_UNREAD":
                setInboxState(NMInboxStatus.STATUS_READ_OR_UNREAD)
                break;

            case "READ":
                setInboxState(NMInboxStatus.STATUS_READ)
                break;

            case "UNREAD":
                setInboxState(NMInboxStatus.STATUS_UNREAD)
                break;
        }
    }

    const getInboxItem = (item, index) => {
        return (
            <View style={{paddingHorizontal: 10, width: "100%"}}>
                <Text>Title: {item.title === undefined ? "null" : item.title}</Text>
                <Text>Subtitle: {item.subtitle === undefined ? "null" : item.subtitle}</Text>
                <Text>Push Type: {item.pushType === undefined ? "null" : item.pushType}</Text>
                <Text>Push Id: {item.pushId === undefined ? "null" : item.pushId}</Text>
                <Text>Push Instance
                    Id: {item.pushInstanceId === undefined ? "null" : item.pushInstanceId}</Text>
                <Text>Send Date: {item.sendDate === undefined ? "null" : item.sendDate}</Text>
                <Text>Inbox
                    Status: {item.inboxStatus === undefined ? "null" : item.inboxStatus}</Text>
                <Text>Action Deeplink
                    Url: {item.deepLink === undefined ? "null" : item.deepLink}</Text>
                <Text>Action Web Page
                    Url: {item.webPage === undefined ? "null" : item.webPage}</Text>
                <Text>External Id: {item.externalId === undefined ? "null" : item.externalId}</Text>
                <Text>Media Attachment
                    Url: {item.mediaAttachmentURL === undefined ? "null" : item.mediaAttachmentURL}</Text>
                <Text>Categories: {item.categories === undefined ? "null" : JSON.stringify(item.categories)}</Text>
                <Text>Custom Json: {item.customJson === undefined ? "null" : JSON.stringify(item.customJson)}</Text>
                {index !== inbox.length - 1 ?
                    <View style={styles.divider}/> :
                    <View style={{marginBottom: 15}}/>
                }
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.rowItem}>
                    <SelectDropdown
                        data={states}
                        buttonStyle={styles.dropdown}
                        buttonTextStyle={{fontSize: 13}}
                        rowTextStyle={{fontSize: 13}}
                        dropdownStyle={{width: '50%'}}
                        dropdownIconPosition={"right"}
                        defaultValueByIndex={0}
                        onSelect={(value) => updateInboxState(value)}
                        buttonTextAfterSelected={(item) => item}
                        rowTextForSelection={(item) => {
                            return item
                        }}/>
                </View>

                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]} onPress={() => fetchInbox()}>
                        <Text style={styles.buttonText}>Fetch Inbox</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]} onPress={() => fetchNextPage()}>
                        <Text style={styles.buttonText}>Fetch Next Page</Text>
                    </TouchableHighlight>
                </View>

            </View>
            <View style={styles.row}>
                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]} onPress={() => updateAll()}>
                        <Text style={styles.buttonText}>Update All</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]}
                                        onPress={() => inboxUpdateStatus()}>
                        <Text style={styles.buttonText}>Update Status (Unread 2 elem.)</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]}
                                        onPress={() => inboxCountForStatus()}>
                        <Text style={styles.buttonText}>Inbox Count For Status</Text>
                    </TouchableHighlight>
                </View>
            </View>
            <View style={styles.row}>
                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]} onPress={() => countForStatus()}>
                        <Text style={styles.buttonText}>Count For Status</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]} onPress={() => handlePushObject()}>
                        <Text style={styles.buttonText}>Handle Push Object</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]}
                                        onPress={() => handleInteractiveAction()}>
                        <Text style={styles.buttonText}>Handle Interactive Action</Text>
                    </TouchableHighlight>
                </View>
            </View>
            <Text style={styles.text}>Count for Status : {statusCount}</Text>

            <FlatList
                data={inbox}
                renderItem={({item, index}) => {
                    return getInboxItem(item, index)
                }}
                keyExtractor={item => item.pushInstanceId}
                contentContainerStyle={{width: "100%", justifyContent: 'center'}}
                style={{width: "100%"}}
            />
        </View>
    )
};

export default PushInbox;
