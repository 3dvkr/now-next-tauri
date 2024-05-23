import { inputSubmitReset, createItem, clearItems } from "./tasks.js"

import {
  dropzones,
  dragleaveHandler,
  dragoverHandler,
  dropzoneHandler,
} from "./dropzone.js"
import { getWorkSessions, getTasks } from "./tauri.js";

const { invoke } = window.__TAURI__.tauri;

const clearBtn = document.getElementById('clear-items')
clearBtn.addEventListener('click', async () => {
  clearItems()
  await invoke('clear_all')
  getWorkSessions()
  getTasks()
})

dropzones.forEach((zone) => {
  // make active drop zones
  console.log(zone)
  zone.addEventListener('drop', dropzoneHandler(zone.id))
  zone.addEventListener('dragleave', dragleaveHandler(zone.id))
  zone.addEventListener('dragover', dragoverHandler(zone.id))
})

async function calculateDuration(taskId) {
  try {
    const duration = await invoke('calculate_duration', { taskId });
    console.log(`Duration: ${duration} seconds`);
    return duration;
  } catch (error) {
    console.error('Failed to calculate duration:', error);
  }
}

// event listeners
// document.querySelector('#get-tasks').addEventListener('click', getTasks);
// document.querySelector('#add-task').addEventListener('click', () => addTask(1, 'Sample Task'));
// document.querySelector('#get-work-sessions').addEventListener('click', getWorkSessions);
// document.querySelector('#start-work-session').addEventListener('click', () => startWorkSession(1, true));
// document.querySelector('#end-work-session').addEventListener('click', () => endWorkSession(1));
// document.querySelector('#calculate-duration').addEventListener('click', () => calculateDuration(1));

function dropHandler(e) {
  console.log(`🎈 drop, e:`,  e)
  e.dataTransfer.setData('application/my-app', e.target.id)
}

// adding tasks functionality
const form = document.querySelector('form')
form.addEventListener('submit', (e) => {
  console.log("form submit")
  e.preventDefault()
  inputSubmitReset()
})

