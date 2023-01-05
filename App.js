import type {Node} from 'react';
import React, {useRef, useState} from 'react';
import {db} from './firebase-config.js';
import Snackbar from 'react-native-snackbar';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {Alert, Button, Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import {push, ref} from 'firebase/database';

const App: () => Node = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageData, setImageData] = useState('');

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const doSelectFile = () => {
        const options = {
            maxWidth: 2000,
            maxHeight: 2000,
            selectionLimit: 1,
        };

        launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const assert = response.assets[0];
                const source = assert.uri;
                setImageData(source);
            }
        });
    };

    const doSubmitData = async function () {

        try {

            if (firstName === '') {
                Snackbar.show({
                    text: 'Enter First Name',
                    duration: Snackbar.LENGTH_SHORT,
                });
                firstNameRef.current.focus();
            } else if (lastName === '') {
                Snackbar.show({
                    text: 'Enter Last Name',
                    duration: Snackbar.LENGTH_SHORT,
                });
                lastNameRef.current.focus();
            } else if (email === '') {
                Snackbar.show({
                    text: 'Enter Email Address',
                    duration: Snackbar.LENGTH_SHORT,
                });
                emailRef.current.focus();
            } else if (password === '') {
                Snackbar.show({
                    text: 'Enter Password',
                    duration: Snackbar.LENGTH_SHORT,
                });
                passwordRef.current.focus();
            } else if (imageData === '') {
                Snackbar.show({
                    text: 'Select User Photo',
                    duration: Snackbar.LENGTH_SHORT,
                });
            } else {

                const filename = imageData.substring(imageData.lastIndexOf('/') + 1);
                const data = {
                    'firstname': firstName,
                    'lastname': lastName,
                    'emailaddress': email,
                    'password': password,
                    'uploadedfilename': filename,
                };
                const uploadUri = Platform.OS === 'ios' ? imageData.replace('file://', '') : imageData;

                const task = storage()
                    .ref(filename)
                    .putFile(uploadUri);

                try {
                    await task;
                    console.log('uploading image');
                } catch (e) {
                    console.log('Upload Error: ', e);
                }

                try {
                    push(ref(db, '/userData'), data);
                    console.log('saving user data');
                } catch (e) {
                    console.log(e);
                }

                Alert.alert(
                    'Data uploaded!',
                    'User Registration Data was Successfully Saved to Firebase Cloud Storage!',
                );
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setImageData('');

                firstNameRef.current.clear();
                lastNameRef.current.clear();
                emailRef.current.clear();
                passwordRef.current.clear();

            }
        } catch (err) {
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{
                margin: 9,
                color: '#fff',
                fontSize: 37,
                fontFamily: 'Montserrat',
                fontWeight: 'bold',
            }}>JANEX.</Text>
            <Text
                style={{
                    marginRight: 9,
                    marginLeft: 9,
                    color: '#fff',
                    marginTop: 11,
                    fontFamily: 'Montserrat',
                    fontSize: 27,
                    fontWeight: 'bold',
                }}>Create an account</Text>
            <Text style={{
                marginRight: 9,
                marginLeft: 9,
                fontFamily: 'Montserrat',
                marginBottom: 17,
                fontSize: 13,
                color: '#fff',
            }}>Please fill in the details below to create an account</Text>
            <TextInput style={styles.input}
                       underlineColorAndroid="transparent"
                       placeholder="First name"
                       ref={firstNameRef}
                       placeholderTextColor="#F7F5EB"
                       onChangeText={(text) => setFirstName(text)}
                       autoCapitalize="none"/>

            <TextInput style={styles.input}
                       underlineColorAndroid="transparent"
                       placeholder="Last name"
                       ref={lastNameRef}
                       placeholderTextColor="#F7F5EB"
                       onChangeText={(text) => setLastName(text)}
                       autoCapitalize="none"/>

            <TextInput style={styles.input}
                       underlineColorAndroid="transparent"
                       placeholder="Email"
                       ref={emailRef}
                       placeholderTextColor="#F7F5EB"
                       onChangeText={(text) => setEmail(text)}
                       autoCapitalize="none"/>

            <TextInput style={styles.input}
                       underlineColorAndroid="transparent"
                       placeholder="Password"
                       ref={passwordRef}
                       onChangeText={(text) => setPassword(text)}
                       placeholderTextColor="#F7F5EB"
                       autoCapitalize="none"/>

            <View style={styles.submitButton}>
                <Button title="Upload file" onPress={doSelectFile}/>
            </View>
            <View style={styles.submitButton}>
                <Button style={styles.submitButton} onPress={doSubmitData} title="Submit Data"/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 15,
        backgroundColor: '#04021F',
    },
    input: {
        margin: 9,
        height: 48,
        color: '#fff',
        fontSize: 17,
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 7,
        padding: 11,
    },
    submitButton: {
        padding: 3,
        marginLeft: 9,
        marginRight: 9,
        marginBottom: 3,
        borderRadius: 7,
    },
});

export default App;
