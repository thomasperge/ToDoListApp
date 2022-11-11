const { ipcRenderer, contextBridge } = require('electron')
const data = require('./../data.json')

/**
 * Initialize API window
 */
const API = {
    window: {
        close: () => ipcRenderer.send("appMain/close"),
        minimize: () => ipcRenderer.send("appMain/minimize")
    },
}


/**
 * Create new window to add a Task
 * Event : Button "+" click => send path
 */
document.addEventListener('DOMContentLoaded', function() {
    let addButton = document.getElementById("addTask")
    addButton?.addEventListener("click", () => {
        ipcRenderer.send("appMain/addTaskWindows")
    })
})


/**
 * Button commit the task (send the input text to ipcMain)
 * Event : Add Button click => send path
 */
document.addEventListener('DOMContentLoaded', function() {
    let addButtonSend = document.getElementById("addTaskButtonClick")

    addButtonSend?.addEventListener("click", () => {
        let input = document.getElementById("taskInputText").value
        const cb = document.getElementById('important');

        var _myreq = {
            task: input,
            checked: cb.checked
        };

        ipcRenderer.send("appMain/addTaskSend", (event, _myreq))
    })
})


/**
 * Button Delete and Finish a Task (main page index.html)
 * 2 Button : Delete and Finish => Check event => Send path
 */
document.addEventListener('DOMContentLoaded', function() {
    // == Loop into the DataBase ==
    for(let pas = 0; pas <= data.task.allTask.length-1; pas++) {

        // Initialize the different id existing according to the DB id :
        let deleteButton = document.getElementById("deleteButton" + data.task.allTask[pas].id.toString())
        let finishButton = document.getElementById("finishButton" + data.task.allTask[pas].id.toString())

        // Delete Button Event :
        deleteButton?.addEventListener("click", () => {

            var _myreq = {
                id: data.task.allTask[pas].id,
                task: data.task.allTask[pas].taskText,
                checked: data.task.allTask[pas].check
            };

            ipcRenderer.send("appMain/deleteTask", (event, _myreq))
        });

        // Finish Button Event :
        finishButton?.addEventListener("click", () => {

            var _myreq = {
                id: data.task.allTask[pas].id,
                task: data.task.allTask[pas].taskText,
                checked: data.task.allTask[pas].check
            };

            ipcRenderer.send("appMain/finishTask", (event, _myreq))
        })
    }
})

/**
 * Close and minimize Window add task / Window Login
 */
document.addEventListener('DOMContentLoaded', function() {
    let closeButtonAdd = document.getElementById("close-appAdd")
    let minButtonAdd = document.getElementById("minimizeAdd")

    let closeButtonLogin = document.getElementById("close-appLogin")
    let minButtonLogin = document.getElementById("minimizeLogin")

    // Close Button Add => Close window addTask
    closeButtonAdd?.addEventListener("click", () => {
        ipcRenderer.send("appAdd/closeAdd")
    })

    // Min Button Add => Minimize window addTask
    minButtonAdd?.addEventListener("click", () => {
        ipcRenderer.send("appAdd/minimizeAdd")
    })

    // Close Button Register => close window register 
    closeButtonLogin?.addEventListener("click", () => {
        ipcRenderer.send("appAdd/closeLogin")
    })

    // Min Button Register => Minimize window register
    minButtonLogin?.addEventListener("click", () => {
        ipcRenderer.send("appAdd/minimizeLogin")
    })
})


/**
 * Login a User with : Username and Profile Picture
 * Check the input: Username & Profile Picture
 * See if the 2 have been filled => return path with 2 parameter: Username & Pp
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the input :
    const fileSelector = document.getElementById('file');
    const usernameSelector = document.getElementById('input-username')
    const namePicture = document.getElementById("namePicture")

    // Initialize the register button:
    const registerButton = document.getElementById("register-button")

    // Initialize the image input bool :
    var imageDone = false
    var pathPicture

    // Check the event if there are any changes in the inputs :
    fileSelector.addEventListener('change', (event) => {
        // Initilize the file filled :
        const fileList = event.target.files;

        // Check the file size :
        if(fileList[0].size <= 1820000) {
            namePicture.innerHTML = fileList[0].name
            pathPicture = fileList[0].path
            namePicture.style = "display: block;"
            imageDone = true
        } else {
            namePicture.innerHTML = "File too big, please take a new one..."
            namePicture.style = "display: flex;"
        }
    });

    // Register Button :
    registerButton.addEventListener('click', function() {
        // Check if the 2 input are filled :
        if(imageDone && usernameSelector.value.length >= 0) {

            var _myreq = {
                image: pathPicture,
                username: usernameSelector.value,
            };

            ipcRenderer.send("appMain/registerUser", (event, _myreq))
        }
    })
})

contextBridge.exposeInMainWorld("app", API)
