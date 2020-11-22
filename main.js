const goButton = document.querySelector("#controllers__go");
const stopButton = document.querySelector("#controllers__stop");
const controller = document.querySelectorAll(".controllers")[0];
const setting = document.querySelector("#setting-icon-wrapper");

setting.onclick = () => {
// todo - implement
    console.log(setting);
}
controller.onclick = () => {
    switchControllerStatus();
}

// Switch controller status from go to stop and vice versa
function switchControllerStatus(){
    if(controller.classList.contains("go")) {
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