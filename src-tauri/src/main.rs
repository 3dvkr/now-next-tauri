// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

use tauri::generate_handler;

// Define a struct for Task
#[derive(Debug, Clone, Serialize, Deserialize)]
struct Task {
    id: usize,
    memo: String,
}

// Define a struct for WorkSession
#[derive(Debug, Clone, Serialize, Deserialize)]
struct WorkSession {
    task_id: usize,
    start_time: DateTime<Utc>,
    stop_time: Option<DateTime<Utc>>,
    is_active: bool,
    is_latest: bool,
}

// Define the application state to hold tasks and work sessions
struct MyState {
    tasks: Mutex<Vec<Task>>,
    work_sessions: Mutex<Vec<WorkSession>>,
}

// Initialize the state
impl MyState {
    fn new() -> Self {
        Self {
            tasks: Mutex::new(Vec::new()),
            work_sessions: Mutex::new(Vec::new()),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
struct WorkSessionWithDuration {
    task_id: usize,
    task_memo: String,
    is_active: bool,
    duration_in_seconds: i64,
}

// Command to get all tasks
#[tauri::command]
fn get_tasks(state: State<'_, MyState>) -> Vec<Task> {
    state.tasks.lock().unwrap().clone()
}

// Command to add a task
#[tauri::command]
fn add_task(state: State<'_, MyState>, id: usize, memo: String) {
    let mut tasks = state.tasks.lock().unwrap();
    tasks.push(Task { id, memo });
}

// Command to get all work sessions
#[tauri::command]
fn get_work_sessions(state: State<'_, MyState>) -> Vec<WorkSession> {
    state.work_sessions.lock().unwrap().clone()
}


#[tauri::command]
fn get_sessions_duration(state: State<'_, MyState>) -> Result<Vec<WorkSessionWithDuration>, String> {
    let work_sessions = state.work_sessions.lock().unwrap();
    let tasks = state.tasks.lock().unwrap();
    let mut sessions_with_duration = Vec::new();

    for session in work_sessions.iter() {
        let duration_in_seconds = if let Some(stop_time) = session.stop_time {
            stop_time.signed_duration_since(session.start_time).num_seconds()
        } else {
            // Set duration to 10 minutes (600 seconds) if stop_time is None
            600
        };

        if let Some(task) = tasks.iter().find(|t| t.id == session.task_id) {
            sessions_with_duration.push(WorkSessionWithDuration {
                task_id: session.task_id,
                is_active: session.is_active,
                duration_in_seconds,
                task_memo: task.memo.clone(),
            });
        }
    }

    Ok(sessions_with_duration)
}

// Command to add a work session
#[tauri::command]
fn start_work_session(
    state: State<'_, MyState>,
    task_id: usize,
    is_active: bool
) -> Result<(), String> {
    let start_time = Utc::now();
    let mut work_sessions = state.work_sessions.lock().unwrap();
    // Set is_latest to false for existing sessions of the same task
    for ws in work_sessions.iter_mut() {
        if ws.task_id == task_id {
            ws.is_latest = false;
        }
    }
    work_sessions.push(WorkSession { 
        task_id, 
        start_time, 
        stop_time: None, 
        is_active, 
        is_latest: true 
    });
    Ok(())
}
// Command to end a work session
#[tauri::command]
fn end_work_session(
    state: State<'_, MyState>, 
    task_id: usize,
    is_complete: bool
) -> Result<(), String> {
    let stop_time = Utc::now();
    let mut work_sessions = state.work_sessions.lock().unwrap();

    if let Some(work_session) = work_sessions.iter_mut().find(|ws| ws.task_id == task_id && ws.is_latest) {
        work_session.stop_time = Some(stop_time);
        work_session.is_latest = is_complete;
    }
    // No error is thrown if no matching work session is found
    Ok(())
}

#[tauri::command]
fn clear_all(state: State<'_, MyState>) -> Result<(), String> {
    let mut tasks = state.tasks.lock().unwrap();
    let mut work_sessions = state.work_sessions.lock().unwrap();

    // Clear tasks
    tasks.clear();

    // Clear work sessions
    work_sessions.clear();

    Ok(())
}


fn main() {
    tauri::Builder::default()
        .manage(MyState::new())
        .invoke_handler(generate_handler![
            get_tasks,
            add_task,
            get_work_sessions,
            start_work_session,
            end_work_session,
            get_sessions_duration,
            clear_all
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
