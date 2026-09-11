const Task = require("../models/task");


const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id
        });

        if (tasks.length === 0) {
            return res.status(404).json({
                message: "Tasks not found"
            });
        }

        res.status(200).json({
            message: "Success",
            tasks
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};



const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Success",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};



const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        console.log("BODY:", req.body);
        console.log("TITLE:", title);
        console.log("DESCRIPTION:", description);

        // Validation
        if (!title?.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        if (!description?.trim()) {
            return res.status(400).json({
                message: "Description is required"
            });
        }

        if (priority && !["low", "medium", "high"].includes(priority)) {
            return res.status(400).json({
                message: "Priority must be low, medium, or high"
            });
        }

        if (dueDate && isNaN(new Date(dueDate).getTime())) {
            return res.status(400).json({
                message: "Invalid due date"
            });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            user: req.user.id
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


const updateTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed } = req.body;

        // Validation
        if (title !== undefined && !title.trim()) {
            return res.status(400).json({
                message: "Title cannot be empty"
            });
        }

        if (description !== undefined && !description.trim()) {
            return res.status(400).json({
                message: "Description cannot be empty"
            });
        }

        if (
            priority !== undefined &&
            !["low", "medium", "high"].includes(priority)
        ) {
            return res.status(400).json({
                message: "Priority must be low, medium, or high"
            });
        }

        if (
            dueDate !== undefined &&
            isNaN(new Date(dueDate).getTime())
        ) {
            return res.status(400).json({
                message: "Invalid due date"
            });
        }

        if (
            completed !== undefined &&
            typeof completed !== "boolean"
        ) {
            return res.status(400).json({
                message: "Completed must be true or false"
            });
        }

        const updates = {};

        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (priority !== undefined) updates.priority = priority;
        if (dueDate !== undefined) updates.dueDate = dueDate;
        if (completed !== undefined) updates.completed = completed;

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};


module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};