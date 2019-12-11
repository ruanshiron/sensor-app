import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, Picker } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { LineChart } from 'react-native-chart-kit'
import { Button, ButtonGroup } from 'react-native-elements';
import DateTimePicker from "react-native-modal-datetime-picker";
import { func } from 'prop-types';

import moment from 'moment-timezone'

export default function LinksScreen() {
  const [state, setState] = useState({
    sensors: [
      {
        id: 1,
        arduino_id: 1,
        name: "GP2Y10",
        unit: "10^-2mg/m3"
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
      sensor: {
        id: 3,
        arduino_id: 1,
        name: "DHT11_H",
        unit: '%',
      },

      request: {
        arduinoId: 1,
        sensorId: 1,
        pageable: false,
        page: 0,
        pageSize: 1
      },
      data: [
        0
      ],

      labels: [
      ]
    },
  })

  const [start, setStart] = useState({
    date: moment(Date.now()).tz('Asia/Ho_Chi_Minh').format("YYYY-MM-DD hh:mm:ss"),
    label: 'date',
    show: false,
  })

  const [end, setEnd] = useState({
    date: moment(Date.now()).tz('Asia/Ho_Chi_Minh').format("YYYY-MM-DD hh:mm:ss"),
    label: 'date',
    show: false,
  })

  async function handleOnPress() {
    let response = await
      fetch('http://springbootiot1-env-1.rzpga2pgvr.us-east-1.elasticbeanstalk.com/arduino/search', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...state.cur.request,
          fromTime: start.date,
          toTime: end.date
        }),
      })

    const res = await response.json()
    const data = await res.map((u, i) => {
      u = u.value
      return u
    })
    setState({
      ...state,
      cur: {
        ...state.cur,
        data: data
      }
    })

  }


  function handleStartTime(e) {
    setStart({ show: true });
  }

  function handleStartPicked(date) {
    let ndate = moment(date).tz('Asia/Ho_Chi_Minh').format('x')
    setStart({
      date: ndate,
      label: moment(date).format("YYYY-MM-DD hh:mm:ss"),
    })
    console.log("A date has been picked: ", ndate);
  }

  function hideStartPicked() {
    setStart({ show: false })
    console.log(start.date);

  }

  function handleEndTime() {
    setEnd({ show: true });
  }

  function handleEndPicked(date) {
    let ndate = moment(date).tz('Asia/Ho_Chi_Minh').format('x')
    setEnd({
      date: ndate,
      label: moment(date).format("YYYY-MM-DD hh:mm:ss"),
    })
    console.log("A date has been picked: ", ndate);
  }

  function hideEndPicked() {
    setEnd({ show: false })
  }

  return (

    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={{ marginLeft: 16, marginRight: 16 }}>
          <Picker
            selectedValue={state.cur.sensor}
            style={{ marginLeft: 80, marginRight: 80 }}
            onValueChange={(itemValue, itemIndex) =>
              setState({
                ...state,
                cur: {
                  ...state.cur,
                  sensor: itemValue
                }
              })
            }
          >
            {
              state.sensors.map((u, i) => (
                <Picker.Item key={i} label={u.name} value={u} />
              ))
            }
          </Picker>
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
            yAxisSuffix={state.cur.sensor.unit}
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


          <View>
            <Button
              buttonStyle={{ margin: 8 }}
              title={"FROM | " + start.label}
              type="outline"
              onPress={handleStartTime}
            />
            <DateTimePicker
              mode='datetime'
              isVisible={start.show}
              onConfirm={handleStartPicked}
              onCancel={hideStartPicked}
            />
          </View>

          <View>
            <Button
              buttonStyle={{ margin: 8 }}
              title={"  TO | " + end.label}
              type="outline"
              onPress={handleEndTime}
            />
            <DateTimePicker
              mode='datetime'
              isVisible={end.show}
              onConfirm={handleEndPicked}
              onCancel={hideEndPicked}
            />
          </View>

          <Button
            buttonStyle={{ margin: 8 }}
            title="OK"
            type="outline"
            onPress={handleOnPress}
          />
        </View>

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
