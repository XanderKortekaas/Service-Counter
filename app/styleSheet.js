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
    "color": Colors.BLUE_700 , 
  },
  "counter_container": {
    "flexDirection": "row",
    "alignItems": "center",
    "width": 1500,
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
    "borderRadius": 15,
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
    "marginTop":-12.5,
    "fontSize": 75,
    "color": Colors.GRAY_900,
  },
  "App": {
    "flex": 0.5,
  },
  "App-container": {
    "flex": 1,
    "flexDirection": "column",
    "alignItems": "center"
  },
  "logo": {
    "height": 100,
    "width": 100
  },
  "modal_content":{
    "flex":2,
    "alignItems": "center",
  },
  "modal_button": {
    "backgroundColor": Colors.GRAY_100,
    "borderRadius": 15,
    "marginTop": -20,
  },
  "modal_text":{
    "fontSize": 20,
    "color": Colors.GRAY_200,
  },
});

export default styles

