import React, {
    useState,
    useEffect
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    TextInput,
    FlatList,
    TouchableOpacity,
    Alert,
    Picker,
    ActivityIndicator
} from 'react-native';
// import Picker from 'react-native-community/picker'; // New import location for Picker.
import { ScrollView } from 'react-native-gesture-handler';


const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    input: { // Possible, for reference.
        borderColor: 'gold',
        width: 100,
        height: 50,
        borderWidth: 3,
        justifyContent: 'center',
        alignContent: 'center',
    },
    tinyLogo: { // For images, default setting. For reference.
        width: 100,
        height: 100,
    }
});


export default function FetchCitiesWithBikes({ navigation }) { // Nav Prop given.

    const [isReady, setReadyState] = React.useState(false); // For rendering.
    const [cityCoordinates, setCityCoordinates] = useState({ // Init as empty.
        lat: '',
        lng: '',
    });
    const [cities, setCities] = React.useState([]); // Init empty Array.
    const [locCity, setCitycode] = React.useState('citybikes-helsinki'); // Helsinki as the first one, must be this exact String when comparing to API.
    const [stations, setStations] = React.useState([]); // Init empty awwat for mapping.


    const getCities = () => {
        const url = 'http://api.citybik.es/v2/networks/'; // Referencing API documentation.
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCities(data.networks);
                setReadyState(true);
            })
            .catch((error) => {
                Alert.alert("Something went wrong", 'Could not fetch the specified information... Error: ' + error);
                console.log(error)
            });
    }

    useEffect(() => { // Gets completed / run immediately when choosing the component.
        getCities()
    },
        [])

    const getStations = () => { // Getting stations for a certain area.
        const url = 'http://api.citybik.es/v2/networks/' + locCity;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setStations(data.network.stations);
                setCityCoordinates({
                    lat: data.network.location.latitude,
                    lng: data.network.location.longitude,
                });
                setReadyState(true);
            })
            .catch((error) => {
                Alert.alert("Error...", 'Could not fetch the specified information...' + error);
            });
    }

    // Renders the specified function when the component is activated. Always updates the information with new Picker value.
    useEffect(() => {
        getStations()
    },
        [locCity]);


    let pickerCities = cities.map((location) => // No return, no {} needed.
        (
            <Picker.Item
                key={location.id} // React n. needs keys for identification.
                label={location.location.city + ' - ' + location.location.country + ' - ' + location.id}
                value={location.id} />)
    );

    let cityInformation = stations.map((item) => // Rendering all the stations associated with entry.
        (
            <Text
                key={item.id} // Keys for remembering renders.
                style={styles.item}>{item.name}
            </Text>)
    );

    //console.log(pickerPopulated()); Debugging.


    if (!isReady) {
        return (
            <View style={styles.main}>
                <ActivityIndicator
                    size="large"
                    color="#00ff00" />
                <Text>Searching for the addresses or populating Picker...</Text>
            </View>
        )
    }


    return (
        <View>
            <View style={{ alignItems: 'center' }}>
                <Picker
                    itemStyle={{
                        backgroundColor: '#d1dcf0', // This property (PROPS) handles the item styling...
                        borderRadius: 20,
                        borderWidth: 2,
                        width: 400,
                        height: 300
                    }}
                    style={{ height: 200 }}
                    selectedValue={locCity}
                    onValueChange={(itemValue, _) => // Index not needed, thus "_".
                        setCitycode(itemValue)}>

                    {
                        pickerCities
                    }

                </Picker>
            </View>
            <View style={{ marginTop: 120 }}>
                <Button
                    title={"Map the selected area: " + locCity}
                    onPress={() => navigation.navigate('Bikes on the Map', { // Propsing all the following items...
                        loc: locCity,
                        latitude: cityCoordinates.lat,
                        longitude: cityCoordinates.lng
                    })} />
            </View>

            <View style={{ alignItems: 'center' }}>
                <Text>Below you can see all the places associated with this entry:</Text>
            </View>

            <ScrollView>

                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    marginBottom: 360
                }}>
                    {
                        cityInformation
                    }
                </View>

            </ScrollView>

        </View>

    );
}
