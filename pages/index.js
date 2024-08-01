import { useEffect, useState } from "react";
import { getAPI, postAPI, putAPI, deleteAPI } from "@/services/fetchAPI";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      const data = await getAPI("/api/get");
      if (data && data.status === "success") {
        setTodos(data.data);
      }
    }
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await postAPI("/api/post", { task: newTodo, isCompleted: false });
      setNewTodo("");
      // Refresh the list
      const data = await getAPI("/api/get");
      if (data && data.status === "success") {
        setTodos(data.data);
      }
    }
  };

  const handleUpdateTodo = async (id, updatedTask) => {
    await putAPI(`/api/put/${id}`, { task: updatedTask });
    // Refresh the list
    const data = await getAPI("/api/get");
    if (data && data.status === "success") {
      setTodos(data.data);
    }
  };

  const handleDeleteTodo = async (id) => {
    await deleteAPI(`/api/delete/${id}`);
    // Refresh the list
    const data = await getAPI("/api/get");
    if (data && data.status === "success") {
      setTodos(data.data);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Todo List</h1>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="p-2 border rounded bg-white text-black shadow-md"
          placeholder="Add a new todo"
        />
        <button
          onClick={handleAddTodo}
          className="ml-2 p-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-600"
        >
          Add Todo
        </button>
      </div>
      <ul className="w-full max-w-md">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-2 bg-white rounded shadow mb-2"
          >
            <span className={`${todo.isCompleted ? "line-through" : ""}`}>
              {todo.task}
            </span>
            <div className="flex items-center">
              <button
                onClick={() =>
                  handleUpdateTodo(todo.id, prompt("Update task", todo.task))
                }
                className="ml-2 p-2 bg-yellow-500 text-white rounded shadow-md hover:bg-yellow-600"
              >
                Update
              </button>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="ml-2 p-2 bg-red-500 text-white rounded shadow-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
