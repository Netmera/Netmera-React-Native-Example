/*
 * Copyright (c) 2022 Inomera Research.
 */

import React, {useState} from "react";
import {Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableHighlight, View} from "react-native";
import styles from "../Style";
import Colors from "react-native/Libraries/NewAppScreen/components/Colors";
import {Picker} from "@react-native-picker/picker";
import {Netmera, NetmeraUser} from "react-native-netmera";
import MyNetmeraUser from "../Models/MyNetmeraUser";

const User = () => {

    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [msisdn, setMsisdn] = useState('');
    const [gender, setGender] = useState(NetmeraUser.GENDER_NOT_SPECIFIED);

    const sendUserUpdate = () => {
        const user = new MyNetmeraUser()

        // Set Default Attributes
        user.userId = userId

        if (name !== '') {
            user.name = name
        }
        if (surname !== '') {
            user.surname = surname
        }
        if (email !== '') {
            user.email = email
        }
        if (msisdn !== '') {
            user.msisdn = msisdn
        }
        if (gender !== null) {
            user.gender = gender
        }

        // Set Custom Attributes
        user.testGender = MyNetmeraUser.TestGender.TESTGENDER_MALE
        user.testName = "Test Name"

        Netmera.updateUser(user)
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                scrollEnabled={true}
                bounces={false}
                style={styles.scrollView}
                contentContainerStyle={{alignItems: 'center'}}>
                <TextInput
                    placeholder={"UserId (optional)"}
                    placeholderTextColor={Colors.dark}
                    style={styles.textInput}
                    value={userId}
                    autoCapitalize={'none'}
                    onChangeText={text => setUserId(text)}/>
                <TextInput
                    placeholder={"Name (optional)"}
                    placeholderTextColor={Colors.dark}
                    style={styles.textInput}
                    value={name}
                    onChangeText={text => setName(text)}/>
                <TextInput
                    placeholder={"Surname (optional)"}
                    placeholderTextColor={Colors.dark}
                    style={styles.textInput}
                    value={surname}
                    onChangeText={text => setSurname(text)}/>
                <TextInput
                    placeholder={"Email (optional)"}
                    placeholderTextColor={Colors.dark}
                    style={styles.textInput}
                    keyboardType={"email-address"}
                    value={email}
                    onChangeText={text => setEmail(text)}/>
                <TextInput
                    placeholder={"Msisdn (optional)"}
                    placeholderTextColor={Colors.dark}
                    style={styles.textInput}
                    keyboardType={"phone-pad"}
                    value={msisdn}
                    onChangeText={text => setMsisdn(text)}/>
                <Text style={{width: '50%', color: Colors.black, textAlign: 'center', marginBottom: 5}}>Gender
                    (optional)</Text>
                <View style={styles.picker}>
                    <Picker style={[{color: Colors.black}, Platform.OS === 'ios' ? {height: '35%'} : null]}
                            itemStyle={{fontSize: 13}}
                            mode={"dropdown"}
                            selectedValue={gender}
                            onValueChange={(itemValue) => setGender(itemValue)}
                            dropdownIconColor={Colors.black}>
                        <Picker.Item label="MALE" value={NetmeraUser.GENDER_MALE}/>
                        <Picker.Item label="FEMALE" value={NetmeraUser.GENDER_FEMALE}/>
                        <Picker.Item label="NOT SPECIFIED" value={NetmeraUser.GENDER_NOT_SPECIFIED}/>
                    </Picker>
                </View>

                <TouchableHighlight style={styles.button} onPress={() => sendUserUpdate()}
                                    underlayColor='#99d9f4'>
                    <Text style={styles.buttonText}>Update User</Text>
                </TouchableHighlight>
            </ScrollView>
        </SafeAreaView>
    )
};

export default User;
