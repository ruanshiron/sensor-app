import * as WebBrowser from 'expo-web-browser';
import React, { useState, useEffect } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Card,
  Button,
  Icon
} from 'react-native-elements'

import moment from 'moment'

import { MonoText } from '../components/StyledText';

export default function HomeScreen(props) {
  const [sensorState, setSensorState] = useState({
    sensors: [
      {
        id: 1,
        arduino_id: 1,
        name: "GP2Y10",
        value: 0,
        unit: '10^-2mg/m3',
        time: 1575910564365,
      },
      {
        id: 2,
        arduino_id: 1,
        name: "DHT11_T",
        value: 0,
        unit: '°C',
        time: 1575910564365
      },
      {
        id: 3,
        arduino_id: 1,
        name: "DHT11_H",
        value: 0,
        unit: '%',
        time: 1575910564365
      },
    ]
  })
  

  useEffect(() => {
    sensorState.sensors.map((u, i) => {
      handleCardPress(null, u)
    })
    
  }, []);
  
  function handleCardPress(e, u) {
    fetch(`http://springbootiot1-env-1.rzpga2pgvr.us-east-1.elasticbeanstalk.com/arduino/live?amount=1&arduinoId=${u.arduino_id}&sensorId=${u.id}`)
      .then((response) => response.json())
      .then((responseJson) => {
        let newVal = responseJson[0]
        


        let newState = sensorState.sensors.map((u, i) => {
          if ((u.id == newVal.sensorInfo.id) && (u.arduino_id == newVal.arduinoInfo.id)) {
            u.value = newVal.value
            u.time = newVal.createtime
            return u
          }
          return u
        })
        

        setSensorState({sensors: newState})
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}>
        {
          sensorState.sensors.map((u, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={(e) => handleCardPress(e, u)}
              >

                <Card
                  title={u.name}
                >
                  <View style={{ alignItems: 'baseline', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <View style={{ alignItems: 'baseline', justifyContent: 'flex-end', flexDirection: 'row', flexWrap: 'wrap' }}>
                      <Text style={{ fontSize: 12, fontWeight: '100' }}>
                        {moment(u.time).format("YYYY-MM-DD hh:mm:ss")}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'flex-end', flexDirection: 'row', flexWrap: 'wrap' }}>
                      <Text style={{ fontSize: 40, fontWeight: 'bold' }}>
                        {u.value.toFixed(1)}
                      </Text>
                      <Text style={{ fontSize: 18 }}>
                        {" "+ u.unit}
                      </Text>
                    </View>
                  </View>


                </Card>

              </TouchableOpacity>
            )
          })
        }
        
      </ScrollView>

    </View>
  );
}

HomeScreen.navigationOptions = {
  title: "Các cảm biến",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 8
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
