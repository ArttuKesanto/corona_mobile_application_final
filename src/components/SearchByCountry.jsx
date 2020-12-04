import React,
{ useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    //Button,
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
import {
    Header,
    Icon,
    Input,
    Button,
    ListItem
} from 'react-native-elements';
import {
    AntDesign,
    MaterialIcons,
    FontAwesome,
    MaterialCommunityIcons
} from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function SearchByCountry({ navigation }) {

    const styles = StyleSheet.create({
        main: {
            //flexDirection: 'row',
            flex: 1,
            backgroundColor: '#fff',
            //alignItems: 'center',
            justifyContent: 'center',
            alignContent: 'center',
        },
        input: {
            borderColor: 'gold',
            width: 160,
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
        areaView: {   
            borderRadius: 5, 
            borderColor: 'black', 
            borderStyle: 'solid', 
            borderColor: 'black', 
            borderWidth: 1, 
            padding: 2,
            margin: 8
        },  
        mainTwo: {
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        },
    });

    const url = 'https://api.covid19api.com/summary';
    const [isReady, setReadyState] = useState(false);
    const [input, setInput] = useState('');
    const [data, setData] = useState([]);
    const [altData, setAltData] = useState([]);


    const fetchGlobalCorInfo = async () => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setData(json);
            setAltData(json.Countries);
            setReadyState(true);
            //alert('LOL');
        } catch (error) {
            setData([]);
            Alert.alert("Could not fetch countries...");
        }
    };
    //useEffect: kun komponentti on latautunut -> Suoritetaan.
    useEffect(() => {
        fetchGlobalCorInfo();
    }, []); // Hakasulkeiden sisään voi laittaa mitä vaan, jotta voidaan muuttujaa käsitellä, jos state-muuttuu. Parametriton.

    if (!isReady) { // Returns the waiting text if the list is not ready.
        return (
            <View style={styles.mainTwo}>
                <ActivityIndicator 
                    size="large" 
                    color="#00ff00" />
                <Text>Loading the list of for Corona Information...</Text>
            </View>
        );
    }

    const spesificCountry = () => { // Creating a loop for going through the available, most-up-to-date list of Country spes. situations.
        console.log(data.Countries.length);
        for (let i = 0; i < altData.length; i++) {
            if (altData[i].Country === input) {
                return (
                    <SafeAreaView 
                    style={styles.areaView}
                    key={altData[i].Country}>
                        <Text style={{ fontSize: 30, marginBottom: 30 }}>List of cases in the country: {altData[i].Country}</Text>
                        <Text style={styles.casesNumbers}> New confirmed cases: {new Intl.NumberFormat().format(altData[i].NewConfirmed)}</Text>
                        <Text style={styles.casesNumbers}> Total number of confirmed cases: {new Intl.NumberFormat().format(altData[i].TotalConfirmed)}</Text>
                        <Text style={styles.casesNumbers}> New deaths: {new Intl.NumberFormat().format(altData[i].NewDeaths)}</Text>
                        <Text style={styles.casesNumbers}> Total amount of deaths: {new Intl.NumberFormat().format(altData[i].TotalDeaths)}</Text>
                        <Text style={styles.casesNumbers}> New amount of recovered individuals: {new Intl.NumberFormat().format(altData[i].NewRecovered)}</Text>
                        <Text style={styles.casesNumbers}> Total amount of recovered individuals: {new Intl.NumberFormat().format(altData[i].TotalRecovered)}</Text>
                    </SafeAreaView>
                )
            }
        }
    }
    //console.log(data.Countries);
    //console.log(data.Countries.length);

    const creatingSpace = () => {
        return (
            <View style={{ height: 30 }}>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.main}>
            <View style={{ alignContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', fontStyle: 'italic', margin: 'auto' }}>The country you searched for:</Text>
                {creatingSpace()}
            </View>
            <View>
                {spesificCountry()}
            </View>
                {creatingSpace()}
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 0.5 }}>
            <Input
                            autoCorrect={true}
                            autoCapitalize="words"
                            placeholder="Input your desired country..."
                            onChangeText={(input) => setInput(input)}
                            leftIcon={
                                <MaterialIcons
                                    name='landscape'
                                    size={17}
                                    color='black'
                                />
                            }
                        />
                <View style={{alignContent: 'center', justifyContent: 'center', alignItems: 'center', marginLeft: 30, marginRight: 30, marginTop: 20, marginBottom: 20}}>
                <Text style={{color: 'green', fontStyle: 'italic'}}>Here you can input a country's name, and if the name is available, details will be provided.

                </Text>

                </View>
                <Button color="#f194ff" 
                        onPress={() => fetchGlobalCorInfo()} 
                        title='UPDATE THE LIST / APP'
                        icon={
                            <MaterialIcons
                                name='clear-all'
                                size={16}
                                color={'black'}
                                style={{ padding: 2 }}
                            />
                        }></Button>
            </View>

        </SafeAreaView>
    )
}