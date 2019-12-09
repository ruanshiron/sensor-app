import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { LineChart } from 'react-native-chart-kit'
import { Button } from 'react-native-elements';

export default function LinksScreen() {
  const [state, setState] = useState({
    sensors: [
      {
        id: 1,
        arduino_id: 1,
        name: "GP2Y10",
        unit: "mg/m3"
      },
      {
        id: 2,
        arduino_id: 1,
        name: "DHT11_T",
        unit: '°C'
      },
      {
        id: 3,
        arduino_id: 1,
        name: "DHT11_H",
        unit: '%',
      },
    ],
    cur: {
      id: 3,
      arduino_id: 1,
      name: "DHT11_H",
      unit: '%',
      request: {
        arduinoId:1,
        sensorId:1,
        fromTime: 1574960400000,
        toTime: 1575388878367,
        pageable: false,
        page: 0,
        pageSize: 1
      },
      data: [
        1,
        2

      ],

      labels: [

      ]
    },
  })

  function handleOnPress() {
    fetch('http://springbootiot1-env-1.rzpga2pgvr.us-east-1.elasticbeanstalk.com/arduino/search', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state.cur.request),
    })
    .then(response=> response.json())
    .then(res => {
      console.log(res);
      
    })

  }

  return (

    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={{ marginLeft: 16, marginRight: 16 }}>
          <Text>{state.cur.name}</Text>
          <LineChart
            data={{
              labels: state.cur.labels,
              datasets: [
                {
                  data: state.cur.data
                }
              ]
            }}
            width={Dimensions.get("window").width - 32} // from react-native
            height={220}
            yAxisSuffix={state.cur.unit}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>

        <Button
          style={{ padding: 16 }}
          title="Outline button"
          type="outline"
          onPress={handleOnPress}
        />


      </ScrollView>
    </View>
  );
}

LinksScreen.navigationOptions = {
  title: 'Biểu đồ',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 8
  },
});
