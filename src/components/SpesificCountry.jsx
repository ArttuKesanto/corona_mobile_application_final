import React,
{ useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    FlatList
} from 'react-native';
import {
    NavigationContainer,
    StackActions
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SpesificCountry({ route, navigation: { goBack } }) {
    const { data, input } = route.params;

    const styles = StyleSheet.create({
        main: {
            //flexDirection: 'row',
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        input: {
            borderColor: 'gold',
            width: 100,
            height: 50,
            borderWidth: 3,
        }
    });

    const spesificCountryInfo = () => { // Creating a loop for going through the available, most-up-to-date list of Country spes. situations.
        for (let i = 0; i < data.length; i++) {
            if (data[i].Country === input) {
                return (
                    <SafeAreaView style={{ borderRadius: 12, borderColor: 'black', borderStyle: 'solid', borderColor: 'black', borderWidth: '2px', padding: 10 }}>
                        <Text style={{ fontSize: 30, marginBottom: 30 }}>List of cases in the country: {data[i].Country}</Text>
                        <Text style={styles.casesNumbers}> New confirmed cases: {new Intl.NumberFormat().format(data[i].NewConfirmed)}</Text>
                        <Text style={styles.casesNumbers}> Total number of confirmed cases: {new Intl.NumberFormat().format(data[i].TotalConfirmed)}</Text>
                        <Text style={styles.casesNumbers}> New deaths: {new Intl.NumberFormat().format(data[i].NewDeaths)}</Text>
                        <Text style={styles.casesNumbers}> Total amount of deaths: {new Intl.NumberFormat().format(data[i].TotalDeaths)}</Text>
                        <Text style={styles.casesNumbers}> New amount of recovered individuals: {new Intl.NumberFormat().format(data[i].NewRecovered)}</Text>
                        <Text style={styles.casesNumbers}> Total amount of recovered individuals: {new Intl.NumberFormat().format(data[i].TotalRecovered)}</Text>
                    </SafeAreaView>
                )
            }
        }
    }

    return (
        <SafeAreaView style={styles.main}>
            {/*<Text style = {{}}>Spesific details related to the country: </Text>*/}
            <View>
                {spesificCountryInfo()}
            </View>
        </SafeAreaView>
    )
}