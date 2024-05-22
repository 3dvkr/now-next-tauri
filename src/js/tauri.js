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
export async function endWorkSession(taskId) {
    try {
        await invoke('end_work_session', { taskId });
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