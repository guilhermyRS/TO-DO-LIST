const { List, Task, Step } = require('./models');

class ListController {
    static async renderLists(req, res) {
        try {
            const lists = await List.findAll();
            res.render('lists', { lists });
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao carregar listas', 
                error: error.message 
            });
        }
    }

    static async renderListDetails(req, res) {
        try {
            const listId = req.params.id;
            const list = await List.findById(listId);
            const tasks = await Task.findByListId(listId);
            
            res.render('list-details', { 
                list, 
                tasks,
                formatProgress: (progress) => progress.toFixed(0)
            });
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao carregar detalhes da lista', 
                error: error.message 
            });
        }
    }

    static async createList(req, res) {
        try {
            const { name } = req.body;
            await List.create(name);
            res.redirect('/');
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao criar lista', 
                error: error.message 
            });
        }
    }

    static async updateList(req, res) {
        try {
            const listId = req.params.id;
            const { name } = req.body;
            await List.update(listId, { name });
            res.redirect(`/lists/${listId}`);
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao atualizar lista', 
                error: error.message 
            });
        }
    }

    static async deleteList(req, res) {
        try {
            const listId = req.params.id;
            await List.delete(listId);
            res.redirect('/');
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao excluir lista', 
                error: error.message 
            });
        }
    }
}

class TaskController {
    static async renderTaskDetails(req, res) {
        try {
            const taskId = req.params.id;
            const task = await Task.findById(taskId);
            const steps = await Step.findByTaskId(taskId);
            
            res.render('task-details', { 
                task, 
                steps,
                formatProgress: (progress) => progress.toFixed(0)
            });
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao carregar detalhes da tarefa', 
                error: error.message 
            });
        }
    }

    static async createTask(req, res) {
        try {
            const { listId, name, description } = req.body;
            const task = await Task.create(listId, name, description);
            res.redirect(`/lists/${listId}`);
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao criar tarefa', 
                error: error.message 
            });
        }
    }

    static async updateTask(req, res) {
        try {
            const taskId = req.params.id;
            const { name, description } = req.body;
            const task = await Task.update(taskId, { name, description });
            res.redirect(`/tasks/${taskId}`);
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao atualizar tarefa', 
                error: error.message 
            });
        }
    }

    static async toggleTaskCompletion(req, res) {
        try {
            const taskId = req.params.id;
            const task = await Task.findById(taskId);
            const updatedTask = await Task.update(taskId, { 
                is_completed: !task.is_completed 
            });
            res.redirect(`/tasks/${taskId}`);
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao atualizar status da tarefa', 
                error: error.message 
            });
        }
    }

    static async deleteTask(req, res) {
        try {
            const taskId = req.params.id;
            const task = await Task.findById(taskId);
            await Task.delete(taskId);
            res.redirect(`/lists/${task.list_id}`);
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao excluir tarefa', 
                error: error.message 
            });
        }
    }
}

class StepController {
    static async createStep(req, res) {
        try {
            const { taskId, name } = req.body;
            const step = await Step.create(taskId, name);
            res.redirect(`/tasks/${taskId}`);
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao criar etapa', 
                error: error.message 
            });
        }
    }

    static async toggleStepCompletion(req, res) {
        try {
            const stepId = req.params.id;
            const step = await Step.findById(stepId);
            await Step.update(stepId, { 
                is_completed: !step.is_completed 
            });
            res.redirect(`/tasks/${step.task_id}`);
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao atualizar status da etapa', 
                error: error.message 
            });
        }
    }

    static async deleteStep(req, res) {
        try {
            const stepId = req.params.id;
            const step = await Step.findById(stepId);
            await Step.delete(stepId);
            res.redirect(`/tasks/${step.task_id}`);
        } catch (error) {
            res.status(500).render('error', { 
                message: 'Erro ao excluir etapa', 
                error: error.message 
            });
        }
    }
}

module.exports = { ListController, TaskController, StepController };