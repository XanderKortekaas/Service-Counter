import { StyleSheet } from "react-native";
import Colors from './_color';

const styles = StyleSheet.create({
    // --- Algemene Layout & Text Stijlen ---
    "style": {
        "backgroundColor": Colors.GRAY_800,
        "flex": 1,
        "justifyContent": "center",
        "alignItems": "center"
    },
    "app": {},
    "center": {
        "flex": 1,
        "justifyContent": "center",
        "alignItems": "center",
        "padding": 20,
    },
    "app_header_container": {
        "alignItems": "center",
        "marginBottom": 30,
        "paddingTop": 10
    },
    "app_header_text": {
        "fontSize": 48,
        "color": Colors.GRAY_100,
    },
    "app_text": {
        "fontSize": 24,
        "color": Colors.OLIVE_500,
        "marginBottom": 25,
    },
    "app-container": {
        "flex": 1,
        "flexDirection": "column",
        "alignItems": "center"
    },
    "counter_container": {
        "flex": 1,
        "alignItems": "center",
        "height": '100%',
    },
    "counter_viewer": {
        "flexDirection": "row",
        "flexWrap": "wrap",
        "justifyContent": "center",
        "marginTop": 40,
        "marginBottom": 20,
        "gap": 20,
    },
    "counter_section": {
        "flexDirection": 'row',
        "alignItems": 'center',
        "justifyContent": 'space-between',
    },
    "counter_section_h1": {
        "flex": 1,
        "color": Colors.GREEN_200,
        "fontSize": 40,
    },
    "department_section": {
        "flexDirection": 'row',
        "alignItems": 'center',
        "justifyContent": 'space-between',
        "padding": 20,
    },
    "department_name_text": {
        "fontSize": 36,
        "color": Colors.GREEN_500,
    },
    "department_count": {
        "color": Colors.OLIVE_500,
        "fontSize": 36,
    },
    "department": {
        "color": Colors.BLUE_700,
        "color": Colors.GRAY_100,
        "fontSize": 18,
    },
    "scrollview_style":{
        "flex": 1 
    },  
    // --- Buttons & Tellers ---
    "button_group": {
        "flexDirection": "row",
    },
    "button": { 
        "flex": 1, 
        "paddingVertical": 15, 
        "borderRadius": 10,
        "alignItems": "center",
        "marginTop": 10,
        "marginRight": 25,
        "marginLeft": 25,
    },
    "button_layout": {
        "backgroundColor": Colors.GRAY_575,
        "borderRadius": 5,
        "borderColor": Colors.GREEN_500,
        "borderWidth": 1,
        "alignItems": "center",
    },
    "button_text": {
        "fontSize": 24,
        "color": Colors.OLIVE_500,
        "textAlign": 'center'
    },
    "button_titel_text": {
        "fontSize": 25,
        "color": Colors.GREEN_500,
    },
    "admin_button":{
        "alignContent":'center',
    },

    // --- Modal Algemeen ---
    "overlay": {
        'flex': 1,
        'backgroundColor': 'rgba(0, 0, 0, 0.7)',
        'justifyContent': 'center',
        'alignItems': 'center',
    },
    // Samengevoegde modal_content stijlen
    "modal_content": { 
        "alignItems": "center",
        'backgroundColor': Colors.GRAY_700,
        'borderRadius': 15,
        'padding': 25,
        'shadowColor': '#000',
        'shadowOffset': { width: 0, height: 2 },
        'shadowOpacity': 0.25,
        'shadowRadius': 3.84,
        'elevation': 5,
    },
    "modal_button_layout":{
        "flexDirection": 'row',
        "minWidth": 75,
        "maxWidth": 150,
        "gap": 10,
    },
    "modal_button": {
        "backgroundColor": Colors.GRAY_800,
        "borderColor":Colors.VIOLET_500,
        "borderWidth": 1,
        "borderRadius": 5,
        "marginBottom": 50,
        "marginTop": 50,
        "paddingHorizontal": 20,
        "paddingVertical": 10,
        "alignItems": 'center',
    },
    "modal_button_text": {
        "fontSize": 20,
        "color": Colors.VIOLET_500,
        "alignSelf": 'center',
    },
    "modal_text": {
        "fontSize": 20,
        "color": Colors.GRAY_200,
        "alignSelf": 'center',
    },
    // --- Grafiek style ---
    "graph_style":{
        "borderBottomWidth": 1, 
        "borderBottomColor": '#ccc', 
        "marginHorizontal": 20, 
    },
    // --- Specifieke Statistische & Input Stijlen ---
    "customer_text": {
        "fontSize": 20,
        "color": Colors.VIOLET_500,
    },
    "customer_stats_layout": {
        'backgroundColor': Colors.GRAY_700, 
        'padding': 15, 
        'borderRadius': 10, 
        'marginTop': 20, 
    },
    // --- Datum kiezer ---
    "date_picker_style":{
        'flexDirection': 'row', 
        'justifyContent': 'center', 
        'marginBottom': 10,
    },
    "title": { // Modal Titel
        'fontSize': 20,
        'fontWeight': 'bold',
        'color': Colors.BLUE_700,
        'marginBottom': 20,
        'textAlign': 'center',
    },
    "input": { // Modal Input
        'backgroundColor': Colors.GRAY_800,
        'borderRadius': 10,
        'padding': 15,
        'fontSize': 18,
        'color': Colors.GREEN_200,
        'borderWidth': 1,
        'borderColor': Colors.GREEN_200,
        'marginBottom': 20,
    },
    "buttonRow": {
        "flexDirection": "row",
        "flexWrap": "wrap",
        "justifyContent": "center",
        "marginTop": 40,
        "marginBottom": 20,
        "gap": 20,
    },
    "cancelButton": {
        'backgroundColor': Colors.GRAY_900,
        "borderColor": Colors.GRAY_200,
        "borderWidth": 1,
        "borderRadius": 5,
        "marginBottom": 50,
        "marginTop": 50,
    },
    "addButton": {
        'backgroundColor': Colors.GRAY_900,
        "borderColor": Colors.GREEN_500,
        "borderWidth": 1,
        "borderRadius": 5,
        "marginBottom": 50,
        "marginTop": 50,
    },
    "buttonText": { 
        'fontSize': 16,
        'color': Colors.GRAY_200,
    },
    "logo": {
        "height": 100,
        "width": 100
    },
});

export default styles;