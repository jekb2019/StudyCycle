const goButton = document.querySelector("#controllers__go");
const stopButton = document.querySelector("#controllers__stop");
const resetCtrButton = document.querySelector("#controllers__reset");
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
const timerContainer = document.querySelector("#timer-container");
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
let focusTime = 20*60;
let currentTime = 0;
let breakTime = 5*60;
let isFocus = true;
let goalCycleNum = 5;
let cycleNum = 1;
let timerInitiated = false;
let timerPaused = true;

// Function used for debugging current timer data values
function deb() {
    console.log("CurrentTime", currentTime);
    console.log("isFocus", isFocus);
    console.log("cycleNum", cycleNum);
    console.log("goalCycleNum", goalCycleNum);
    console.log("timerInitiated", timerInitiated);
    console.log("timerPaused", timerPaused);

}

settingButton.onclick = () => {
    makeClickSound();
    openSettingWindow();
}

settingCloseButton.onclick = () => {
    makeClickSound();
    closeSettingWindow();
}

settingOKButton.onclick = () => {
    makeClickSound();
    closeSettingWindow();
    setTimerSetting();
}

resetButton.onclick = () => {
    makeClickSound();
    timerPaused = true;
    resetTimer();
}

// when controller (go/stop) is clicked
controller.onclick = () => {
    makeClickSound();
    if(controller.classList.contains("go")) {
        switchControllerStatus("go")
        if(!timerInitiated) {
            timerInitiated = true;
            initiateTimer();
        } else {
            startTimer();
        }
    } else if(controller.classList.contains("stop")) {
        switchControllerStatus("stop")
        pauseTimer();
    } else if(controller.classList.contains("reset")) {
        makeClickSound();
        timerPaused = true;
        resetTimer();
    }   
}

function initiateTimer() {
    makeFocusSound();
    startTimer();
}

function startTimer() {
    progressTimer();
}

function pauseTimer() {
    timerPaused = true;
    clearInterval(timer);
}

function resetCurrentTime() {
    currentTime = 0;
}

// Progress timer every 1 second
function progressTimer() {
    timerPaused = false;
    timer = setInterval(() => {
        if(isFocus) {
            if(currentTime >= focusTime) {
                resetCurrentTime();
                isFocus = false;
                makeBreakSound();
                updateIndicator("break");
                updateTimerColor("break")
            }
        } else {
            if(currentTime >= breakTime) {
                resetCurrentTime();
                incrementCycle();
                isFocus = true;
                if(cycleNum == goalCycleNum && goalCycleNum == 1) {
                    processGoalMet();
                    return;
                }
                makeFocusSound();
                updateIndicator("focus");
                updateTimerColor("focus");
            }
        }
        currentTime++;
        updateTimeDisplay(currentTime);
    }, 1000)
}

// Update timer display according to currentTime
function updateTimeDisplay(currentTime) {
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

function incrementCycle() {
    cycleNum++;
    cycleDisplay.innerHTML = `Cycle ${cycleNum}`;
}

// reset timer data and display
function resetTimer() {
    timerInitiated = false;
    cycleNum = 1;
    isFocus = true;
    resetCurrentTime();
    updateIndicator("focus");
    updateTimerColor("focus");
    cycleDisplay.innerHTML = `Cycle 1`;
    timerDisplay.innerHTML = "00:00:00";
    switchControllerStatus("stop")
    pauseTimer();
}

// Goal met processor
function processGoalMet() {
    makeGoalSound();
    pauseTimer();
    timerInitiated = false;
    updateIndicator("focus");
    updateTimerColor("focus");
    timerDisplay.innerHTML = "00:00:00";
    switchControllerStatus("reset")
    blinkTimerDisplay();
    
}

// Blink timer display (used for processGoalMet() function)
function blinkTimerDisplay(){
    timerContainer.style.pointerEvents = "none";
    let greenText = false;
    let blinkCount = 0
    const goalAction = setInterval(() => {
        if(blinkCount >= 10) {
            timerDisplayBox.classList.add("active");
            clearInterval(goalAction);
            timerContainer.style.pointerEvents = "auto";
            return;
        }
        if(greenText) {
            timerDisplayBox.classList.add("active");
            greenText = false;
        } else {
            timerDisplayBox.classList.remove("active");
            greenText = true;
        }
        blinkCount++;
    }, 300);
}

// update focus/break indicator 
function updateIndicator(status) {
    if(status == "focus") {
        if(!timerPaused) {
            makeFocusSound();
        }
        breakIndicator.classList.remove("active");
        focusIndicator.classList.add("active");
    } else if (status == "break") {
        makeBreakSound();
        breakIndicator.classList.add("active");
        focusIndicator.classList.remove("active");
    }
}
// update focus/break timer color
function updateTimerColor(status) {
    if(status == "focus") {
        timerDisplayBox.classList.add("active");
    } else if (status == "break") {
        timerDisplayBox.classList.remove("active");
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
        controller.classList.remove("reset");
        goButton.classList.remove("active");
        stopButton.classList.add("active");
        resetCtrButton.classList.remove("active");
    } else if (currentStatus == "stop") {
        controller.classList.remove("reset");
        controller.classList.add("go");
        controller.classList.remove("stop");
        goButton.classList.add("active");
        stopButton.classList.remove("active");
        resetCtrButton.classList.remove("active");
    } else if (currentStatus == "reset") {
        controller.classList.add("reset");
        controller.classList.remove("stop");
        controller.classList.remove("go");
        goButton.classList.remove("active");
        stopButton.classList.remove("active");
        resetCtrButton.classList.add("active");
    }
}

// Setting window functions
function openSettingWindow() {
    settingWindow.style.display = "flex";
    fullAppWrapper.style.filter = "brightness(60%)";
}
function closeSettingWindow() {
    settingWindow.style.display = "none";
    fullAppWrapper.style.filter = "brightness(100%)";
}

// Sound functions
function makeFocusSound() {
    const sound = new Audio("sound/focus.wav");
    sound.play();
}

function makeBreakSound() {
    const sound = new Audio("sound/break.wav");
    sound.play();
}

function makeClickSound() {
    const sound = new Audio("sound/click.wav");
    sound.play();
}

function makeGoalSound() {
    const sound = new Audio("sound/goal.wav");
    sound.play();
}