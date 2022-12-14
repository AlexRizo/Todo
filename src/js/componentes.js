import { Todo } from "../class";
import { todoList } from "../index";

// Referencias HTML
const divTodoList          = document.querySelector('.todo-list');
const txtInput             = document.querySelector('.new-todo');
const btnBorrarCompletados = document.querySelector('.clear-completed');
const ulFiltros            = document.querySelector('.filters');
const anchorFiltros        = document.querySelectorAll('.filtro');
const spanPendientes           = document.querySelector('.todo-count');

export const crearTodoHtml = (todo) => {
    const htmlTodo = `
        <li class="${(todo.completado ? 'completed' : '')}" data-id="${todo.id}">
            <div class="view">
                <input class="toggle" type="checkbox" ${(todo.completado ? 'checked' : '')}>
                <label>${todo.tarea}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="Create a TodoMVC template">
        </li>
    `;

    const div = document.createElement('div');
    div.innerHTML = htmlTodo;

    divTodoList.append(div.firstElementChild)
    _todosPendientes();

    return div.firstElementChild
}

const _todosPendientes = (todo) => {
    const pendientes = todoList.todosPendientes();
    spanPendientes.firstElementChild.innerText = pendientes;
}

// Eventos
txtInput.addEventListener('keyup', (event) => {
    if(event.keyCode === 13 && txtInput.value.length > 0) {
        const nuevoTodo = new Todo(txtInput.value);
        todoList.nuevoTodo(nuevoTodo);
        crearTodoHtml(nuevoTodo);
        _todosPendientes();
        txtInput.value = ''; 
        
    }
});

divTodoList.addEventListener('click', (event) => {
    // input, label, button // target selecciona la etiqueta 
    // y localName el nombre de la etiqueta
    const nombreElemento = event.target.localName;
    const todoElemento   = event.target.parentElement.parentElement;
    const todoId         = todoElemento.getAttribute('data-id');

    if (nombreElemento.includes('input')) { // Click en el checkbox
        todoList.toggleTodo(todoId);
        todoElemento.classList.toggle('completed')
    }else if (nombreElemento.includes('button')) { // Hay que borrar el todo
        todoList.eliminarTodo(todoId);
        divTodoList.removeChild(todoElemento);
    }
    _todosPendientes();
});

btnBorrarCompletados.addEventListener('click', (event) => {
    todoList.eliminarCompletados();

    for (let i = divTodoList.children.length - 1; i >= 0; i--) {
        const elemento = divTodoList.children[i];
        if (elemento.classList.contains('completed')) {
            divTodoList.removeChild(elemento);
        }
    }
    _todosPendientes();
});

ulFiltros.addEventListener('click', (event) => {
    const filtro = event.target.text
    if (!filtro) { return; }

    anchorFiltros.forEach(elem => elem.classList.remove('selected'));
    event.target.classList.add('selected');

    for (const elemento of divTodoList.children) {
        elemento.classList.remove('hidden');
        const completado = elemento.classList.contains('completed');

        switch (filtro) {
            case 'Pendientes':
                if (completado) {
                    elemento.classList.add('hidden');
                }
            break;

            case 'Completados':
                if (!completado) {
                    elemento.classList.add('hidden');
                }
            break;
        }
    }
});