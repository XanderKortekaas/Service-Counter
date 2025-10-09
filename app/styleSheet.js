import { StyleSheet } from "react-native";
import Colors from './color';

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
    "alignItems": "center",
  },
  "modal_button": {
    "backgroundColor": Colors.OLIVE_500,
    "borderRadius": 15,
  },
  "modal_button_text":{
    "fontSize": 20,
    "color": Colors.GRAY_800,
  },
  "modal_text":{
    "fontSize": 20,
    "color": Colors.GRAY_200,
    "marginBottom": 20,
    "marginTop": 20,
  },
});

export default styles

