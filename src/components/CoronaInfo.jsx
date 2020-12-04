import React,
{ useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Linking
} from 'react-native';
// import { createStackNavigator, Link } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { preventAutoHide } from 'expo/build/launch/SplashScreen';
import { ScrollView } from 'react-native-gesture-handler';

export default function CoronaInfo() {
    //const { data } = route.params;

    const styles = StyleSheet.create({
        main: {
            //flexDirection: 'row',
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            //borderRadius: 12, 
            borderColor: 'black',
            borderStyle: 'solid',
            borderColor: 'black',
            //borderWidth: 2, 
            padding: 5
        },
        input: {
            borderColor: 'gold',
            width: 100,
            height: 50,
            borderWidth: 3,
        },
        tinyLogo: {
            margin: 'auto',
            width: '100%',
            height: 200,
        }
    });

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView>
                <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                    <Image style={styles.tinyLogo} source={{ uri: 'https://www.energiauutiset.fi/media/energiauutiset/markkinat/2020/corona-virus-getty.jpg' }} style={styles.tinyLogo} />
                    <View style={{ height: 20 }}></View>
                </View>
                <Text>
                    <Text style={{ fontWeight: 'bold' }}>Coronavirus disease 2019 (COVID‑19)</Text> is an infectious disease caused by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2).
                    It was first identified in December 2019 in
                    Wuhan, Hubei, China, and
                    has resulted in an ongoing pandemic. As of 30 August 2020, more than 25 million
                    cases have been reported across 188 countries and territories, resulting in more than 843,000 deaths.
                    More than 16.4 million people have recovered.
                    </Text>
                <View style={{ height: 20 }}></View>
                <Text>
                    Common symptoms include fever, cough, fatigue, shortness of breath, and loss of smell and taste. While most people have mild symptoms,
                    some people develop acute respiratory distress
                    syndrome (ARDS) possibly precipitated by cytokine storm, multi-organ failure, septic shock,
                    and blood clots. The time from exposure to onset of symptoms is typically around five days, but may range from two to fourteen days.</Text>
                <View style={{ height: 20 }}></View>
                <Text>
                    The virus is spread primarily via nose and mouth secretions including small droplets produced by coughing,[a] sneezing,
                    and talking. The droplets usually do not travel through air over long distances.
                    However, those standing in close proximity may inhale these droplets and become infected.
                    People may also become infected by touching a contaminated surface and then touching their face.
                    The transmission may also occur through smaller droplets that are able to stay suspended in the air for longer periods of time in enclosed spaces. It is most contagious during the first three days after the onset of symptoms, although spread is possible before symptoms appear, and from people who do not show symptoms.[6][20]
                    The standard method of diagnosis is by real-time reverse transcription polymerase chain reaction (rRT-PCR) from a nasopharyngeal swab. Chest CT imaging may also be helpful for diagnosis
                    in individuals where there is a high
                    suspicion of infection based on symptoms and risk factors; however, guidelines do not recommend using CT imaging for routine screening.
                </Text>
                <View style={{ height: 20 }}></View>
                <Text
                    style={{ color: 'red' }}
                    onPress={() => {
                        Linking.openURL('https://en.wikipedia.org/wiki/COVID-19_pandemic')
                    }}
                >
                    Source: Wikipedia.
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}