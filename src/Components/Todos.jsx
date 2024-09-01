import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import TodoItem from "./TodoItem";

const Todos = () => {
  const [todos, setTodos] = useState([]);

  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("userId"));

  const fetchTodos = async () => {
    const response = await fetch(
      `http://localhost:3000/todos?userId=${userId}`
    );
    const data = await response.json();
    setTodos(data.reverse());
  };

  if (!userId) navigate("/sign-in");

  useEffect(() => {
    fetchTodos();
  }, []);

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });

    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  const completeTodo = async (todo) => {
    await fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "PATCH",
      "Content-Type": "application-json",
      body: JSON.stringify({ isCompleted: !todo.isCompleted }),
    });

    const editedTodo = todos.find((todoItem) => todoItem.id !== todo.id);
    editedTodo.isCompleted = !editedTodo.isCompleted;

    setTodos(editedTodo);
  };

  return (
    <div>
      <ul className="mt-12 max-w-4xl mx-auto">
        {todos.length === 0 && (
          <p className="text-center text-gray-900 text-sm font-bold">
            Add some todos
          </p>
        )}
        {todos.map((todo) => {
          return (
            <TodoItem
              todo={todo}
              deleteTodo={deleteTodo}
              completeTodo={completeTodo}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Todos;
