import "./App.css";
import React, { useEffect, useId, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
export default function App() {
  let [idState, setIdState] = useState(1);
  let [inputValue, SetinputValue] = useState("");
  let [TaskObject, setTaskObject] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState({});

  function handleValue(e) {
    SetinputValue(e.target.value);
  }

  function handleClick(e) {
    e.preventDefault();
    let myObject = { id: uuidv4(), title: inputValue, finished: false };
    setTaskObject([...TaskObject, myObject]);
    localStorage.setItem(
      "ArrayToStorage",
      JSON.stringify([...TaskObject, myObject])
    );
    setIdState(++idState);
  }

  async function handleEdit(id) {
    const { value: Data } = await Swal.fire({
      input: "text",
      inputLabel: "title",
      inputValue: TaskObject[id - 1].title,
      inputPlaceholder: "Enter new Title",
    });
    if (Data) {
      TaskObject[id - 1].title = Data;
      setTaskObject(TaskObject);
      localStorage.setItem("ArrayToStorage", JSON.stringify([...TaskObject]));
      handleLocal();
    }
  }
  function handleDelete(id) {
    console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        TaskObject = TaskObject.filter((e) => {
          return e.id !== id;
        });
        setTaskObject(TaskObject);
        localStorage.setItem("ArrayToStorage", JSON.stringify([...TaskObject]));
        handleLocal();
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  }
  function handleLocal() {
    if (localStorage.getItem("ArrayToStorage")) {
      setTaskObject(JSON.parse(localStorage.getItem("ArrayToStorage")));
    }
  }
  function handleFinished(e, id) {
    const isChecked = e.target.checked;
    const updatedFinishedTasks = { ...finishedTasks, [id]: isChecked };
    setFinishedTasks(updatedFinishedTasks);

    const updatedTaskObjects = TaskObject.map((task) => {
      if (task.id === id) {
        return { ...task, finished: isChecked };
      }
      return task;
    });
    setTaskObject(updatedTaskObjects);
    localStorage.setItem("ArrayToStorage", JSON.stringify(updatedTaskObjects));
  }
  useEffect(() => {
    handleLocal();
  }, []);

  useEffect(() => {
    let todos = document.querySelectorAll(".todo");
    let arrayEntries = todos.entries();
    for (const [index, element] of arrayEntries) {
      if (TaskObject[index].finished) {
        element.classList.add("finished");
      }
    }
  }, [TaskObject]);
  return (
    <div className="todo-container">
      <h1>
        <span className="second-title">Todo List App</span>
      </h1>
      <form>
        <input
          classnName="add-task"
          type="text"
          placeholder="Add new task ..."
          onChange={(e) => handleValue(e)}
        />
        <button
          type="submit"
          className="add-button"
          onClick={(e) => handleClick(e)}
        >
          Add
        </button>
      </form>
      {TaskObject.map((ele, index) => {
        return (
          <div
            className={`todo ${finishedTasks[ele.id] ? "finished" : ""}`}
            key={index}
          >
            <div className="todo-text">
              <input
                className={`checkbox ${ele.finished ? "disapear" : ""} `}
                type="checkbox"
                id="isCompleted"
                // checked={ele.finished ? true : false}
                onChange={(e) => handleFinished(e, ele.id)}
              />
            </div>
            <div className="title">{ele.title}</div>
            <div className="todo-actions">
              <button
                className="submit-edits"
                onClick={() => handleEdit(index + 1)}
              >
                Edit
              </button>
              <button
                className="submit-edits"
                onClick={() => handleDelete(ele.id)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
