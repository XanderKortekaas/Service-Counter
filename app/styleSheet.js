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
  "App_text":{
    "fontSize":24,
    "color": Colors.OLIVE_500, 
    "marginBottom": 25,
  },
  "counter_container": {
    "alignItems": "center",
    "width": 1280,
    "height": 600,
  },
  "counter_viewer": {
    "flexDirection": "Row",
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
  "department_name":{

  },
  "department_count":{

  },
  "button_group":{
    "flexDirection": "row",
  }, 
  "button": {
    "marginTop": 10,
    "marginRight": 25,
    "marginLeft": 25,
    "alignItems":"center",
  },
  "button_layout": {
    "backgroundColor": Colors.GREEN_500,
    "borderRadius": 20,
    "minWidth": 75,
    "maxWidth": 100,  
  },
  "button_text": {
    "fontSize": 25,
    "color": Colors.GRAY_900,
  },
  "App": {
    "flex": 1,
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
    "marginBottom": 50,
    "marginTop": 50,
  },
  "modal_button_text":{
    "fontSize": 20,
    "color": Colors.GRAY_800,
  },
  "modal_text":{
    "fontSize": 20,
    "color": Colors.GRAY_200,
  },
});

export default styles

