import  Constants  from 'expo-constants';  
import { Platform, StatusBar, StyleSheet, Text, View, Animated } from 'react-native';  
import NetInfo from "@react-native-community/netinfo";
import { useRef } from 'react';

import React from 'react';  


export default class Status extends React.Component{  
    state = {  
        isConnected: true,
        fadeAnim: new Animated.Value(0),
    };

    componentDidMount() {
        NetInfo.fetch().then((state) => {
          this.setState({ isConnected: state.isConnected,
                          type: state.type});
        });
            // Subscribe to network status changes
    this.unsubscribe = NetInfo.addEventListener((state) => {
        this.setState(
          {
            isConnected: state.isConnected,
            type: state.type,
          },
          () => {
            // Add the animation to fade in or fade out the bubble
            Animated.timing(this.state.fadeAnim, {
              toValue: 1,
              duration: 2500,
              useNativeDriver: true
            }).start(() => {
              if (!this.state.isConnected) {
                // If not connected, start a fade-out animation
                Animated.timing(this.state.fadeAnim, {
                  toValue: 0,
                  duration: 2500,
                  useNativeDriver: true
                }).start();
              }
            });
          }
        );
      });
    }
    componentWillUnmount() {
        // Unsubscribe from network status changes to prevent memory leaks
        if (this.unsubscribe) {
          this.unsubscribe();
        }
    }
    render() {  
        //const {info} = this.state;
        const { isConnected, type, fadeAnim } = this.state;      
        const backgroundColor = isConnected ? 'green' : 'red';
        const statusBar = ( 
            <StatusBar 
                backgroundColor={backgroundColor} 
                barStyle={isConnected ? 'dark-content' : 'light-content'} 
                animated={true} 
                /> 
            );
            const messageContainer = (
                <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
                    {statusBar}
                    <View style={styles.myName}>
                        <Text style={styles.text}> Lobotomy Kaisen </Text>
                    </View>
                    {isConnected && type ? (
                        <View style={styles.networkUpBubble}>
                            <Text style={styles.text}>Type: {type} </Text>
                            <Text style={styles.text}>There is a {type} network connection</Text>
                        </View>
                    ) : (
                        <View style={styles.networkDownbubble}>
                            <Text style={styles.text}>Type: {type} </Text>
                            <Text style={styles.text}>No {type} network connection</Text>
                        </View>
                    )}
                </Animated.View>
            );
        if(Platform.OS === "ios"){
            return (
            <View style={[styles.status, {backgroundColor}]}>
                {messageContainer}
            </View>
            );
        }
        return messageContainer;
    }
}
const statusHeight = (Platform.OS === "ios" ? Constants.statusBarHeight : 0)

const styles = StyleSheet.create({  
    status: {  
        zIndex: 1,
        height: statusHeight
    },
    messageContainer: {
        zIndex: 1, 
        position: 'absolute',
        top: statusHeight + 20,
        left: 0,
        right: 0,
        height: 80,
        alignItems: 'center',
    },
    networkDownbubble: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'red',
    },
    networkUpBubble: {
        //position: 'absolute',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'green',
        elevation: 10
    },
    text: {
        color: 'white',
        textAlign: 'center'
    },
    myName: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'black',
        marginBottom: 20
    },
  })