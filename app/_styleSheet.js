import { StyleSheet } from "react-native";
import Colors from './_color';

const styles = StyleSheet.create({
    // --- Algemene Layout ---
    "style": {
        "backgroundColor": Colors.GRAY_800,
        "flex": 1,
        "width": '100%',
    },
    "center": {
        "flex": 1,
        "justifyContent": "center",
        "alignItems": "center",
        "padding": 20,
    },
    "app_header_text": {
        "fontSize": 32,
        "fontWeight": "bold",
        "color": Colors.GRAY_100,
        "textAlign": "center",
        "marginBottom": 20,
    },
    "app_text": {
        "fontSize": 18,
        "color": Colors.GRAY_300,
        "textAlign": "center",
    },
    "scrollview_style": {
        "flex": 1,
    },
    // --- Kaart Styling (Cards) ---
    "container": {
        "backgroundColor": Colors.GRAY_700,
        "padding": 20,
        "marginVertical": 10,
        "borderRadius": 15,
        "width": '100%',
        "minHeight": 250,
        "shadowColor": '#000',
        "shadowOffset": { width: 0, height: 4 },
        "shadowOpacity": 0.3,
        "shadowRadius": 5,
        "elevation": 8,
        "alignItems": 'center',
    },
    "counterContainer": {
        "backgroundColor": Colors.GRAY_800,
        "padding": 15,
        "borderRadius": 50,
        "width": 120,
        "height": 120,
        "justifyContent": 'center',
        "alignItems": 'center',
        "marginBottom": 15,
        "borderWidth": 2,
        "borderColor": Colors.BLUE_700,
    },
    "countText": {
        "fontSize": 36,
        "fontWeight": 'bold',
        "color": Colors.BLUE_700,
    },
    "title": {
        "fontSize": 22,
        "fontWeight": 'bold',
        "color": Colors.GRAY_100,
        "marginBottom": 15,
        "textAlign": 'center',
    },

    // --- Knoppen (Consistent Design) ---
    "button_layout": {
        "backgroundColor": Colors.GRAY_700,
        "borderRadius": 10,
        "borderWidth": 1,
        "borderColor": Colors.GRAY_500,
        "alignItems": "center",
        "justifyContent": "center",
    },
    "button_text": {
        "fontSize": 16,
        "fontWeight": "bold",
        "color": Colors.GRAY_100,
    },
    "counterButton": { 
        "backgroundColor": Colors.BLUE_700,
        "paddingVertical": 12,
        "paddingHorizontal": 25,
        "borderRadius": 30,
        "minWidth": 100,
        "alignItems": "center",
    },
    "buttonRed": {
        "backgroundColor": Colors.Red_900,
    },
    "buttonText": { 
        "fontSize": 16,
        "fontWeight": "bold",
        "color": Colors.GRAY_100,
    },

    // --- Modal Styling ---
    "overlay": {
        "flex": 1,
        "backgroundColor": 'rgba(0, 0, 0, 0.85)',
        "justifyContent": "center",
        "alignItems": "center",
    },
    "modalContent": { 
        "width": '85%',
        "backgroundColor": Colors.GRAY_700,
        "borderRadius": 20,
        "padding": 25,
        "alignItems": "center",
    },
    "modal_button": {
        "backgroundColor": Colors.GRAY_800,
        "borderColor": Colors.VIOLET_500,
        "borderWidth": 1,
        "borderRadius": 10,
        "paddingVertical": 15,
        "alignItems": 'center',
        "width": '100%',
    },
    "modalButtonText": { 
        "fontSize": 24,
        "fontWeight": "bold",
        "color": Colors.VIOLET_500,
    },
    "input": {
        "width": '100%',
        "backgroundColor": Colors.GRAY_800,
        "borderRadius": 10,
        "padding": 15,
        "fontSize": 18,
        "color": Colors.BLUE_700,
        "borderWidth": 1,
        "borderColor": Colors.BLUE_700,
        "marginBottom": 20,
    },
    "button_group": {
        "flexDirection": "row",
        "gap": 10,
    },
    "button": {
        "paddingVertical": 12,
        "paddingHorizontal": 20,
        "borderRadius": 10,
        "minWidth": 100,
        "alignItems": "center",
    },
    "cancelButton": {
        "backgroundColor": Colors.GRAY_600,
    },
    "addButton": {
        "backgroundColor": Colors.VIOLET_500,
    },

    // --- Overig ---
    "customer_stats_layout": {
        "backgroundColor": Colors.GRAY_700, 
        "padding": 20, 
        "borderRadius": 15, 
        "marginTop": 20,
        "alignItems": "center",
    },
    "customer_text": {
        "fontSize": 48,
        "fontWeight": "bold",
        "color": Colors.VIOLET_500,
    }
});

export default styles;