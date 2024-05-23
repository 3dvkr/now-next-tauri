import {
    dropzones,
    dragstartHandler,
    zoneHasSpace
} from "./dropzone.js"
import { addTask, getTasks, getWorkSessions, startWorkSession } from "./tauri.js"

export const createItem = itemHandler()

export function inputSubmitReset() {
    const str = document.getElementById('new-item').value
    document.getElementById('new-item').focus()
    if (str && str !== '') createItem('today')(str)
    document.getElementById('new-item').value = ''
}

function itemHandler() {
    let count = -1
    return (zoneId) => (str) => {
        const newItem = document.createElement('p')
        const newItemText = document.createTextNode(str)
        newItem.appendChild(newItemText)

        Object.assign(newItem, {
            draggable: true,
            tabIndex: 0,
            id: 'p' + ++count,
        })
        newItem.classList.add('task-item')
        newItem.addEventListener('dragstart', dragstartHandler)
        newItem.addEventListener('dragover', (e) => {
            e.preventDefault()
            e.stopPropagation()
            e.dataTransfer.dropEffect = 'move'
        })
        newItem.addEventListener('dragleave', (e) => {
            e.preventDefault()
            e.stopPropagation()
            e.dataTransfer.dropEffect = 'move'
        })
        newItem.addEventListener('drop', (e) => {
            e.preventDefault()
            e.stopPropagation()
            if (zoneHasSpace(e.target.parentElement.id)) {
                const data = e.dataTransfer.getData('application/my-app')
                e.currentTarget.insertAdjacentElement(
                    'afterend',
                    document.getElementById(data)
                )
            }
        })
        document.getElementById(zoneId).appendChild(newItem)
        addTask(count, str)
        getTasks() //comment
        startWorkSession(count, false)
        getWorkSessions() // comment
    }
}

export function clearItems(zoneId = 'all') {
    if (zoneId === 'all') {
        dropzones.forEach((zone) => {
            while (zone.children.length !== 1) {
                zone.lastChild.remove()
            }
            localStorage.setItem('now-and-next-' + zone.id, null)
        })
    } else {
        let keyPrefix = 'now-and-next-'
        localStorage.setItem(keyPrefix + zoneId, null)

        const zone = document.getElementById(zoneId)
        while (zone.children.length !== 1) {
            zone.lastChild.remove()
        }
    }
}