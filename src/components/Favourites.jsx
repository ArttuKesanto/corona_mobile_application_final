import React,
{
    useState,
    useEffect
} from 'react';
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
import {
    AntDesign,
    FontAwesome,
    MaterialIcons
} from '@expo/vector-icons';

import * as SQLite from 'expo-sqlite';


export default function FavouriteCountries({ navigation }) {

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
    const [countryList, setCountryList] = React.useState([]); // Functionality deployed here.


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

    //useEffect: when the component has loaded, execute.
    useEffect(() => {
        fetchGlobalCorInfo();
    }, []); // Hakasulkeiden sisään voi laittaa mitä vaan, jotta voidaan muuttujaa käsitellä, jos state-muuttuu. Parametriton.
    // Can put basically anything inside the []; this list of params defines when re-renders happen, when STATE changes.

    // Left here for reference; console-debugging at its finest as of now... Checking if infinite re-renders happen. Currently OK.
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

    const saveItemToList = (country) => { // Saves items to the SQL list by specified parameters. Left for reference with all the methods.
        db.transaction(tx => {            // Easier to implement if testing needed. NOT IN USE in this component.
            tx.executeSql('insert into countryList(country) values (?);',
                [country]);
        },
            null,
            updateList,
        )
        //setItem('');
        //setAmount('');
    }

    const updateList = () => { // Updates the list by getting all the rows from the database. Placeholder here for testing.
        db.transaction(tx => {
            tx.executeSql('select * from countryList;', [], (_, { rows }) => setCountryList(rows._array));
        });
    }

    const deleteItem = (id) => { // Deletes item by its ID. Used in the Favourites component.
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
    const keyExtractor = (item, index) => item.id.toString(); // Using the item as props, and its id since SQL-table saves automatic ID-Integers.

    const renderItem = ({ item }) => { // Using this to render the actual country-names. Giving this "variable" / function to renderItem props.
        return (
            <ListItem
                bottomDivider
                onLongPress={() => deleteItem(item.id)}
                onPress={() => navigation.navigate('Spesific Country', { data: altData, input: item.country })}>
                <ListItem.Content>
                    <ListItem.Title style={{ color: 'green' }}>{item.country}
                    </ListItem.Title>
                    <View style={{ marginLeft: 'auto' }}>
                        <Text style={{ fontStyle: 'italic' }}>Press to show details</Text>
                    </View>
                    <View style={{ marginLeft: 'auto' }}>
                        <Text style={{ fontStyle: 'italic' }}>Press long to delete from favourites</Text>
                    </View>
                    <ListItem.Subtitle style={{ fontSize: 17, fontStyle: 'italic' }}>{"Country"}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>)
    }

    const creatingSpace = () => { // Artificial way to create some space between renders.
        return (
            <View style={{ height: 20 }}>
            </View>
        )
    }


    if (!isReady) { // Returns the waiting text if the list is not ready.
        return (
            <View style={styles.mainTwo}>
                <ActivityIndicator
                    size="large"
                    color="#00ff00" />
                <Text>Loading the list for favourited Corona Information...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.main}>
            <Button
                icon={
                    <MaterialIcons // Using MaterialIcons.
                        name="update"
                        size={15}
                        color="black"
                    />
                }
                type={'clear'}
                title='Update the list'
                onPress={() => updateList()}
            />
            {creatingSpace()}
            <Button
                icon={
                    <MaterialIcons // Using the library for these Icons.
                        name="clear-all"
                        size={15}
                        color="black"
                    />
                }
                type={'clear'}
                title='Clear all the favourites'
                onPress={() => clearTheList()}
            />
            {creatingSpace()}
            <View style={{ alignContent: 'center', alignItems: 'center' }}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    margin: 'auto'
                }}>List of countries</Text>
                {creatingSpace()}
            </View>
            <View>{spesificCountry()}</View>
            <FlatList
                keyExtractor={keyExtractor}
                //onRefresh={() => updateList()}
                //refreshing={true}
                style={{ flex: 1 }}
                data={countryList}
                renderItem={renderItem} // Giving the property renderItem the renderItem function that I have defined. Receives item props.
            />

        </SafeAreaView>
    )
}

/*

Method 1:
renderItem={({ item }) =>
                <View>
        <Button title={item.country}
                    onPress={() => navigation.navigate('Spesific Country', { data: altData, input: item.country })}>
        </Button>
        <Button title={"DELETE"}
                    onPress={() => clearTheList()}>
        </Button>
        </View>
        }
            />

Method 2:

renderItem={({ item }) =>
        <Button title={item.Country}
            onPress={() => navigation.navigate('Spesific Country', { data: altData, input: item.Country })}>
        </Button>} */