const goButton = document.querySelector("#controllers__go");
const stopButton = document.querySelector("#controllers__stop");
const controller = document.querySelectorAll(".controllers")[0];
const settingButton = document.querySelector("#setting-icon-wrapper");
const focusIndicator = document.querySelector("#focus-indicator");
const breakIndicator = document.querySelector("#break-indicator");
const timerDisplay = document.querySelector("#timer-box__timer__display");
const cycleDisplay = document.querySelector("#timer-box__cycle__display");
const timerDisplayBox = document.querySelectorAll(".timer-box__timer")[0];
const resetButton = document.querySelector("#reset-wrapper");
const settingWindow = document.querySelector("#setting-window");
const settingCloseButton = document.querySelector("#setting-window__close-button-wrapper");
const fullAppWrapper = document.querySelector("#full-wrapper");
const settingOKButton = document.querySelector("#setting-window__ok-button");
// Timer setting input values
const focusHrSet = document.querySelector("#focus-time-setting-hr");
const focusMinSet = document.querySelector("#focus-time-setting-min");
const breakHrSet = document.querySelector("#break-time-setting-hr");
const breakMinSet = document.querySelector("#break-time-setting-min");
const cycleNumSet = document.querySelector("#cycle-num-setting");
// Timer descriptions
let focusHrDesc = document.querySelector("#cycle-info__desc__f-hr");
let focusMinDesc = document.querySelector("#cycle-info__desc__f-min");
let breakHrDesc = document.querySelector("#cycle-info__desc__b-hr");
let breakMinDesc = document.querySelector("#cycle-info__desc__b-min");
let cycleDesc = document.querySelector("#cycle-info__desc__cycle");

let timer;
let focusTime = 20*60; //link this with the application
let currentTime = 0; //link this with the application
let breakTime = 5*60;
let isFocus = true;
let goalCycleNum;
let cycleNum = 1;

settingButton.onclick = () => {
    openSettingWindow();
}

settingCloseButton.onclick = () => {
    closeSettingWindow();
}

settingOKButton.onclick = () => {
    closeSettingWindow();
    setTimerSetting();
}

resetButton.onclick = () => {
    resetTimer();
}

// when controller (go/stop) is clicked
controller.onclick = () => {
    if(controller.classList.contains("go")) {
        switchControllerStatus("go")
        startTimer();
    } else {
        switchControllerStatus("stop")
        pauseTimer();
    }
}

//set timer by getting input from the setting window
function setTimerSetting() {
    let focusHr = focusHrSet.value;
    let focusMin = focusMinSet.value;
    let breakHr = breakHrSet.value;
    let breakMin = breakMinSet.value;
    let cycles = cycleNumSet.value;

    focusTime = focusHr*60*60 + focusMin*60;
    breakTime = breakHr*60*60 + breakMin*60;
    goalCycleNum = cycles; 

    focusHrDesc.innerHTML = focusHr;
    focusMinDesc.innerHTML = focusMin;
    breakHrDesc.innerHTML = breakHr;
    breakMinDesc.innerHTML = breakMin;
    cycleDesc.innerHTML = cycles;
    resetTimer();
}

// open setting window
function openSettingWindow() {
    settingWindow.style.display = "flex";
    fullAppWrapper.style.filter = "brightness(60%)";
}

// close setting window
function closeSettingWindow() {
    settingWindow.style.display = "none";
    fullAppWrapper.style.filter = "brightness(100%)";
}


// start timer
function startTimer() {
    currentTime++;
    updateDisplay(currentTime);
    timer = setInterval(() => {
        if(isFocus){
            if(currentTime >= focusTime){
                // pauseTimer(timer);
                resetCurrentTime();
                isFocus = false;
            }
        } else {
            if(currentTime >= breakTime){
                // pauseTimer(timer);
                updateCycle();
                resetCurrentTime();
                isFocus = true;
            }
        }
        currentTime++;
        updateDisplay(currentTime);
        
        
    }, 1000);
}

// pause timer
function pauseTimer() {
    clearInterval(timer);
}

// reset current time
function resetCurrentTime() {
    currentTime = 0;
}

// reset the whole timer data
function resetTimer(){
    resetCurrentTime();
    cycleNum = 1;
    isFocus = true;
    currentTime = 0;
    updateIndicator();
    updateTimerColor();
    cycleDisplay.innerHTML = `Cycle 1`;
    timerDisplay.innerHTML = "00:00:00";
    switchControllerStatus("stop")
    pauseTimer();
}

//update cycle number
function updateCycle() {
    cycleNum++;
    cycleDisplay.innerHTML = `Cycle ${cycleNum}`;
}

function updateDisplay(currentTime) {
    updateTimerDisplay(currentTime)
    updateIndicator();
    updateTimerColor();
}

function updateTimerColor() {
    if(isFocus) {
        timerDisplayBox.classList.add("active");
    } else {
        timerDisplayBox.classList.remove("active");
    }
}

// update focus/break indicator 
function updateIndicator() {
    if(isFocus) {
        breakIndicator.classList.remove("active");
        focusIndicator.classList.add("active");
    } else {
        breakIndicator.classList.add("active");
        focusIndicator.classList.remove("active");
    }
}

// update timer display
function updateTimerDisplay(currentTime) {
    let hours;
    let minutes;
    let seconds;

    let hms = calculateTime(currentTime);
    
    if(hms[0] < 10) {
        hours = `0${hms[0].toString()}`;
    }else{
        hours = hms[0].toString();
    }
    
    if(hms[1] < 10) {
        minutes = `0${hms[1]}`;
    }else{
        minutes = hms[1].toString();
    }

    if(hms[2] < 10) {
        seconds = `0${hms[2]}`;
    }else{
        seconds = hms[2].toString();
    }

    let timeString = `${hours}:${minutes}:${seconds}`;
    timerDisplay.innerHTML = timeString;
}

// convert seconds to hours, minutes, seconds
function calculateTime(currentTimeInSec){
    let timeInSeconds = currentTimeInSec;
    let hours = timeInSeconds/(60*60);
    hours = Math.floor(hours);
    timeInSeconds = timeInSeconds % (60*60);
    let minutes = timeInSeconds/(60);
    minutes = Math.floor(minutes);
    let seconds = timeInSeconds % 60;

    return [hours, minutes, seconds];
}

// Switch controller status from go to stop and vice versa
function switchControllerStatus(currentStatus){
    if(currentStatus == "go") {
        controller.classList.remove("go");
        controller.classList.add("stop");
        goButton.classList.remove("active");
        stopButton.classList.add("active");
    } else {
        controller.classList.add("go");
        controller.classList.remove("stop");
        goButton.classList.add("active");
        stopButton.classList.remove("active");
    }
}

// Switch indicator status from focus to break and vice versa
function switchIndicatorMode() {
    console.log(isFocus);
    if(isFocus) {
        isFocus = false;
        focusIndicator.classList.remove("active");
        breakIndicator.classList.add("active");
    } else {
        isFocus = true;
        focusIndicator.classList.add("active");
        breakIndicator.classList.remove("active");
    }
    console.log(isFocus);
}