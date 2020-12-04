import React,
{
    useState,
    useEffect,
} from 'react';
import {
    Text,
    View,
    TextInput,
    FlatList,
    Alert,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import {
    Header,
    Icon,
    Input,
    Button,
    ListItem
} from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import MapView,
{ Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

import { creatingSpace } from './CSpace';

import * as Location from 'expo-location';


const styles = StyleSheet.create({
    view: {
        flex: 1
    },
    map: {
        flex: 2,
    },
    footer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    main: {
        //flexDirection: 'row',
        flex: 1,
        backgroundColor: '#e9f7f7',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
    }
})

export default function HSLBusStops() {
    const [isReady, setReadyState] = React.useState(false)
    const [stations, setStations] = React.useState([]);
    const [location, setLocation] = React.useState({ // UseStating to nothing. More reliable this way; providing a button for the user.
        coords: {
            latitude: 0,
            longitude: 0
        }
    });

    const getLocation = async () => { // From EXPO-documentation.
        // Check permissions to location
        let { status } = await Location.requestPermissionsAsync();
        if (status !== "granted") {
            Alert.alert('Need permission access your location data. Please allow this from the settings or from the pop-up screen.');
        } else {
            let locationPrior = await Location.getCurrentPositionAsync({});
            setLocation(locationPrior);
            // TO-DO: set coordinates immediately.
            //setQuery(locationPrior.coords.latitude, locationPrior.coords.longitude);
            setReadyState(false); // Still not ready to render, setting false.
        }
    };

    // DigiTransit documentation. React-Native JS POST documentation reference.
    const setQuery =(lat = location.coords.latitude, 
                        lon = location.coords.longitude) => { // Setting as the default location coords.
        let query =
            `{
        nearest(lat: `+ lat + `, lon: ` + lon + `, maxResults: 10, filterByPlaceTypes: [STOP], maxDistance: 1350) {
          edges {
            node {
                place {
                  lat
                  lon
                  ...on Stop {
                    name
                    gtfsId
                    code
                    routes {
                      id
                      shortName
                    }
                  }
                }
                distance
            }
          }
        }
      }`
        return query;
    }

    console.log(location, setQuery());


    const fetchStations = async () => {
        // POST request using fetch with async/await. Documentation.
        const ownQuery = (setQuery()); // Setting the query.
        const requestParams = { // Using as params for fetch.
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: ownQuery
            })
        };
        const response = await fetch('https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql', requestParams);
        const data = await response.json();
        setStations(data.data.nearest.edges); // Getting edges as to access all the data we need for LEGS.
        setReadyState(true); // Ready to render.
    }

    useEffect(() => {
        getLocation();
        fetchStations();
    },
        []);

    //console.log(busStops)

    if (!isReady) { // Returns the waiting text "Processing..." if the component is not ready to render with required information.
        return (
            <View style={styles.main}>
                <ActivityIndicator
                    size="large"
                    color="#00ff00"
                />
                <Text>Processing...</Text>
            </View>
        );
    }

    return (

        <View style={styles.view}>
            <MapView style={styles.map} region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0322,
                longitudeDelta: 0.0221
            }}>
                <Marker 
                    key={-1}  // Using a Marker key that cannot be duplicated by the stations' GTFSId. User's own location.
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    }}
                    title={"You are here."}
                    description={"Coordinates: " + location.coords.latitude + ', ' + location.coords.longitude} />
                {
                    stations.map((stop) => (
                        <Marker 
                            key={stop.node.place.gtfsId}
                            coordinate={{
                                latitude: stop.node.place.lat,
                                longitude: stop.node.place.lon
                            }}
                            title={stop.node.place.name}
                            description={"Coordinates: " + stop.node.place.lat + ', ' + stop.node.place.lon} />
                    ))
                }
            </MapView>
            { creatingSpace}
            <View style={styles.footer}>

                <Button onPress={fetchStations}
                    title='Fetch your closest stops' 
                    icon={
                        <MaterialIcons
                            name='clear-all'
                            size={16}
                            color={'black'}
                            style={{ padding: 2 }}
                        />
                    }/>

                {creatingSpace}

                <Text style={{
                    color: 'red',
                    fontSize: 20,
                    fontFamily: 'HelveticaNeue-UltraLightItalic'
                }}>Nearby:</Text>

                {creatingSpace}

                <ScrollView style={{ backgroundColor: '' }}>
                    { // Mapping inside a map-function to get all the vehicles' stations to display.
                        stations.map((stop) => (
                            <Text key={stop.node.place.gtfsId}>
                                {'Station: ' +
                                    stop.node.place.code + ' - ' +
                                    stop.node.place.name + ': '}
                                {
                                    stop.node.place.routes.map((route, i) =>
                                        <Text key={i}> {route.shortName}
                                        </Text>)
                                }
                            </Text>

                        ))
                    }
                </ScrollView>

                {creatingSpace}

            </View>

        </View>
    )
}