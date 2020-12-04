import React,
{ useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
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
import { SafeAreaView } from 'react-native-safe-area-context';

import * as SQLite from 'expo-sqlite';


export default function CoronaInfoGlobal({ navigation }) {

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
        mainTwo: {
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        },
        main2: {
            flex: 3,
            backgroundColor: '#fff',
            justifyContent: 'center',
        }
    });

    const url = 'https://api.covid19api.com/summary';
    const [isReady, setReadyState] = useState(false);
    const [input, setInput] = useState('');
    const [data, setData] = useState([]); // For countries.
    const [altData, setAltData] = useState([]); // For information to be propsed.

    const db = SQLite.openDatabase('favouriteList.db');
    const [countryList, setCountryList] = React.useState([]); // For testing and reference; functionality deployed in favourites.


    const fetchGlobalCorInfo = async () => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setData(json);
            setAltData(json.Countries);
            setReadyState(true); // Ready to render.
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

    const spesificCountry = () => { // Creating a loop for going through the available, most-up-to-date list of Country spes. situations.
        console.log(data.Countries.length);
        for (let i = 0; i < altData.length; i++) {
            if (altData[i].Country === input) {
                return (
                    <SafeAreaView key={altData[i].Country}>
                        <Text>List of cases in the country: {altData[i].Country}</Text>
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

    useEffect(() => { // Creates the table if it does not exist. SQLite EXPO documentation reference.
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists countryList(id integer primary key not null, country text);');
        },
            null, updateList);
    }, []);

    const saveItemToList = (country) => { // Saves items to the SQL list by specified parameters.
        db.transaction(tx => {
            tx.executeSql('insert into countryList(country) values (?);',
                [country]);
        },
            null,
            updateList,
        )
        Alert.alert("Success","Saved to favourites!")
        //setItem('');
        //setAmount('');
    }

    const updateList = () => { // Updates the list by getting all the rows from the database. Placeholder here for testing.
        db.transaction(tx => {
            tx.executeSql('select * from countryList;', [], (_, { rows }) => setCountryList(rows._array));
        });
    }

    const deleteItem = (id) => { // Deletes item by its ID. Used in the Favourites component. No deletion needed here, complicates matters.
        db.transaction(tx => {
            tx.executeSql(`delete from countryList where id = ?;`, [id]);
        }, null, updateList)
    }

    const clearTheList = () => { // To clear the whole favourites list.
        db.transaction(tx => {
            tx.executeSql("delete from countryList;") // Deletes all items from the database, all rows.
        }, null, updateList)
    };

    // Possible to imply with "_" that the first parameter is not needed / not used / something is private as in do not touch this, only inside the Class etc.
    const keyExtractor = (_, index) => index.toString(); // "_" implies that the first param is not needed. Redundant.

    // Using this to render the actual country-names. Giving this "variable" to renderItem props.
    const renderItem = ({ item }) => {
        return (
            <ListItem
                //key={item.Country}
                //keyExtractor={keyExtractor}
                bottomDivider
                onLongPress={() => saveItemToList(item.Country)}
                onPress={() => navigation.navigate('Spesific Country', { data: altData, input: item.Country })}>
                <ListItem.Content>
                    <ListItem.Title style={{color: 'green'}}>{item.Country}
                    </ListItem.Title>
                    <View style={{ marginLeft: 'auto' }}>
                        <Text style={{ fontStyle: 'italic' }}>Press to show details</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <Text style={{ fontStyle: 'italic' }}>Long press to add to favourites</Text>
                    </View>
                    <ListItem.Subtitle style={{ fontSize: 17, fontStyle: 'italic' }}>{"Country"}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        )
    }

    // Artificial way to create some space between renders.
    const creatingSpace = () => {
        return (
            <View style={{ height: 20 }}>
            </View>
        )
    }

    // Returns the waiting text if the list is not ready.
    if (!isReady) {
        return (
            <View style={styles.mainTwo}>
                <ActivityIndicator
                    size="large"
                    color="#00ff00" />
                <Text>Loading the list of for Corona Information...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.main}>
            <View style={{ alignContent: 'center', alignItems: 'center' }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    margin: 'auto'
                }}>List of countries</Text>
                {creatingSpace()}
            </View>
            {spesificCountry()}
            <FlatList
                keyExtractor={keyExtractor}
                initialNumToRender={10} // Renders the first batch.
                onEndReachedThreshold={0.5} // When half of the items are left to scroll that are currently on screen, fetch more.
                maxToRenderPerBatch={15} // All the subsequent batches will render multiple items, 15. Scrolling more comfortable with a higher number.
                style={{ flex: 1 }}
                data={data.Countries}
                renderItem={renderItem}
                //onRefresh={() => updateList()}
                //refreshing={true}
            />

        </SafeAreaView>
    )
}

/* renderItem={({ item }) =>
        <Button title={item.Country}
            onPress={() => navigation.navigate('Spesific Country', { data: altData, input: item.Country })}>
        </Button>} */