const { invoke } = window.__TAURI__.tauri;

// WORK SESSIONS
export async function getWorkSessions() {
    try {
        const workSessions = await invoke('get_work_sessions');
        console.log('Work sessions:', workSessions);
        return workSessions;
    } catch (error) {
        console.error('Failed to get work sessions:', error);
    }
}
export async function startWorkSession(taskId, isActive) {
    try {
        await invoke('start_work_session', { taskId, isActive });
        console.log('Work session added');
    } catch (error) {
        console.error('Failed to start work session:', error);
    }
}
export async function endWorkSession(taskId, isComplete) {
    try {
        await invoke('end_work_session', { taskId, isComplete });
        console.log('Work session ended');
    } catch (error) {
        console.error('Failed to end work session:', error);
    }
}
// TASKS
export async function getTasks() {
    try {
        const tasks = await invoke('get_tasks');
        console.log('Tasks:', tasks);
        return tasks;
    } catch (error) {
        console.error('Failed to get tasks:', error);
    }
}
export async function addTask(id, memo) {
    try {
        await invoke('add_task', { id, memo });
        console.log('Task added');
    } catch (error) {
        console.error('Failed to add task:', error);
    }
}

// SUMMARY
async function createWorkSessionDivs(secondsPerPixel = 1) {
    try {
        const workSessions = await invoke('get_sessions_duration');
        // const tasks = await invoke('get_tasks')
        // document.getElementById('summary').innerHTML += `<p>${JSON.stringify(tasks)}</p>`
        if (workSessions.length === 0) {
            throw new Error('no sessions')
        }
        console.log('Work sessions with duration:', workSessions);

        workSessions.forEach(session => {
            console.log(session)
            const durationInSeconds = session.duration_in_seconds;
            const heightInPixels = durationInSeconds / secondsPerPixel;

            const div = document.createElement('div');
            div.style.height = `${Math.max(Math.min(heightInPixels * 2, 100), 20)}px`;
            div.style.width = 'auto';
            div.style.padding = '0.15em 0.3em';
            div.style.outline = '1px solid lightgray';
            div.style.color = session.is_active ? 'inherit' : 'gray';
            div.style.marginBottom = '10px';
            div.innerText = `Task: ${session.task_memo}, ${(durationInSeconds / 60).toFixed(2)} min`;
            document.getElementById('summary').appendChild(div);
        });
    } catch (error) {
        console.error('Failed to get work sessions:', error);
        document.getElementById('summary').innerHTML += `<p>No sessions found</p>`
        document.getElementById('summary').innerHTML += `<p>${JSON.stringify(workSessions)}</p>`
    }
}

createWorkSessionDivs(11);