/*
 * Copyright (c) 2022 Inomera Research.
 */

import React, {useState} from "react";
import {Alert, FlatList, Text, TouchableHighlight, View} from "react-native";
import styles from "../Style";
import {Netmera, NetmeraCategoryFilter} from "react-native-netmera";
import SelectDropdown from "react-native-select-dropdown";

const Category = () => {

    const [categories, setCategories] = useState([])
    const [categoryState, setCategoryState] = useState(Netmera.PUSH_OBJECT_STATUS_ALL)

    const categoryStates = ["ALL", "DELETED", "READ_OR_UNREAD", "READ", "UNREAD"];

    const fetchCategory = async () => {
        try {
            const netmeraCategoryFilter = new NetmeraCategoryFilter()
            netmeraCategoryFilter.status = categoryState
            netmeraCategoryFilter.pageSize = 1 // Fetch one by one
            const categories = await Netmera.fetchCategory(netmeraCategoryFilter)
            console.log("categories", categories);
            setCategories(categories)
        } catch (e) {
            console.log("error", e)
        }
    }

    const fetchNextCategoryPage = async () => {
        try {
            const categories = await Netmera.fetchNextCategoryPage()
            setCategories(categories)
            console.log("categories", categories)
        } catch (e) {
            console.log("error", e)
        }
    }

    const handlePushObject = async () => {
        if (categories !== undefined && categories.length > 0) {
            Netmera.handleLastMessage(categories[0].categoryName)
        }
    }

    const updateStatusCategories = async () => {
        if (categoryState === Netmera.PUSH_OBJECT_STATUS_ALL) {
            Alert.alert("Error", "Please select different status than all!!")
            console.log("Please select different status than all!!")
            return
        }
        if (categories === undefined || categories < 1) {
            Alert.alert("Error", "Category object not found!")
            console.log("Category object not found!")
            return
        }

        const count = categories.length < 3 ? categories.length : 2

        Netmera.updateStatusByCategories(0, count, categoryState).then(() => {
            console.log("Category object status was changed successfully.")
        }).catch((error) => {
            console.log("error: " + error)
        })
    }

    const updateCategoryState = (value) => {
        switch (value) {
            case "ALL":
                setCategoryState(Netmera.PUSH_OBJECT_STATUS_ALL)
                break;

            case "DELETED":
                setCategoryState(Netmera.PUSH_OBJECT_STATUS_DELETED)
                break;

            case "READ_OR_UNREAD":
                setCategoryState(Netmera.PUSH_OBJECT_STATUS_READ_OR_UNREAD)
                break;

            case "READ":
                setCategoryState(Netmera.PUSH_OBJECT_STATUS_READ)
                break;

            case "UNREAD":
                setCategoryState(Netmera.PUSH_OBJECT_STATUS_UNREAD)
                break;
        }
    }

    const getUserCategoryPreferenceList = () => {
        Netmera.getUserCategoryPreferenceList().then((response) => {
            setCategories(response)
            console.log("User Category Preference List: " + response)
        }).catch((error) => {
            console.log("error: " + error)
        });
    };

    const setUserCategoryPreference = (item) => {
        Netmera.setUserCategoryPreference(item.categoryId, !item.optInStatus).then(() => {
            console.log("Successfully set user category preference list")
            setTimeout(() => {
                getUserCategoryPreferenceList()
            }, 500)

        }).catch((error) => {
            console.log("error: " + error)
        });
    };

    const getCategoryItem = (item, index) => {
        console.log(item)
        return (
            <View style={{paddingHorizontal: 10, width: "100%"}}>
                <Text>Category Name: {item.categoryName === undefined ? "null" : item.categoryName}</Text>
                <Text>Category Status: {item.categoryStatus === undefined ? "null" : item.categoryStatus}</Text>
                <Text>Read Count: {item.readCount === undefined ? "null" : item.readCount}</Text>
                <Text>Unread Count: {item.unreadCount === undefined ? "null" : item.unreadCount}</Text>
                <Text>Deleted Count: {item.deletedCount === undefined ? "null" : item.deletedCount}</Text>
                <Text>Last Message: {item.lastMessage === undefined ? "null" : JSON.stringify(item.lastMessage)}</Text>

                {index !== categories.length - 1 ?
                    <View style={styles.divider}/> :
                    <View style={{marginBottom: 15}}/>
                }
            </View>
        )
    }

    const getUserCategoryPreferenceItem = (item, index) => {
        return (
            <View style={{paddingHorizontal: 10, width: "100%", alignItems: "center"}}>
                <View style={{width: "90%", flexDirection: "row"}}>
                    <View style={{width: "70%"}}>
                        <Text>Category Id: {item.categoryId === undefined ? "null" : item.categoryId}</Text>
                        <Text>Category Name: {item.categoryName === undefined ? "null" : item.categoryName}</Text>
                    </View>
                    <View style={{width: "30%"}}>
                        <TouchableHighlight style={[styles.button, styles.inboxButton]} onPress={() => {
                            console.log("item")
                            setUserCategoryPreference(item);
                        }}>
                            <Text style={styles.buttonText}>{item.optInStatus ? "Disable" : "Enable"}</Text>
                        </TouchableHighlight>
                    </View>
                </View>
                {index !== categories.length - 1 ?
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
                        data={categoryStates}
                        buttonStyle={styles.dropdown}
                        buttonTextStyle={{fontSize: 13}}
                        rowTextStyle={{fontSize: 13}}
                        dropdownStyle={{width: '50%'}}
                        dropdownIconPosition={"right"}
                        defaultValueByIndex={0}
                        onSelect={(value) => updateCategoryState(value)}
                        buttonTextAfterSelected={(item) => item}
                        rowTextForSelection={(item) => {
                            return item
                        }}/>
                </View>

                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]} onPress={() => fetchCategory()}>
                        <Text style={styles.buttonText}>Fetch Category</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]}
                                        onPress={() => fetchNextCategoryPage()}>
                        <Text style={styles.buttonText}>Fetch Next Category Page</Text>
                    </TouchableHighlight>
                </View>

            </View>
            <View style={styles.row}>
                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]} onPress={() => handlePushObject()}>
                        <Text style={styles.buttonText}>Handle Last Message</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]}
                                        onPress={() => updateStatusCategories()}>
                        <Text style={styles.buttonText}>Update Status For First Two Categories</Text>
                    </TouchableHighlight>
                </View>
                <View style={styles.rowItem}>
                    <TouchableHighlight style={[styles.button, styles.inboxButton]}
                                        onPress={() => getUserCategoryPreferenceList()}>
                        <Text style={styles.buttonText}>User Category Preference List</Text>
                    </TouchableHighlight>
                </View>
            </View>

            <FlatList
                data={categories}
                renderItem={({item, index}) => {
                    if (item.categoryId) {
                        return getUserCategoryPreferenceItem(item, index);
                    } else {
                        return getCategoryItem(item, index);
                    }

                }}
                keyExtractor={item => item.categoryName}
                contentContainerStyle={{width: "100%", justifyContent: 'center'}}
                style={{width: "100%"}}
            />
        </View>
    )
};

export default Category;