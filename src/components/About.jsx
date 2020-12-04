import React,
{ useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    Image,
    Alert,
    FlatList,
    Linking
} from 'react-native';
import {
    NavigationContainer,
    StackActions
} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

import { creatingSpace } from './CSpace';

export default function AboutTheApp({ navigation }) {

    const styles = StyleSheet.create({
        main: {
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'column'
        },
        input: {
            borderColor: 'gold',
            width: 100,
            height: 50,
            borderWidth: 3,
            justifyContent: 'center',
            alignContent: 'center',
        },
        tinyLogo: {
            width: 100,
            height: 100,
        },
        casesNumbers: {
            marginBottom: 10,
        },
        container: {
            flex: 1,
            borderWidth: 2,
            borderColor: 'red',
            borderRadius: 10,
            margin: 5,
            alignItems: 'center'

        }


    });

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={{ height: 40 }}>
                    </View>
                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Owner: Arttu Kesanto. </Text>
                    {creatingSpace}
                    <Text style={{ fontWeight: 'bold' }}>Links: </Text>
                    {creatingSpace}
                    <Text>GitHub: </Text><Text style={{ color: 'red' }} onPress={() => { Linking.openURL('https://github.com/ArttuKesanto') }}>ArttuKesanto</Text>
                    <Text>LinkedIn: </Text><Text style={{ color: 'red' }} onPress={() => { Linking.openURL('https://www.linkedin.com/in/arttu-aleksi-kesanto') }}>www.linkedin.com/in/arttu-aleksi-kesanto</Text>
                    <Text>Twitter: </Text><Text style={{ color: 'red' }} onPress={() => { Linking.openURL('https://twitter.com/kesantoa') }}>KesantoA</Text>
                    <View style={{ height: 40 }}>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={{ height: 50 }}>
                    </View>
                    <Text style={{ fontWeight: 'bold' }}>About this app:</Text>
                    {creatingSpace}
                    <Text style={{padding: 5}}>This application maintains the most-up-to-date data available of the Coronavirus situation. There is also an option to
                    see "city-bikes" available from the Helsinki-API, if one wants to try to avoid public transportation and thus maintain good safety distances.
                </Text>
                    {creatingSpace}
                    <Text style={{padding: 5}}>The app also provides one the capability to see where you currently are on the map; if one accepts the use of one's location data.
                    This way the user can determine where he is, and use that data for example to search for the closest bikes OR stations (bus) available in order to avoid public transportation.
                </Text>
                    {creatingSpace}
                    <Text style={{padding: 5}}>There is also a "favourite" option available with the countries; these favourites are saved to an SQL-database, from which one can see their favourited countries easily.
                    It is easy to manage the favourites by removing and adding them as the user sees fit.
                </Text>
                    {creatingSpace}
                    <Text style={{ fontWeight: 'bold', fontStyle: 'italic', padding: 10 }}>I hope you enjoy this app! Thank you for using Corona Mobile App by Arttu Kesanto!
                </Text>
                    <View style={{ height: 50 }}>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}