import { useState, useEffect } from "react";
import "./App.css";
import TodoItem from './TodoItem.jsx'
import LoginForm from './LoginForm.jsx';
import TodoList from './TodoList.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute.jsx";

function App() {
  const TODOLIST_API_URL = "http://127.0.0.1:5000/api/todos/";
  const TODOLIST_LOGIN_URL = 'http://127.0.0.1:5000/api/login/';
  async function toggleDone(id) {
    const toggle_api_url = `${TODOLIST_API_URL}${id}/toggle/`;
    try {
      const response = await fetch(toggle_api_url, {
        method: "PATCH",
      });
      if (response.ok) {
        const updatedTodo = await response.json();
        setTodoList(
          todoList.map((todo) => (todo.id === id ? updatedTodo : todo)),
        );
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  }

  async function addNewTodo() {
    try {
      const response = await fetch(TODOLIST_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });
      if (response.ok) {
        const newTodo = await response.json();
        setTodoList([...todoList, newTodo]);
        setNewTitle("");
      }
    } catch (error) {
      console.error("Error adding new todo:", error);
    }
  }

  async function deleteTodo(id) {
    const delete_api_url = `${TODOLIST_API_URL}${id}/`;
    try {
      const response = await fetch(delete_api_url, {
        method: "DELETE",
      });
      if (response.ok) {
        setTodoList(todoList.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  }
  async function addNewComment(todoId, newComment) {
    try {
      const url = `${TODOLIST_API_URL}${todoId}/comments/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'message': newComment }),
      });
      if (response.ok) {
        await fetchTodoList();
      }
    } catch (error) {
      console.error("Error adding new comment:", error);
    }
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <TodoList apiUrl={TODOLIST_API_URL}/>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/about" 
            element={
              <>
                <h1>About</h1>
                <p>This is a simple todo list application built with React and Flask.</p>
                <a href="/">Back to Home</a>
              </>
            } 
          />
          <Route
            path="/login"
            element={
              <LoginForm loginUrl={TODOLIST_LOGIN_URL} />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
