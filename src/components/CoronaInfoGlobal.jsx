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
    ActivityIndicator
} from 'react-native';
import {
    NavigationContainer,
    StackActions
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CoronaInfoGlobal() {

    const styles = StyleSheet.create({
        main: {
            //flexDirection: 'row',
            flex: 1,
            backgroundColor: '#e9f7f7',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
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
            width: '100%',
            height: '100%',
            flex: 0.5,
           // backgroundColor: '#e9f7f7'
        },
        casesNumbers: {
            marginBottom: 10,
            fontWeight: 'bold'
        }
    });

    const url = 'https://api.covid19api.com/summary';
    const [isReady, setReadyState] = useState(false);
    const [input, setInput] = useState('');
    const [data, setData] = useState({});


    const fetchGlobalCorInfo = async () => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setData(json.Global);
            setReadyState(true);
            //alert('LOL');
        } catch (error) {
            setData([]);
            Alert.alert("Could not fetch the desired data...");
        }
    };
    //useEffect: kun komponentti on latautunut -> Suoritetaan.
    useEffect(() => {
        fetchGlobalCorInfo();
    }, []); // Hakasulkeiden sisään voi laittaa mitä vaan, jotta voidaan muuttujaa käsitellä, jos state-muuttuu. Parametriton.

    //console.log(data);
    //console.log(mockUpData);

    if (!isReady) { // Returns the waiting text if the list is not ready.
        return (
            <View style={styles.main}>
                <ActivityIndicator 
                        size="large" 
                        color="#00ff00" 
                />
                <Text>Loading the list of for Corona Information...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.main}>
            <Image source={{ uri: 'https://media.npr.org/assets/img/2020/06/22/seamus-coronavirus-d3-world-map-20200323_wide-c41a019cccab1fb769877f4cac65341682acab39.png' }} style={styles.tinyLogo} />
            <Text style={{ fontSize: 30, marginBottom: 20 }}>The Current Global Situation</Text>
            <Text style={{ fontSize: 20, marginBottom: 20, fontStyle: 'italic' }}>(Updated daily)</Text>
            <Text style={styles.casesNumbers}> New confirmed cases: {new Intl.NumberFormat().format(data.NewConfirmed)}</Text>
            <Text style={styles.casesNumbers}> Total number of confirmed cases: {new Intl.NumberFormat().format(data.TotalConfirmed)}</Text>
            <Text style={styles.casesNumbers}> New deaths: {new Intl.NumberFormat().format(data.NewDeaths)}</Text>
            <Text style={styles.casesNumbers}> Total amount of deaths: {new Intl.NumberFormat().format(data.TotalDeaths)}</Text>
            <Text style={styles.casesNumbers}> New amount of recovered individuals: {new Intl.NumberFormat().format(data.NewRecovered)}</Text>
            <Text style={styles.casesNumbers}> Total amount of recovered individuals: {new Intl.NumberFormat().format(data.TotalRecovered)}</Text>
        </SafeAreaView >
    )
}