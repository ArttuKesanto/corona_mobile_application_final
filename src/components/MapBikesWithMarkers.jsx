import React,
{
    useState,
    useEffect
} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    ActivityIndicator
} from 'react-native';
import MapView,
{ Marker } from 'react-native-maps';


export default function BikesMapped({ route }) { // Giving the route as props here instantly to this component.

    // Parameters from another component, routing all with the same line.
    const { loc, latitude, longitude } = route.params;

    const [stations, setStations] = React.useState([]); // Empty array.
    const [mapzone, setMapZone] = React.useState({ // Setting initial coords to the ones received from PROPS.
        lat: latitude,
        lon: longitude,
    });
    const [isReady, setReadyState] = React.useState(false) // For rendering items. Initializing as false in order to stop unfinished rendering.

    const styles = StyleSheet.create({ // For styles.
        mapMain: {
            flex: 1,
        },
        main: {
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
        }
    })

    // Fetch locations with three given parameters; works best this way with useEffect(). Promise .then() method used, could do it with async / await method.
    const fetchLocations = async (name, lat, lng) => {
        const url = 'http://api.citybik.es/v2/networks/' + name;
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setStations(data.network.stations);
                setMapZone({
                    lat: lat,
                    lon: lng,
                });
                setReadyState(true); // Ready to render after this pass.
            })
            .catch((error) => {
                Alert.alert("Something went wrong...", 'Could not fetch the desired data... Error: ' + error);
            });
    }

    useEffect(() => {
        fetchLocations(
            loc,
            latitude,
            longitude)
    },
        [loc]); // Renders with the new information anytime loc changes. Important for the MAP TO UPDATE.

    const keyExtractor = (_, index) => index.toString(); // "_" not needed, just the index. Not in use, currently.
    console.log(loc + ', at: ' + latitude + ', ' + longitude, isReady); // Debugging.


    if (!isReady) { // Checking if the information and data is ready.
        return (
            <View style={styles.main}>
                <ActivityIndicator
                    size="large"
                    color="#00ff00" />
                <Text>Searching for the addresses or populating markers...</Text>
            </View>
        )
    }

    return (
        <MapView style={styles.mapMain}
            region={{
                latitude: mapzone.lat,
                longitude: mapzone.lon,
                latitudeDelta: 0.0310,
                longitudeDelta: 0.0215,
            }}>
            {
                stations.map((station) => ( // Mapping the stations and getting each item out of the OBJECT. No RETURN so no need for {}. JSX so in {}.
                    <Marker
                        //keyExtractor={keyExtractor}
                        key={station.extra.uid} // Useful here, no duplicates. IF station.extra.uid is undefined, React Native gets warnings, still works... keyExtractor not working here - keep in mind.
                        coordinate={{ latitude: station.latitude, longitude: station.longitude }}
                        title={'Station: ' + station.name + ' - ' + station.extra.uid}
                        description={'Slots empty (for placing): ' + station.empty_slots + ' - ' + 'Free bicycles (available): ' + station.free_bikes} />
                ))
            }
        </MapView>
    )
}