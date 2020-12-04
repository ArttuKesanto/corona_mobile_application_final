// Referencing: https://www.youtube.com/watch?v=ZcaQJoXY-3Q, https://github.com/nathvarun/React-Native-Firebase-Tutorials/blob/master/Project%20Files/3.%20Facebook%20Login/Complete/App.js
// This "stack" is rendered if the user is not signed in.
import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert
} from 'react-native';
import {
    Header,
    Icon,
    Input,
    Button,
    ListItem
} from 'react-native-elements';
import {
    AntDesign,
    FontAwesome,
    MaterialCommunityIcons
} from '@expo/vector-icons';

import { firebaseConfig } from './config';
import * as firebase from 'firebase';

// Initialize Firebase. // TO-DO in future; hide this in .gitignore. Add your own credentials here, prototype displayed in comment-block.
if (!firebase.apps.length) { // No need to init the Firebase DB twice, and cannot, since there is an Error if duplicates are made.
    firebase.initializeApp(firebaseConfig);
}


export default class AuthApp extends React.Component {

    constructor(props) {
        super(props)

        this.state = ({
            email: '',
            password: ''
        })
    }

    signUpUser = (email, password) => {
        try {

            if (this.state.password.length < 6 || this.state.email.length < 7) {
                alert("Please enter at least 6 characters for the password, and check the e-mail address.")
                return;
            }

            firebase.auth().createUserWithEmailAndPassword(email, password)
            Alert.alert("Success", "Succesfully signed up the account!") // Displaying a message to the user if signing up. Signs in with this account.
        }
        catch (error) {
            console.log(error.toString());
            alert("Something went wrong... Check the details provided.");
            return;
        }
    }

    loginUser = (email, password) => {
        try {

            if (this.state.password.length < 6 || this.state.email.length < 7) {
                alert("Please enter at least 6 characters for the password, and check the e-mail address.")
                return;
            }

            firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
                console.log(user)

            })
            Alert.alert("Success", "Logged in to your account!") // Displaying this message to the user when a user logs in.
        }
        catch (error) {
            alert("Something went wrong... Check the details provided.");
            console.log(error.toString());
            return;
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ alignContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                    <Text>Corona Mobile Application - Authentication</Text>
                </View>
                <View>

                    <View style={{ alignContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                        <Image
                            style={styles.tinyLogo}
                            source={require('../assets/virus_login.jpeg')}
                        />
                    </View>

                    <View>
                        <Text>Email</Text>
                        <Input
                            autoCorrect={false}
                            autoCapitalize="none"
                            placeholder="Input your e-mail address..."
                            onChangeText={(email) => this.setState({ email })}
                            leftIcon={
                                <MaterialCommunityIcons
                                    name='email-alert'
                                    size={17}
                                    color='black'
                                />
                            }
                        />

                    </View>

                    <View>
                        <Text>Password</Text>
                        <Input
                            secureTextEntry={true}
                            autoCorrect={false}
                            autoCapitalize="none"
                            placeholder="Input your password..."
                            onChangeText={(password) => this.setState({ password })}
                            leftIcon={
                                <AntDesign
                                    name='unlock'
                                    size={17}
                                    color='black'
                                />
                            }
                        />
                    </View>

                    <Button
                        style={{ marginTop: 10 }}
                        title={"Login"}
                        onPress={() => this.loginUser(this.state.email, this.state.password)}
                        icon={
                            <AntDesign
                                name='login'
                                size={16}
                                color={'#33bf2c'}
                                style={{ padding: 2 }}
                            />
                        }
                    />

                    <Button
                        style={{ marginTop: 10 }}
                        title={"Sign up"}
                        onPress={() => this.signUpUser(this.state.email, this.state.password)}
                        icon={
                            <FontAwesome
                                name='sign-in'
                                size={16}
                                color={'#fff829'}
                                style={{ padding: 2 }}
                            />
                        }
                    />


                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 10
    },
    tinyLogo: {
        height: 100,
        width: 100
    }
});