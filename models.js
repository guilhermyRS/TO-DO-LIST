const supabase = require('./supabaseConfig');

class List {
    static async create(name) {
        const { data, error } = await supabase
            .from('lists')
            .insert({ name })
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async findAll() {
        const { data, error } = await supabase
            .from('lists')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('lists')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    }

    static async update(id, updateData) {
        const { data, error } = await supabase
            .from('lists')
            .update(updateData)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async delete(id) {
        const { error } = await supabase
            .from('lists')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }
}

class Task {
    static async create(listId, name, description = '') {
        const { data, error } = await supabase
            .from('tasks')
            .insert({ 
                list_id: listId, 
                name, 
                description,
                is_completed: false,
                progress: 0.0 
            })
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async findByListId(listId) {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('list_id', listId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    }

    static async update(id, updateData) {
        const { data, error } = await supabase
            .from('tasks')
            .update(updateData)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async updateProgress(id) {
        // Calcular progresso baseado nas etapas
        const steps = await Step.findByTaskId(id);
        const completedSteps = steps.filter(step => step.is_completed).length;
        const totalSteps = steps.length;
        
        const progress = totalSteps > 0 
            ? (completedSteps / totalSteps) * 100 
            : 0;

        const isCompleted = progress === 100;

        return this.update(id, { 
            progress, 
            is_completed: isCompleted 
        });
    }

    static async delete(id) {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }
}

class Step {
    static async create(taskId, name) {
        const { data, error } = await supabase
            .from('steps')
            .insert({ 
                task_id: taskId, 
                name,
                is_completed: false 
            })
            .select();
        
        if (error) throw error;
        return data[0];
    }

    static async findByTaskId(taskId) {
        const { data, error } = await supabase
            .from('steps')
            .select('*')
            .eq('task_id', taskId)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    }

    static async update(id, updateData) {
        const { data, error } = await supabase
            .from('steps')
            .update(updateData)
            .eq('id', id)
            .select();
        
        if (error) throw error;

        // Atualizar progresso da tarefa após atualizar a etapa
        if (updateData.is_completed !== undefined) {
            const step = await this.findById(id);
            await Task.updateProgress(step.task_id);
        }

        return data[0];
    }

    static async findById(id) {
        const { data, error } = await supabase
            .from('steps')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    }

    static async delete(id) {
        const { error } = await supabase
            .from('steps')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }
}

module.exports = { List, Task, Step };