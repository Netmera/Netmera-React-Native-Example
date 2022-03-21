/*
 * Copyright (c) 2022 Inomera Research.
 */

import {NetmeraUser} from "react-native-netmera";

export default class MyNetmeraUser extends NetmeraUser {

    // Custom Enum Attributes
    static TestGender = {
        TESTGENDER_MALE: 1,
        TESTGENDER_FEMALE: 2,
        TESTGENDER_NOT_SPECIFIED: 3
    };

    // Custom Attributes
    set testName(value) {
        this.ya = value
    }

    set testGender(value) {
        this.sl = value
    }
}