// const { invoke } = window.__TAURI__.tauri;

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
