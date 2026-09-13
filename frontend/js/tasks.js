const loadTasksBtn = document.getElementById("loadTasksBtn");
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}
const tasksContainer = document.getElementById("tasksContainer");

const createTaskBtn = document.getElementById("createTaskBtn");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const priorityInput = document.getElementById("priority");
const dueDateInput = document.getElementById("dueDate");




createTaskBtn.addEventListener("click", async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        return;
    }

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const priority = priorityInput.value;
    const dueDate = dueDateInput.value;

    if (!title) {
        alert("Please enter task title");
        return;
    }

    if (!description) {
        alert("Please enter task description");
        return;
    }

    try {

        const response = await fetch(
           "https://task-manegment-system.onrender.com/task",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    title,
                    description,
                    priority,
                    dueDate: dueDate || null
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to create task");
            return;
        }

        alert("Task created successfully ✅");

        titleInput.value = "";
        descriptionInput.value = "";
        priorityInput.value = "medium";
        dueDateInput.value = "";

    } catch (error) {

        console.error(error);
        alert("Server connection failed");

    }

});





loadTasksBtn.addEventListener("click", async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/task",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Failed to load tasks");
            return;
        }

        tasksContainer.innerHTML = "";


        

        data.tasks.forEach(task => {

            const taskElement =
                document.createElement("div");

            taskElement.innerHTML = `

                <h3>${task.title}</h3>

                <p>${task.description}</p>

                <p>
                    Priority: ${task.priority}
                </p>

                <p class="task-status">
    Status:
    <span class="${
        task.completed
        ? "completed"
        : "pending"
    }">
        ${
            task.completed
            ? "Completed ✅"
            : "Pending ⏳"
        }
    </span>
</p>

                ${
                    task.dueDate
                    ? `
                        <p>
                            Due Date:
                            ${new Date(
                                task.dueDate
                            ).toLocaleDateString()}
                        </p>
                    `
                    : ""
                }

                <button
                    class="edit-btn"
                    data-id="${task._id}"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${task._id}"
                >
                    Delete
                </button>

                <button
                    class="complete-btn"
                    data-id="${task._id}"
                >
                    ${
                        task.completed
                        ? "Mark Pending"
                        : "Complete"
                    }
                </button>

                <hr>
            `;

            tasksContainer.appendChild(taskElement);

        });


     
        

        const editButtons =
            document.querySelectorAll(".edit-btn");

        editButtons.forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const taskId =
                        button.dataset.id;

                    const newTitle =
                        prompt("Enter new title:");

                    if (newTitle === null) {
                        return;
                    }

                    const newDescription =
                        prompt(
                            "Enter new description:"
                        );

                    if (newDescription === null) {
                        return;
                    }

                    const newPriority =
                        prompt(
                            "Enter priority: low, medium, or high",
                            "medium"
                        );

                    if (newPriority === null) {
                        return;
                    }

                    if (
                        newPriority !== "low" &&
                        newPriority !== "medium" &&
                        newPriority !== "high"
                    ) {

                        alert("Invalid priority");
                        return;

                    }

                    try {

                        const updateResponse =
                            await fetch(
                                `http://localhost:5000/task/${taskId}`,
                                {
                                    method: "PUT",

                                    headers: {
                                        "Content-Type":
                                            "application/json",

                                        "Authorization":
                                            `Bearer ${token}`
                                    },

                                    body: JSON.stringify({
                                        title: newTitle,
                                        description:
                                            newDescription,
                                        priority:
                                            newPriority
                                    })
                                }
                            );

                        const updateData =
                            await updateResponse.json();

                        if (!updateResponse.ok) {

                            alert(
                                updateData.message ||
                                "Failed to update task"
                            );

                            return;

                        }

                        alert(
                            "Task updated successfully ✅"
                        );

                        loadTasksBtn.click();

                    } catch (error) {

                        console.error(error);
                        alert(
                            "Server connection failed"
                        );

                    }

                }
            );

        });


    
        

        const deleteButtons =
            document.querySelectorAll(".delete-btn");

        deleteButtons.forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const taskId =
                        button.dataset.id;

                    const confirmDelete =
                        confirm(
                            "Are you sure you want to delete this task?"
                        );

                    if (!confirmDelete) {
                        return;
                    }

                    try {

                        const deleteResponse =
                            await fetch(
                                `http://localhost:5000/task/${taskId}`,
                                {
                                    method: "DELETE",

                                    headers: {
                                        "Authorization":
                                            `Bearer ${token}`
                                    }
                                }
                            );

                        const deleteData =
                            await deleteResponse.json();

                        if (!deleteResponse.ok) {

                            alert(
                                deleteData.message ||
                                "Failed to delete task"
                            );

                            return;

                        }

                        alert(
                            "Task deleted successfully ✅"
                        );

                        loadTasksBtn.click();

                    } catch (error) {

                        console.error(error);
                        alert(
                            "Server connection failed"
                        );

                    }

                }
            );

        });


        
        

        const completeButtons =
            document.querySelectorAll(".complete-btn");

        completeButtons.forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const taskId =
                        button.dataset.id;

                    const currentTask =
                        data.tasks.find(
                            task => task._id === taskId
                        );

                    if (!currentTask) {

                        alert("Task not found");
                        return;

                    }

                    try {

                        const response =
                            await fetch(
                                `http://localhost:5000/task/${taskId}`,
                                {
                                    method: "PUT",

                                    headers: {
                                        "Content-Type":
                                            "application/json",

                                        "Authorization":
                                            `Bearer ${token}`
                                    },

                                    body: JSON.stringify({
                                        completed:
                                            !currentTask.completed
                                    })
                                }
                            );

                        const result =
                            await response.json();

                        if (!response.ok) {

                            alert(
                                result.message ||
                                "Failed to update task status"
                            );

                            return;

                        }

                        alert(
                            "Task status updated ✅"
                        );

                        loadTasksBtn.click();

                    } catch (error) {

                        console.error(error);

                        alert(
                            "Server connection failed"
                        );

                    }

                }
            );

        });

    } catch (error) {

        console.error(error);

        alert("Server connection failed");

    }

});


const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", (event) => {

    event.preventDefault();

    localStorage.removeItem("token");

    alert("Logged out successfully 👋");

    window.location.href = "login.html";

});