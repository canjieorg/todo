// Helper function to generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to verify password
function verifyPassword(password) {
    try {
        return password === PASS;
    } catch (error) {
        console.error('Password verification error:', error);
        return false;
    }
}

// Helper function to escape special characters for Telegram MarkdownV2
function escapeMD2(text) {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

// HTML template for the main page
const HTML_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>待办事项提醒</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        :root {
            --primary-color: #3498db;
            --secondary-color: #2980b9;
            --background-color: #f8f9fa;
            --card-background: #ffffff;
            --text-color: #2c3e50;
            --border-radius: 12px;
            --box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--background-color);
            color: var(--text-color);
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 15px;
        }

        .card {
            background: var(--card-background);
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            border: none;
            margin-bottom: 2rem;
            padding: 2rem;
        }

        .form-control {
            border-radius: 8px;
            border: 1px solid #e1e8ed;
            padding: 0.75rem 1rem;
            transition: all 0.3s ease;
        }

        .form-control:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
        }

        .btn {
            border-radius: 8px;
            padding: 0.75rem 1.5rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }

        .btn-primary:hover {
            background-color: var(--secondary-color);
            border-color: var(--secondary-color);
        }

        .table {
            background: var(--card-background);
            border-radius: var(--border-radius);
            overflow: hidden;
            box-shadow: var(--box-shadow);
            table-layout: fixed;
            width: 100%;
        }

        .table thead th {
            background-color: var(--primary-color);
            color: white;
            font-weight: 500;
            border: none;
            padding: 1rem;
            position: relative;
            user-select: none;
        }

        .table thead th.sortable {
            cursor: pointer;
        }

        .table thead th.sortable:hover {
            background-color: var(--secondary-color);
        }

        .table thead th.sortable::after {
            content: '↕️';
            position: absolute;
            right: 8px;
            opacity: 0.5;
        }

        .table thead th.sort-asc::after {
            content: '↑';
            opacity: 1;
        }

        .table thead th.sort-desc::after {
            content: '↓';
            opacity: 1;
        }

        /* 桌面端的列宽设置 */
        @media (min-width: 992px) {
            .table th:nth-child(1), .table td:nth-child(1) { width: 6%; }   /* 序号 */
            .table th:nth-child(2), .table td:nth-child(2) { width: 10.5%; }  /* 添加日期 */
            .table th:nth-child(3), .table td:nth-child(3) { width: 10.5%; }  /* 待办日期 */
            .table th:nth-child(4), .table td:nth-child(4) { width: 30%; }  /* 待办事项 */
            .table th:nth-child(5), .table td:nth-child(5) { width: 10%; }  /* 提前通知天数 */
            .table th:nth-child(6), .table td:nth-child(6) { width: 10%; }  /* 连续通知天数 */
            .table th:nth-child(7), .table td:nth-child(7) { width: 23%; }  /* 操作 */
        }

        /* 平板和手机端的列宽设置 */
        @media (max-width: 991px) {
            .table th:nth-child(1), .table td:nth-child(1) { width: 8%; }     /* 序号 */
            .table th:nth-child(2), .table td:nth-child(2) { width: 15%; }    /* 添加日期 */
            .table th:nth-child(3), .table td:nth-child(3) { width: 15%; }    /* 待办日期 */
            .table th:nth-child(4), .table td:nth-child(4) { width: 14.5%; }  /* 待办事项 */
            .table th:nth-child(5), .table td:nth-child(5) { width: 11.5%; }  /* 提前通知天数 */
            .table th:nth-child(6), .table td:nth-child(6) { width: 11.5%; }  /* 连续通知天数 */
            .table th:nth-child(7), .table td:nth-child(7) { width: 25.5%; }  /* 操作 */
        }

        .table tbody td {
            padding: 1rem;
            vertical-align: middle;
            border-bottom: 1px solid #e1e8ed;
            word-wrap: break-word;
            word-break: break-word;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .btn-group-sm > .btn, .btn-sm {
            padding: 0.4rem 0.8rem;
            font-size: 0.875rem;
            border-radius: 6px;
            margin: 0 2px;
        }

        .pagination {
            margin-top: 2rem;
            justify-content: center;
        }

        .modal-content {
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
        }

        .modal-header {
            background-color: var(--primary-color);
            color: white;
            border-top-left-radius: var(--border-radius);
            border-top-right-radius: var(--border-radius);
            padding: 1.5rem;
        }

        .modal-body {
            padding: 2rem;
        }

        .modal-footer {
            padding: 1.5rem;
            border-top: 1px solid #e1e8ed;
        }

        h2 {
            color: var(--primary-color);
            font-weight: 600;
            margin-bottom: 1.5rem;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        label {
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: var(--text-color);
        }

        #pagination {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-top: 2rem;
        }

        #pageInfo {
            font-weight: 500;
            color: var(--text-color);
        }

        .table-responsive {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }

        .btn-info {
            background-color: #17a2b8;
            border-color: #17a2b8;
            color: white;
        }

        .btn-info:hover {
            background-color: #138496;
            border-color: #138496;
            color: white;
        }

        .btn-danger {
            background-color: #dc3545;
            border-color: #dc3545;
        }

        .btn-danger:hover {
            background-color: #c82333;
            border-color: #bd2130;
        }

        .g-recaptcha {
            display: flex;
            justify-content: center;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <h2 class="mb-4">添加待办事项</h2>
            <form id="todoForm">
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="todoContent">待办事项</label>
                            <input type="text" class="form-control" id="todoContent" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="todoDate">待办日期</label>
                            <input type="date" class="form-control" id="todoDate" required>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="advanceDays">提前通知天数(如需当天通知就设置为0)</label>
                            <input type="number" class="form-control" id="advanceDays" value="2" min="0" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group">
                            <label for="continuousDays">连续通知天数(最小设置为1)</label>
                            <input type="number" class="form-control" id="continuousDays" value="3" min="1" required>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">添加</button>
            </form>
        </div>

        <div class="card">
            <h2 class="mb-4">待办事项列表</h2>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th class="sortable" data-sort="createdAt">添加日期</th>
                            <th class="sortable" data-sort="date">待办日期</th>
                            <th>待办事项</th>
                            <th>提前天数</th>
                            <th>连续天数</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="todoList"></tbody>
                </table>
                <div id="pagination" style="display: none;">
                    <button id="prevPage" class="btn btn-primary">&laquo; 上一页</button>
                    <span id="pageInfo">第 <span id="currentPage">1</span> 页，共 <span id="totalPages">1</span> 页</span>
                    <button id="nextPage" class="btn btn-primary">下一页 &raquo;</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">编辑待办事项</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <input type="hidden" id="editId">
                        <div class="form-group">
                            <label for="editContent">待办事项</label>
                            <input type="text" class="form-control" id="editContent" required>
                        </div>
                        <div class="form-group">
                            <label for="editDate">待办日期</label>
                            <input type="date" class="form-control" id="editDate" required>
                        </div>
                        <div class="form-group">
                            <label for="editAdvanceDays">提前通知天数</label>
                            <input type="number" class="form-control" id="editAdvanceDays" min="0" required>
                        </div>
                        <div class="form-group">
                            <label for="editContinuousDays">连续通知天数</label>
                            <input type="number" class="form-control" id="editContinuousDays" min="1" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" id="saveEdit">保存</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const todoForm = document.getElementById('todoForm');
            const todoList = document.getElementById('todoList');
            const editModal = new bootstrap.Modal(document.getElementById('editModal'));
            const saveEditBtn = document.getElementById('saveEdit');
            
            // 添加排序状态变量
            let currentSort = {
                field: 'date',
                direction: 'asc'
            };

            // 添加表头排序点击事件
            document.querySelectorAll('th.sortable').forEach(th => {
                th.addEventListener('click', () => {
                    const field = th.dataset.sort;
                    
                    // 清除其他列的排序状态
                    document.querySelectorAll('th.sortable').forEach(header => {
                        if (header !== th) {
                            header.classList.remove('sort-asc', 'sort-desc');
                        }
                    });

                    // 切换排序方向
                    if (currentSort.field === field) {
                        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                        th.classList.toggle('sort-asc', currentSort.direction === 'asc');
                        th.classList.toggle('sort-desc', currentSort.direction === 'desc');
                    } else {
                        currentSort.field = field;
                        currentSort.direction = 'asc';
                        th.classList.remove('sort-desc');
                        th.classList.add('sort-asc');
                    }

                    loadTodos();
                });
            });

            // Form validation
            todoForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const content = document.getElementById('todoContent').value;
                const date = document.getElementById('todoDate').value;
                const advanceDays = parseInt(document.getElementById('advanceDays').value);
                const continuousDays = parseInt(document.getElementById('continuousDays').value);

                // Validate dates
                const todoDate = new Date(date);
                todoDate.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const timeDiff = todoDate.getTime() - today.getTime();
                const daysUntilTodo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

                if (advanceDays > daysUntilTodo + 1) {
                    alert('提前通知天数不能大于待办日期与今天的差距加1天');
                    return;
                }

                if (continuousDays > advanceDays + 1) {
                    alert('连续通知天数最多只能比提前通知天数大1天');
                    return;
                }

                try {
                    const response = await fetch('/api/todos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            content,
                            date,
                            advanceDays,
                            continuousDays,
                            createdAt: new Date().toISOString()
                        })
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Error response:', errorText);
                        alert('添加失败：' + errorText);
                        return;
                    }

                    const result = await response.json();
                    console.log('Success response:', result);
                    alert('添加成功');
                    todoForm.reset();
                    loadTodos();
                } catch (error) {
                    console.error('Error:', error);
                    alert('添加失败：' + error.message);
                }
            });

            // Load todos
            let currentPage = 1;
            const itemsPerPage = 10;

            async function loadTodos() {
                try {
                    const response = await fetch('/api/todos');
                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Error response:', errorText);
                        try {
                            const errorJson = JSON.parse(errorText);
                            alert('加载待办事项失败：' + (errorJson.details || errorJson.error || '服务器错误'));
                        } catch (e) {
                            alert('加载待办事项失败：' + errorText);
                        }
                        return;
                    }
                    
                    const data = await response.json();
                    const todos = Array.isArray(data) ? data : [];
                    
                    todoList.innerHTML = '';
                    if (todos.length === 0) {
                        todoList.innerHTML = '<tr><td colspan="7" class="text-center">暂无待办事项</td></tr>';
                        document.getElementById('pagination').style.display = 'none';
                        return;
                    }
                    
                    // 根据当前排序设置对数据进行排序
                    todos.sort((a, b) => {
                        const aValue = new Date(a[currentSort.field]);
                        const bValue = new Date(b[currentSort.field]);
                        return currentSort.direction === 'asc' 
                            ? aValue - bValue 
                            : bValue - aValue;
                    });

                    // 计算分页
                    const totalPages = Math.ceil(todos.length / itemsPerPage);
                    
                    // 如果当前页码大于总页数，重置为第一页
                    if (currentPage > totalPages) {
                        currentPage = 1;
                    }
                    
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = Math.min(startIndex + itemsPerPage, todos.length);
                    const currentTodos = todos.slice(startIndex, endIndex);

                    // 更新分页显示
                    const paginationDiv = document.getElementById('pagination');
                    const prevPageBtn = document.getElementById('prevPage');
                    const nextPageBtn = document.getElementById('nextPage');
                    const currentPageSpan = document.getElementById('currentPage');
                    const totalPagesSpan = document.getElementById('totalPages');

                    if (todos.length > itemsPerPage) {
                        paginationDiv.style.display = 'flex';
                        prevPageBtn.disabled = currentPage === 1;
                        nextPageBtn.disabled = currentPage === totalPages;
                        currentPageSpan.textContent = currentPage;
                        totalPagesSpan.textContent = totalPages;

                        prevPageBtn.onclick = () => {
                            if (currentPage > 1) {
                                currentPage--;
                                loadTodos();
                            }
                        };

                        nextPageBtn.onclick = () => {
                            if (currentPage < totalPages) {
                                currentPage++;
                                loadTodos();
                            }
                        };
                    } else {
                        paginationDiv.style.display = 'none';
                        currentPage = 1;
                    }
                    
                    currentTodos.forEach((todo, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = \`
                            <td>\${startIndex + index + 1}</td>
                            <td>\${new Date(todo.createdAt).toLocaleDateString()}</td>
                            <td>\${new Date(todo.date).toLocaleDateString()}</td>
                            <td>\${todo.content}</td>
                            <td>\${todo.advanceDays}</td>
                            <td>\${todo.continuousDays}</td>
                            <td>
                                <button class="btn btn-sm btn-primary edit-btn" data-id="\${todo.id}">编辑</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="\${todo.id}">删除</button>
                                <button class="btn btn-sm btn-info test-notification-btn" data-id="\${todo.id}">测试</button>
                            </td>
                        \`;
                        todoList.appendChild(row);
                    });

                    // Add event listeners to buttons
                    document.querySelectorAll('.edit-btn').forEach(btn => {
                        btn.addEventListener('click', () => editTodo(btn.dataset.id));
                    });

                    document.querySelectorAll('.delete-btn').forEach(btn => {
                        btn.addEventListener('click', () => deleteTodo(btn.dataset.id));
                    });

                    document.querySelectorAll('.test-notification-btn').forEach(btn => {
                        btn.addEventListener('click', () => testNotification(btn.dataset.id));
                    });
                } catch (error) {
                    console.error('Error loading todos:', error);
                    alert('加载待办事项失败：' + error.message);
                }
            }

            // Edit todo
            async function editTodo(id) {
                try {
                    const response = await fetch(\`/api/todos/\${id}\`);
                    const todo = await response.json();
                    
                    document.getElementById('editId').value = id;
                    document.getElementById('editContent').value = todo.content;
                    document.getElementById('editDate').value = todo.date;
                    document.getElementById('editAdvanceDays').value = todo.advanceDays;
                    document.getElementById('editContinuousDays').value = todo.continuousDays;
                    
                    editModal.show();
                } catch (error) {
                    console.error('Error:', error);
                }
            }

            // Save edit
            saveEditBtn.addEventListener('click', async () => {
                const id = document.getElementById('editId').value;
                const content = document.getElementById('editContent').value;
                const date = document.getElementById('editDate').value;
                const advanceDays = parseInt(document.getElementById('editAdvanceDays').value);
                const continuousDays = parseInt(document.getElementById('editContinuousDays').value);

                // Validate dates
                const todoDate = new Date(date);
                todoDate.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const timeDiff = todoDate.getTime() - today.getTime();
                const daysUntilTodo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

                if (advanceDays > daysUntilTodo + 1) {
                    alert('提前通知天数不能大于待办日期与今天的差距加1天');
                    return;
                }

                if (continuousDays < 1) {
                    alert('连续通知天数不能小于1天');
                    return;
                }

                if (continuousDays > advanceDays + 1) {
                    alert('连续通知天数最多只能比提前通知天数大1天');
                    return;
                }

                try {
                    const response = await fetch(\`/api/todos/\${id}\`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            content,
                            date,
                            advanceDays,
                            continuousDays
                        })
                    });

                    if (response.ok) {
                        alert('修改成功');
                        editModal.hide();
                        loadTodos();
                    } else {
                        alert('修改失败');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('修改失败');
                }
            });

            // Delete todo
            async function deleteTodo(id) {
                if (confirm('确定要删除这个待办事项吗？')) {
                    try {
                        const response = await fetch(\`/api/todos/\${id}\`, {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            alert('删除成功');
                            loadTodos();
                        } else {
                            const errorText = await response.text();
                            console.error('Delete failed:', errorText);
                            try {
                                const errorJson = JSON.parse(errorText);
                                alert('删除失败：' + (errorJson.error || '未知错误'));
                            } catch (e) {
                                alert('删除失败：' + errorText);
                            }
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert('删除失败：' + error.message);
                    }
                }
            }

            // Test notification
            async function testNotification(id) {
                try {
                    const response = await fetch(\`/api/todos/\${id}/test-notification\`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const data = await response.json();
                    
                    if (response.ok) {
                        alert('测试通知已发送');
                    } else {
                        let errorMessage = '测试通知发送失败';
                        if (data.error) {
                            errorMessage += '：' + data.error;
                        }
                        alert(errorMessage);
                    }
                } catch (error) {
                    console.error('Error sending test notification:', error);
                    alert('测试通知发送失败：' + error.message);
                }
            }

            // Initial load
            loadTodos();
        });
    </script>
</body>
</html>`;

// Main request handler
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

// 添加reCAPTCHA验证函数
async function verifyRecaptcha(token) {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${RECAPTCHA_SECRET}&response=${token}`,
    });

    const result = await response.json();
    return result.success;
}

// 在主处理函数中添加验证
async function handleRequest(request) {
    try {
        const url = new URL(request.url);
        const path = url.pathname;

        // API endpoints
        if (path.startsWith('/api/todos')) {
            const todoId = path.split('/')[3];

            // Get all todos
            if (request.method === 'GET' && !todoId) {
                try {
                    const todosStr = await TODO_KV.get('todos');
                    
                    if (!todosStr) {
                        return new Response(JSON.stringify({ 
                            error: 'No todos found in KV storage'
                        }), {
                            status: 404,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    let todos;
                    try {
                        todos = JSON.parse(todosStr);
                    } catch (parseError) {
                        return new Response(JSON.stringify({ error: 'JSON parse error', details: parseError.message }), {
                            status: 500,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    if (!Array.isArray(todos) || todos.length === 0) {
                        return new Response(JSON.stringify([]), {
                            headers: { 
                                'Content-Type': 'application/json',
                                'Cache-Control': 'no-store, no-cache, must-revalidate'
                            }
                        });
                    }
                    
                    // 按待办日期升序排序
                    todos.sort((a, b) => new Date(a.date) - new Date(b.date));
                    
                    return new Response(JSON.stringify(todos), {
                        headers: { 
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-store, no-cache, must-revalidate'
                        },
                    });
                } catch (error) {
                    console.error('Error getting todos:', error);
                    return new Response(JSON.stringify({ 
                        error: 'Internal Server Error',
                        details: error.message
                    }), { 
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }

            // Get single todo
            if (request.method === 'GET' && todoId) {
                try {
                    const todosStr = await TODO_KV.get('todos');
                    if (!todosStr) {
                        return new Response(JSON.stringify({ error: 'No todos found' }), {
                            status: 404,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    const todos = JSON.parse(todosStr);
                    const todo = todos.find(t => t.id === todoId);
                    if (!todo) {
                        return new Response(JSON.stringify({ error: 'Todo not found' }), {
                            status: 404,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    return new Response(JSON.stringify(todo), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                } catch (error) {
                    return new Response(JSON.stringify({ error: error.message }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }

            // Create todo
            if (request.method === 'POST' && !todoId) {
                try {
                    const body = await request.json();

                    // 检查是否已登录
                    const cookie = request.headers.get('Cookie') || '';
                    const isLoggedIn = cookie.includes('loggedIn=true');

                    // 只有未登录时才验证 reCAPTCHA
                    if (!isLoggedIn && RECAPTCHA_SITE_KEY && RECAPTCHA_SECRET) {
                        const recaptchaToken = body.recaptchaToken;
                        const isValid = await verifyRecaptcha(recaptchaToken);
                        if (!isValid) {
                            return new Response(JSON.stringify({ 
                                error: 'reCAPTCHA verification failed' 
                            }), {
                                status: 400,
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                        }
                    }

                    if (!body.content || !body.date || body.advanceDays === undefined || body.continuousDays === undefined) {
                        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                            status: 400,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    body.id = generateId();
                    const todosStr = await TODO_KV.get('todos');
                    let todos = [];
                    if (todosStr) {
                        todos = JSON.parse(todosStr);
                    }
                    todos.push(body);
                    await TODO_KV.put('todos', JSON.stringify(todos));

                    return new Response(JSON.stringify(body), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                } catch (error) {
                    return new Response(JSON.stringify({ error: error.message }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }

            // Update todo
            if (request.method === 'PUT' && todoId) {
                try {
                    const updatedTodo = await request.json();
                    const todosStr = await TODO_KV.get('todos');
                    if (!todosStr) {
                        return new Response(JSON.stringify({ error: 'No todos found' }), {
                            status: 404,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    const todos = JSON.parse(todosStr);
                    const index = todos.findIndex(t => t.id === todoId);
                    if (index === -1) {
                        return new Response(JSON.stringify({ error: 'Todo not found' }), {
                            status: 404,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    todos[index] = { ...todos[index], ...updatedTodo };
                    await TODO_KV.put('todos', JSON.stringify(todos));

                    return new Response(JSON.stringify(todos[index]), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                } catch (error) {
                    return new Response(JSON.stringify({ error: error.message }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }

            // Delete todo
            if (request.method === 'DELETE' && todoId) {
                try {
                    const todosStr = await TODO_KV.get('todos');
                    if (!todosStr) {
                        return new Response(JSON.stringify({ error: 'No todos found' }), {
                            status: 404,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    const todos = JSON.parse(todosStr);
                    const filteredTodos = todos.filter(t => t.id !== todoId);
                    await TODO_KV.put('todos', JSON.stringify(filteredTodos));

                    return new Response(null, { status: 204 });
                } catch (error) {
                    return new Response(JSON.stringify({ error: error.message }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }

            // Test notification
            if (request.method === 'POST' && todoId && path.endsWith('/test-notification')) {
                try {
                    if (!TGID || !TGTOKEN) {
                        return new Response(JSON.stringify({
                            error: 'Missing environment variables'
                        }), {
                            status: 500,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    const todosStr = await TODO_KV.get('todos');
                    if (!todosStr) {
                        return new Response(JSON.stringify({ error: 'No todos found' }), {
                            status: 404,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    const todos = JSON.parse(todosStr);
                    const todo = todos.find(t => t.id === todoId);
                    if (!todo) {
                        return new Response(JSON.stringify({ error: 'Todo not found' }), {
                            status: 404,
                            headers: { 'Content-Type': 'application/json' }
                        });
                    }

                    const message = '🔔 测试通知\n\n待办事项：' + todo.content + '\n待办日期：' + new Date(todo.date).toLocaleDateString();
                    const safemessage = escapeMD2(message);

                    const url = 'https://api.telegram.org/bot' + TGTOKEN + '/sendMessage';
                    const params = {
                        chat_id: TGID,
                        text: safemessage,
                        parse_mode: 'MarkdownV2'
                    };

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(params)
                    });

                    const responseData = await response.json();
                    return new Response(JSON.stringify({ success: response.ok, telegramResponse: responseData }), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                } catch (error) {
                    return new Response(JSON.stringify({ error: error.message }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }
        }

        // Serve the main page
        if (path === '/') {
            const cookie = request.headers.get('Cookie') || '';
            const isLoggedIn = cookie.includes('loggedIn=true');
            
            if (!isLoggedIn) {
                return new Response(generateLoginHTML(), {
                    headers: { 'Content-Type': 'text/html' }
                });
            }

            return new Response(HTML_TEMPLATE, {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // 处理登录请求
        if (path === '/login' && request.method === 'POST') {
            const formData = await request.formData();
            const password = formData.get('password');
            
            // 如果配置了 reCAPTCHA，则进行验证
            if (RECAPTCHA_SITE_KEY && RECAPTCHA_SECRET) {
                const recaptchaToken = formData.get('g-recaptcha-response');
                if (!recaptchaToken) {
                    return new Response(generateLoginHTML(true), {
                        headers: { 'Content-Type': 'text/html' }
                    });
                }
                
                const isValid = await verifyRecaptcha(recaptchaToken);
                if (!isValid) {
                    return new Response(generateLoginHTML(true), {
                        headers: { 'Content-Type': 'text/html' }
                    });
                }
            }

            if (verifyPassword(password)) {
                return new Response('', {
                    status: 302,
                    headers: {
                        'Location': '/',
                        'Set-Cookie': 'loggedIn=true; HttpOnly; Path=/',
                        'Content-Type': 'text/html'
                    }
                });
            } else {
                return new Response(generateLoginHTML(true), {
                    headers: { 'Content-Type': 'text/html' }
                });
            }
        }

        return new Response('Not found', { status: 404 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Scheduled task to check and send notifications
addEventListener('scheduled', event => {
    event.waitUntil(handleScheduledTask());
});

async function handleScheduledTask() {
    try {
        console.log('Starting scheduled task...');
        
        if (!TGID || !TGTOKEN) {
            console.error('Missing environment variables');
            return;
        }
        
        const now = new Date();
        const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
        console.log('Current Beijing time:', beijingTime.toISOString());

        const hour = beijingTime.getHours();
        console.log('Current hour:', hour);

        if (hour !== 14) {
            console.log('Not notification time yet. Current Beijing time:', 
                       beijingTime.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
            return;
        }

        const today = new Date(beijingTime);
        today.setHours(0, 0, 0, 0);
        console.log('Today date:', today.toISOString());

        console.log('Fetching todos from KV...');
        const todosStr = await TODO_KV.get('todos');
        console.log('Raw KV data:', todosStr ? todosStr.substring(0, 100) + '...' : 'null');
        
        if (!todosStr) {
            console.error('No todos found in KV storage');
            return;
        }

        let todos;
        try {
            todos = JSON.parse(todosStr);
        } catch (error) {
            console.error('Error parsing todos:', error);
            return;
        }

        if (!Array.isArray(todos)) {
            console.error('Invalid todos data structure');
            return;
        }
        
        for (const todo of todos) {
            try {
                const todoDate = new Date(todo.date);
                todoDate.setHours(0, 0, 0, 0);
                
                const timeDiff = todoDate.getTime() - today.getTime();
                const daysUntilTodo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                
                console.log('Processing todo:', {
                    id: todo.id,
                    content: todo.content,
                    date: todo.date,
                    todoDate: todoDate.toISOString(),
                    today: today.toISOString(),
                    timeDiff: timeDiff,
                    daysUntilTodo: daysUntilTodo,
                    advanceDays: todo.advanceDays
                });

                if (daysUntilTodo >= 0 && daysUntilTodo <= todo.advanceDays) {
                    console.log('Sending notification for todo:', todo.id, 'Days until todo:', daysUntilTodo);
                    const message = '🔔 尊敬的老板，小宝奉命提醒您：\n\n' +
                                  '待办事项：' + todo.content + '\n' +
                                  '待办日期：' + todoDate.toLocaleDateString() + '\n' +
                                  '您还有' + daysUntilTodo + '天的时间来处理。';
                    const safemessage = escapeMD2(message);
                    
                    const url = 'https://api.telegram.org/bot' + TGTOKEN + '/sendMessage';
                    const params = {
                        chat_id: TGID,
                        text: safemessage,
                        parse_mode: 'MarkdownV2'
                    };

                    console.log('Sending notification with params:', params);
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(params)
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Telegram API error for todo ' + todo.id + ':', response.status, errorText);
                        continue;
                    }

                    const responseText = await response.text();
                    try {
                        const responseData = JSON.parse(responseText);
                        console.log('Telegram API response for todo ' + todo.id + ':', responseData);
                    } catch (parseError) {
                        console.error('Failed to parse Telegram response for todo ' + todo.id + ':', parseError);
                        console.log('Raw response:', responseText);
                    }
                } else {
                    console.log('Skipping notification for todo:', todo.id, 
                              'Days until todo:', daysUntilTodo,
                              'Advance days:', todo.advanceDays);
                }
            } catch (todoError) {
                console.error('Error processing todo in scheduled task:', todoError, todo);
            }
        }
    } catch (error) {
        console.error('Scheduled task error:', error);
    }
}

// 生成登录页面HTML
function generateLoginHTML(isError = false) {
    const hasRecaptcha = RECAPTCHA_SITE_KEY && RECAPTCHA_SECRET;
    
    return '<!DOCTYPE html>' +
    '<html lang="zh-CN">' +
    '<head>' +
        '<meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<title>登录 - 待办事项提醒</title>' +
        (hasRecaptcha ? '<script src="https://www.google.com/recaptcha/api.js" async defer></script>' : '') +
        '<style>' +
            'body {' +
                'font-family: Arial, sans-serif;' +
                'background-color: #f4f4f4;' +
                'display: flex;' +
                'justify-content: center;' +
                'align-items: center;' +
                'height: 100vh;' +
            '}' +
            '.login-container {' +
                'max-width: 400px;' +
                'width: 100%;' +
                'margin: 0 auto;' +
                'background-color: white;' +
                'padding: 20px;' +
                'border-radius: 8px;' +
                'box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);' +
            '}' +
            'h1 {' +
                'text-align: center;' +
                'color: #333;' +
                'margin-bottom: 20px;' +
            '}' +
            '.form-group {' +
                'margin-bottom: 15px;' +
            '}' +
            'label {' +
                'display: block;' +
                'margin-bottom: 5px;' +
                'color: #666;' +
            '}' +
            'input[type="password"] {' +
                'width: 100%;' +
                'padding: 8px;' +
                'border: 1px solid #ddd;' +
                'border-radius: 4px;' +
                'box-sizing: border-box;' +
            '}' +
            'button {' +
                'width: 100%;' +
                'padding: 10px;' +
                'background-color: #007bff;' +
                'color: white;' +
                'border: none;' +
                'border-radius: 4px;' +
                'cursor: pointer;' +
            '}' +
            'button:hover {' +
                'background-color: #0056b3;' +
            '}' +
            '.error-message {' +
                'color: red;' +
                'margin-bottom: 10px;' +
                'text-align: center;' +
            '}' +
            '.g-recaptcha {' +
                'display: flex;' +
                'justify-content: center;' +
                'margin: 15px 0;' +
            '}' +
        '</style>' +
    '</head>' +
    '<body>' +
        '<div class="login-container">' +
            '<h1>待办事项提醒</h1>' +
            (isError ? '<div class="error-message">密码错误</div>' : '') +
            '<form method="POST" action="/login">' +
                '<div class="form-group">' +
                    '<label for="password">请输入密码:</label>' +
                    '<input type="password" id="password" name="password" required>' +
                '</div>' +
                (hasRecaptcha ? `<div class="g-recaptcha mb-3" data-sitekey="${RECAPTCHA_SITE_KEY}"></div>` : '') +
                '<button type="submit">登录</button>' +
            '</form>' +
            '<div style="text-align: center; margin-top: 20px;">' +
                '<a href="https://github.com/canjieorg/todo"  style="text-decoration: none;">' +
                    '<svg height="32" viewBox="0 0 16 16" width="32" style="fill: #333;">' +
                        '<path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68.78 1.23.78.48 0 .92-.1 1.32-.26a4.93 4.93 0 0 0 1.02-.13v1.49c0 .2-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>' +
                    '</svg>' +
                '</a>' +
            '</div>' +
        '</div>' +
    '</body>' +
    '</html>';
}
