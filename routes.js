const express = require('express');
const router = express.Router();
const { ListController, TaskController, StepController } = require('./controllers');

// Rotas para Listas
router.get('/', ListController.renderLists);
router.get('/lists/:id', ListController.renderListDetails);
router.post('/lists', ListController.createList);
router.post('/lists/:id/update', ListController.updateList);
router.post('/lists/:id/delete', ListController.deleteList);

// Rotas para Tarefas
router.get('/tasks/:id', TaskController.renderTaskDetails);
router.post('/tasks', TaskController.createTask);
router.post('/tasks/:id/update', TaskController.updateTask);
router.post('/tasks/:id/toggle', TaskController.toggleTaskCompletion);
router.post('/tasks/:id/delete', TaskController.deleteTask);

// Rotas para Etapas
router.post('/steps', StepController.createStep);
router.post('/steps/:id/toggle', StepController.toggleStepCompletion);
router.post('/steps/:id/delete', StepController.deleteStep);

module.exports = router;
