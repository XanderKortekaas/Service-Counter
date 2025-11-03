import { canUseDom } from "fbjs/lib/ExecutionEnvironment";

let isEnabled = false;

if(canUseDom){
    const Hover_Treshold_ms = 1000;
    let lastTouchTime = 0;

    function enableHover() {
        if(isEnabled|| Date.now - lastTouchTime < Hover_Treshold_ms){
            return;
        }
        isEnabled = true;
    }

    function disableHover() {
        lastTouchTime = Date.now();
        if (isEnabled){
            isEnabled = false
        }
    }

    document.addEventListener("touchstart", disableHover, true);
    document.addEventListener("touchmove", disableHover, true);
    document.addEventListener("mousemove", enableHover, true);
}

export function isHoverEnabled(){
    return isEnabled;
}