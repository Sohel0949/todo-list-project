document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskFormContainer = document.getElementById('task-form-container');
    const todoList = document.querySelector('.todo-list');
    const tasksContainer = document.getElementById('tasks-container');
    const taskInput = document.getElementById('task-input');
    const taskDatetime = document.getElementById('task-datetime');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const clearTaskBtn = document.getElementById('clear-task-btn');
    
    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Initialize task counter
    let taskCounter = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    
    // Display tasks on load
    renderTasks();
    
    // Event listeners
    addTaskBtn.addEventListener('click', toggleTaskForm);
    saveTaskBtn.addEventListener('click', saveTask);
    clearTaskBtn.addEventListener('click', clearForm);
    
    // Functions
    function toggleTaskForm() {
        const isMobile = window.innerWidth < 768;
        
        taskFormContainer.classList.toggle('hidden');
        
        if (isMobile) {
            taskFormContainer.classList.toggle('active');
            todoList.classList.toggle('hidden-mobile');
        }
    }
    
    function saveTask() {
        const taskText = taskInput.value.trim();
        const taskDate = taskDatetime.value;
        
        if (taskText === '' || taskDate === '') {
            alert('Please enter both task and date/time');
            return;
        }
        
        // Create new task object
        const newTask = {
            id: taskCounter++,
            text: taskText,
            datetime: taskDate
        };
        
        // Add to tasks array
        tasks.push(newTask);
        
        // Save to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Render tasks
        renderTasks();
        
        // Clear form
        clearForm();
        
        // Hide form on mobile
        if (window.innerWidth < 768) {
            taskFormContainer.classList.remove('active');
            todoList.classList.remove('hidden-mobile');
        }
    }
    
    function clearForm() {
        taskInput.value = '';
        taskDatetime.value = '';
    }
    
    function renderTasks() {
        // Clear tasks container
        tasksContainer.innerHTML = '';
        
        // Sort tasks by date
        tasks.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
        
        // Render each task
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item');
            
            // Format date and time
            const taskDate = new Date(task.datetime);
            const formattedDate = formatDate(taskDate);
            const formattedTime = formatTime(taskDate);
            
            taskElement.innerHTML = `
                <div class="task-info">
                    <div>
                        <span class="task-number">${index + 1}</span>
                        <span class="task-datetime">${formattedDate} ${formattedTime}</span>
                    </div>
                    <div class="task-text">${task.text}</div>
                </div>
                <button class="complete-btn" data-id="${task.id}">Complete</button>
            `;
            
            tasksContainer.appendChild(taskElement);
        });
        
        // Add event listeners to complete buttons
        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', completeTask);
        });
    }
    
    function completeTask(e) {
        const taskId = parseInt(e.target.getAttribute('data-id'));
        
        // Remove task from array
        tasks = tasks.filter(task => task.id !== taskId);
        
        // Save to localStorage
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Re-render tasks
        renderTasks();
    }
    
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    }
    
    function formatTime(date) {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; 
        
        return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            todoList.classList.remove('hidden-mobile');
        }
    });
});