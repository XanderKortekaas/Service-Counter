import { element, func, oneOfType } from "prop-types";
import { Component, React } from "react";
import { isHoverEnabled } from "./HoverState";

export default class Hoverable extends Component {
    constructor(props){
        super(props);
        this.state = {isHovered: false, showHover: true };
        this._handlemouseEnter = this._handlemouseEnter.bind(this);
        this._handlemouseLeave = this._handlemouseLeave.bind(this);
        this._handleGrant = this._handleGrant.bind(this);
        this._handleRelease = this._handleRelease.bind(this);
    }

    _handlemouseEnter(e){
        if(isHoverEnabled() && !this.state.isHovered){
            const{onHoverIn} = this.props;
            if(onHoverIn)onHoverIn();
            this.setState(state=> ({...state, isHovered: true}));
        }
    }

    _handlemouseLeave(e){
        if(this.state.isHovered){
            const {onHoverout} = this.props;
            if(onHoverout) onHoverout();
            this.setState(state => ({...state, isHovered: false}));
        }
    }

    _handleGrant(){
        this.setState(state => ({...state, showHover: false}));
    }
    
    _handleRelease(){
        this.setState(state => ({...state, showHover: true}));
    }

    render(){
        const{children, onHoverIn, onHoverout} = this.props;
        const child = 
            typeof children === "function" 
            ? children(this.state.showHover && this.state.isHovered)
            : children;

        return React.cloneElement(React.Children.only(child), {
            onMouseEnter: this._handlemouseEnter, 
            onMouseLeave: this._handlemouseLeave, 
            
            onResponderGrant: this._handleGrant,
            onResponderLeave: this._handlemouseLeave,
            
            onPressIn: this._handleGrant,
            onPressOut: this._handleRelease,
        })
    }

    
}
Hoverable.propTypes = {
    children: oneOfType([func, element]),
    onHoverIn: func,
    onHoverout: func,
};

Hoverable.displayName = "Hoverable"; 