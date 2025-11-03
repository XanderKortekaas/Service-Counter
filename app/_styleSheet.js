import { StyleSheet } from "react-native";
import Colors from './_color';


const styles = StyleSheet.create({

  "style": {
    "backgroundColor": Colors.GRAY_800,
    "flex": 1, 
    "justifyContent": "center", 
    "alignItems": "center" 
  },
  "app":{
  },
  "app_header": {
    "alignItems": "center",
    "fontSize": 48, 
    "color": Colors.BLUE_700 , 
  },
  "app_text":{
    "fontSize":24,
    "color": Colors.OLIVE_500, 
    "marginBottom": 25,
  },
  "app-container": {
    "flex": 1,
    "flexDirection": "column",
    "alignItems": "center"
  },
  "counter_container": {
    "flex": 1 ,
    "alignItems": "center",
    "height": '100%',
  },
  "counter_viewer": {
    "flexDirection": "Row",
    "flexWrap": "wrap",
    "justifyContent": "center",
    "marginTop": 40,
    "marginBottom": 20,
    "gap": 20, 
  },
  "counter_section": {
    "flexDirection":'row',
    "alignItems": 'center',
    "justifyContent":'space-between',
  },
  "counter_section_h1":{
    "flex": 1,
    "color": Colors.GREEN_200, 
    "fontSize": 40,
  },
  "department_section":{
    "flexDirection":'row',
    "alignItems": 'center',
    "justifyContent":'space-between',
    "padding": 20,
  },
  "department":{
    "color": Colors.BLUE_700,
    "fontSize": 36,
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
    "borderRadius": 5,
    "minWidth": 75,
    "maxWidth": 150,  
  },
  "button_text": {
    "fontSize": 25,
    "color": Colors.GRAY_900,
  },
   "button_titel_text": {
    "fontSize": 25,
    "color": Colors.GREEN_500,
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
    "borderRadius": 5,
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

