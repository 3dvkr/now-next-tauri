import { endWorkSession, getWorkSessions, startWorkSession } from "./tauri.js"

// requires https://tauri.app/v1/api/config/#windowconfig.filedropenabled = false
export const dropzones = document.querySelectorAll('.dropzone')

// ZONES drag and drop event handlers 
export function dropzoneHandler(zoneId) {
    return function (ev) {
        ev.preventDefault()
        document.getElementById(zoneId).classList.remove('bg-active-dropzone')
        document.getElementById(zoneId).classList.remove('bg-inactive-dropzone')
        const data = ev.dataTransfer.getData('application/my-app')
        const currTask = document.getElementById(data)
        const prevZoneId = currTask.parentElement.id
        if (zoneHasSpace(zoneId)) {
            ev.currentTarget.appendChild(currTask)
            if (zoneId === 'done' || prevZoneId !== 'next' || prevZoneId === 'now') {
                endWorkSession(+data.slice(1), zoneId === 'done')
            }
            if (zoneId !== 'next' && zoneId !== 'done' || prevZoneId === 'now') {
                startWorkSession(+data.slice(1), zoneId === 'now')
            }
            getWorkSessions()

        }
    }
}
export function dragoverHandler(zoneId) {
    return function (ev) {
        ev.preventDefault()
        if (zoneHasSpace(zoneId)) {
            document.getElementById(zoneId).classList.add('bg-active-dropzone')
        } else {
            document.getElementById(zoneId).classList.add('bg-inactive-dropzone')
            ev.dataTransfer.effectAllowed = "none"
        }
        ev.dataTransfer.dropEffect = 'move'
    }
}
export function dragleaveHandler(zoneId) {
    return function (ev) {
        document.getElementById(zoneId).classList.remove('bg-active-dropzone')
        document.getElementById(zoneId).classList.remove('bg-inactive-dropzone')
        ev.dataTransfer.dropEffect = 'move'
    }
}
//  TASK ITEMS drag and drop event handlers
export function dragstartHandler(ev) {
    // Add the target element's id to the data transfer object
    // console.log(`🎈 :`, ev.target.id)
    ev.dataTransfer.setData('application/my-app', ev.target.id)
    ev.dataTransfer.dropEffect = 'move'
}

export function zoneHasSpace(zoneId) {
    const zone = document.getElementById(zoneId)
    return (zoneId !== 'now' && zoneId !== 'next') || zone.childElementCount === 1
}