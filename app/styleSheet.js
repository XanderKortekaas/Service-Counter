import { StyleSheet } from "react-native";

import Colors from './color.js';

const styles = StyleSheet.create({

  "style": {
    "backgroundColor": Colors.GRAY_800,
    "flex": 1, 
    "justifyContent": "center", 
    "alignItems": "center" 
  },
  "App_header": {
    "flex": 1, 
    "flexDirection": "column",
    "alignItems": "center",
    "fontSize": 48, 
    "color": Colors.GREEN_200, 
  },
  "counter_container": {
    "flexDirection": "row",
    "alignItems": "center",
    "width": 1000,
    "height": 150,
    "columnGap": 40, 
  },
  "counter_viewer": {
    "marginTop": 80,
    "marginBottom": 80,
  },
  "counter_section": {
    "marginBottom": 60
  },
  "counter_section_h1": {
    "flex": 1,
    "color": Colors.GREEN_200, 
    "fontSize": 40,
  },
  "button": {
    "backgroundColor": Colors.GRAY_300,
    "borderRadius": 10,
  },
  "button_layout": {
    "justifyContent": "center",
    "alignItems": "center",
    "width": 300,
    "height": 100,
  },
  "button_svg":{
  },
  "button_text": {
    "justifyContent": "center",
    "fontSize": 75,
    "color": Colors.GRAY_900,
  },
  "App": {
  },
  "App-container": {
    "flex": 2,
    "flexDirection": "column",
    "alignItems": "center"
  },
  "logo": {
    "height": 100,
    "width": 100
  },
});

export default styles

