// const { invoke } = window.__TAURI__.tauri;

// converting Rust state to client-side:
class Task {
    constructor(id, memo) {
        this.id = id
        this.memo = memo
    }
}
class WorkSession {
    constructor(taskId, isActive) {
        this.taskId = taskId
        this.start = new Date()
        this.stop = null
        this.isActive = isActive
        this.isLatest = true
    }
}
const workSessions = new Array()
const tasks = new Array()
// WORK SESSIONS
export async function getWorkSessions() {
    try {
        // const workSessions = await invoke('get_work_sessions');
        console.log('Work sessions:', workSessions);
        return workSessions;
    } catch (error) {
        console.error('Failed to get work sessions:', error);
    }
}
export async function startWorkSession(taskId, isActive) {
    createWorkSessionDivs(1)
    try {
        // await invoke('start_work_session', { taskId, isActive });
        workSessions.push(new WorkSession(taskId, isActive))
        console.log('Work session added');
    } catch (error) {
        console.error('Failed to start work session:', error);
    }
}
export async function endWorkSession(taskId, isComplete) {
    createWorkSessionDivs(1)
    try {
        // await invoke('end_work_session', { taskId, isComplete })
        const idx = workSessions.findIndex(obj => obj.taskId === taskId && obj.isLatest === true)
        console.log(workSessions[idx], idx)
        workSessions[idx].stop = new Date()
        workSessions[idx].isLatest = isComplete    
        console.log('Work session ended');
    } catch (error) {
        console.error('Failed to end work session:', error);
    }
}
// TASKS
export async function getTasks() {
    try {
        // const tasks = await invoke('get_tasks');
        console.log('Tasks:', tasks);
        return tasks;
    } catch (error) {
        console.error('Failed to get tasks:', error);
    }
}
export async function addTask(id, memo) {
    try {
        // await invoke('add_task', { id, memo });
        tasks.push(new Task(id, memo))
        console.log('Task added');
    } catch (error) {
        console.error('Failed to add task:', error);
    }
}

// SUMMARY
export function createWorkSessionDivs() {
        // const workSessions = await invoke('get_sessions_duration');
        // const tasks = await invoke('get_tasks')
        document.getElementById('summary').innerHTML = `<h2>Completed Sessions Summary</h2>`

        const workDisplayData = workSessions.map(s => {
            const memo = tasks.filter(t => t.id === s.taskId)[0].memo
            const duration = Math.abs((s.stop - s.start) / 1000)
            return ({
                taskId : s.taskId,
                taskMemo: memo,
                isActive: s.isActive,
                duration
            })
        })

        console.log('Work sessions with duration:', workDisplayData);

        workDisplayData.forEach(session => {
            console.log(session)
            const minutes = session.duration / 60;

            const div = document.createElement('div');
            div.style.height = `${Math.max(Math.min(minutes * 2, 100), 20)}px`;
            div.style.width = 'auto';
            div.style.padding = '0.15em 0.3em';
            div.style.outline = '1px solid lightgray';
            div.style.color = session.isActive ? 'inherit' : 'gray';
            div.style.marginBottom = '10px';
            div.innerText = `Task: ${session.taskMemo}, ${(minutes).toFixed(2)} min`;
            document.getElementById('summary').appendChild(div);
        });
        document.getElementById('summary').innerHTML += `<p>${JSON.stringify(workDisplayData, null, 2)}</p>`
}

createWorkSessionDivs(1)