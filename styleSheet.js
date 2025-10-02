import { StyleSheet } from "react-native";

import Colors from './app/color.js';

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
    "width": 900,
    "height": 150,
    "columnGap": 40, 
    "color": Colors.GREEN_200, 
  },
  "counter_viewer": {
    "marginTop": 40,
    "marginBottom": 40,
  },
  "counter_section": {
    "marginBottom": 40
  },
  "counter_section_h1": {
    "flex": 1,
    "color": Colors.GREEN_500, 
    "fontSize": 48,
    "alignContent": "center"
  },

  "button": {
    "width": 100,
    "height": 100,
    "backgroundColor": Colors.BLUE_700
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
    
    "fontSize": 50,
    "color": Colors.GRAY_900,
  },
  "App": {
   
  },"App-container": {
    "flex": 1,
    "flexDirection": "column",
    "alignItems": "center"
  },
  "logo": {
    "height": 100,
    "width": 100
  },
});

export default styles

