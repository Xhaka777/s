import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Svg, {
    Defs,
    RadialGradient as SVGRadialGradient,
    Stop,
    Rect,
    Circle
} from 'react-native-svg';

const RadialGradientContent = ({ imageSource, imageStyle }) => {
    return (
      <View style={styles.container}>
      <Svg height="80" width="80" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <SVGRadialGradient id="grad" cx="50%" cy="50%" r="50%">
            <Stop offset="20%" stopColor="#000000" stopOpacity="0.2" />
            <Stop offset="50%" stopColor="#000000" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#821E4B" stopOpacity="0.71" />
          </SVGRadialGradient>
        </Defs>
        <Circle cx="40" cy="40" r="40" fill="url(#grad)" />
      </Svg>
      
      <View style={styles.imageContainer}>
        <Image 
          source={imageSource} 
          style={[styles.defaultImageStyle, imageStyle]}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  defaultImageStyle: {
    width: '100%',
    height: '100%',
  },
});
export default RadialGradientContent;