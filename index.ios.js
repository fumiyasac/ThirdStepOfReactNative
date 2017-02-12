/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

//minutes-seconds-millisecondsパッケージのインポート
import FormatTime from 'minutes-seconds-milliseconds'

//ストップウォッチ用の画面部品を設定する
var StopWatch = React.createClass({

  //Stateの初期化を行う
  /**
   * 定義されているStateは下記の通り
   *
   * timeElapsed: 現在のストップウォッチの時間表示
   * isRunning: 現在のストップウォッチの状態判定フラグ
   * startTime: 開始時間格納用
   * laps: ラップ記録データ格納用配列
   */
  getInitialState: function() {
    return {
      timeElapsed: null,
      isRunning: false,
      startTime: null,
      laps: []
    }
  },

  //見た目のViewを組み立てる
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.timerWrapper}>
            <Text style={styles.timerText}>
              {FormatTime(this.state.timeElapsed)}
            </Text>
          </View>
          <View style={styles.buttonWrapper}>
            {this.startStopButton()}
            {this.lapButton()}
          </View>
        </View>
        <View style={styles.footer}>
          {this.displayLaps()}
        </View>
      </View>
    )
  },

  //ラップデータ表示用のメソッド（Lapボタン押下時にlapsに格納されたデータを表示する）
  displayLaps: function() {

    //lapsに格納されている値を入れた要素を表示する
    return this.state.laps.map(function(time, index){
      return (
        <View key={index} style={styles.lapView}>
          <Text style={styles.lapText}>Lap #{index + 1}</Text>
          <Text style={styles.lapText}>{FormatTime(time)}</Text>
        </View>
      )
    });
  },

  //スタートボタンを押下した際のメソッド
  //（変数:isRunningの状態によってボタンの振る舞いが変わる）
  //（クリックをするとメソッド:handleStartPressが発火する）
  startStopButton: function() {

    //状態によってスタイルが変化するように設定する
    var setStyle = this.state.isRunning ? styles.stopButtonStyle : styles.startButtonStyle;

    //ボタン要素を返却して要素を表示する
    return (
      <TouchableHighlight underlayColor="gray" onPress={this.handleStartPress} style={[styles.buttonAbstractStyle, setStyle]}>
        <Text>{this.state.isRunning ? "Stop" : "Start"}</Text>
      </TouchableHighlight>
    )
  },

  //ラップ記録ボタンを押下した際のメソッド
  //（クリックをするとメソッド:handleLapPressが発火する）
  lapButton: function() {

    //ボタン要素を返却して要素を表示する
    return (
      <TouchableHighlight underlayColor="gray" onPress={this.handleLapPress} style={styles.buttonAbstractStyle}>
        <Text>Lap</Text>
      </TouchableHighlight>
    )
  },

  //スタートボタンを押下した際に実行されるメソッド
  handleStartPress: function() {

    //タイマーが実行中の際はタイマーをクリアする（isRunningはfalseにする）
    if (this.state.isRunning) {
      clearInterval(this.interval);
      this.setState({
        isRunning: false
      });
      return;
    }

    //タイマーが実行されていない場合は開始時間をstateへ記録しておく
    this.setState({
      startTime: new Date()
    });

    //0.03秒ごとに、timeElapsed:が更新されてストップウォッチ表示の時間が更新される
    /**
     * setIntervalメソッド内の記載はアロー関数で行っている
     *
     *（参考）ECMAScript6のアロー関数とPromiseまとめ - JavaScript
     * http://qiita.com/takeharu/items/c23998d22903e6d3c1d9
     *（参考）MDNのアロー関数の解説
     * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/arrow_functions
     */
    this.interval = setInterval( () => {

      //timeElapsedに現在時刻と開始時間の差分を記録してisRunningの値をtrueの状態にしておく
      this.setState({
        timeElapsed: new Date() - this.state.startTime,
        isRunning: true
      });
    }, 30);
  },

  //ラップ記録ボタンを押下した際に実行されるメソッド
  handleLapPress: function() {

    //現在の時間をlaps内に記録する（concatメソッドで配列を連結する）
    //（参考）https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
    var lap = this.state.timeElapsed;
    this.setState({
      startTime: new Date(),
      laps: this.state.laps.concat([lap])
    });
  }
});

//画面のスタイルを適用する
//（参考）A Complete Guide to Flexbox
// https://gibbon.co/c/fcad97d6-c1d0-49a1-a137-2d366fc079f8/a-complete-guide-to-flexbox-csstricks
var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  header: {
    flex: 1
  },
  footer: {
    flex: 1
  },
  timerWrapper: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  timerText: {
    fontSize: 60
  },
  buttonAbstractStyle: {
    borderWidth: 2,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  startButtonStyle: {
    borderColor: "#00CC00"
  },
  stopButtonStyle: {
    borderColor: "#CC0000"
  },
  lapView: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  lapText: {
    fontSize: 30
  }
});

AppRegistry.registerComponent('StopwatchOfReactNative', () => StopWatch);
