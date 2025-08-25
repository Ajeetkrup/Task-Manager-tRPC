import { useState } from "react";
import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { queryClient, trpc } from "./utils/trpc";

interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
  timeStamp: string;
}

interface FormData {
  name: string;
  description: string;
  status: string;
}

interface EditingTask {
  [key: string]: Task;
}

function TaskManager() {
  const [editingTask, setEditingTask] = useState<EditingTask | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    status: "",
  });

  const utils = trpc.useUtils();

  const { data: tasks = [], isLoading, error } = trpc.getAllTasks.useQuery();

  const addTaskMutation = trpc.addTask.useMutation({
    onSuccess: () => {
      utils.getAllTasks.invalidate();
      setFormData({ name: "", description: "", status: "" });
    },
    onError: (error: { message: string }) => {
      alert(`Failed to add task: ${error.message}`);
    },
  });

  const updateTaskMutation = trpc.updateTask.useMutation({
    onSuccess: () => {
      utils.getAllTasks.invalidate();
      setEditingTask(null);
    },
    onError: (error: { message: string }) => {
      alert(`Failed to update task: ${error.message}`);
    },
  });

  const deleteTaskMutation = trpc.deleteTask.useMutation({
    onSuccess: () => {
      utils.getAllTasks.invalidate();
    },
    onError: (error: { message: string }) => {
      alert(`Failed to delete task: ${error.message}`);
    },
  });

  const handleAddTask = (): void => {
    if (!formData.name || !formData.description) {
      alert("Please fill in all fields");
      return;
    }

    addTaskMutation.mutate({
      name: formData.name,
      description: formData.description,
      status: formData.status,
    });
  };

  const handleUpdateTask = (id: string): void => {
    if (!editingTask || !editingTask[id]) return;

    const task = editingTask[id];
    updateTaskMutation.mutate({
      id,
      name: task.name,
      description: task.description,
      status: task.status,
    });
  };

  const handleDeleteTask = (id: string): void => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    deleteTaskMutation.mutate({ id });
  };

  const startEdit = (task: Task): void => {
    setEditingTask({
      [task.id]: { ...task },
    });
  };

  const updateEditField = (
    id: string,
    field: keyof Task,
    value: string
  ): void => {
    if (!editingTask) return;

    setEditingTask({
      ...editingTask,
      [id]: {
        ...editingTask[id],
        [field]: value,
      },
    });
  };

  if (isLoading) return <div className="loading">Loading tasks...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>📋 Task Manager</h1>
        <p>Manage your tasks efficiently with tRPC</p>
      </div>

      {error && <div className="error">⚠️ {error.message}</div>}

      <div className="task-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Task Name</label>
            <input
              type="text"
              placeholder="Enter task name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFormData({
                  ...formData,
                  status: e.target.value as FormData["status"],
                })
              }
            >
              <option value="">Select Status</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <button
            className="btn btn-add"
            onClick={handleAddTask}
            disabled={addTaskMutation.isPending}
          >
            {addTaskMutation.isPending ? "Adding..." : "➕ Add Task"}
          </button>
        </div>
      </div>

      <div className="tasks-grid">
        {tasks.map((task: Task) => (
          <div
            key={task.id}
            className={`task-card status-${task.status
              .toLowerCase()
              .replace(" ", "-")}`}
          >
            <div className="task-header">
              <h3 className="task-title">{task.name}</h3>
              <span
                className={`task-status status-${task.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {task.status}
              </span>
            </div>
            <p className="task-description">{task.description}</p>

            {editingTask && editingTask[task.id] ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editingTask[task.id].name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateEditField(task.id, "name", e.target.value)
                  }
                />
                <input
                  type="text"
                  value={editingTask[task.id].description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateEditField(task.id, "description", e.target.value)
                  }
                />
                <select
                  value={editingTask[task.id].status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    updateEditField(task.id, "status", e.target.value)
                  }
                >
                  <option value="">Select Status</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <div className="edit-actions">
                  <button
                    className="btn btn-save"
                    onClick={() => handleUpdateTask(task.id)}
                    disabled={updateTaskMutation.isPending}
                  >
                    {updateTaskMutation.isPending ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="btn btn-cancel"
                    onClick={() => setEditingTask(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="task-footer">
                <span className="task-timestamp">📅 {task.timeStamp}</span>
                <div className="task-actions">
                  <button
                    className="btn-icon btn-edit"
                    onClick={() => startEdit(task)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-delete"
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deleteTaskMutation.isPending}
                  >
                    {deleteTaskMutation.isPending ? "🔄" : "🗑️"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:4000/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TaskManager />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
