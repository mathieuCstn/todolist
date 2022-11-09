import { createElement } from "../functions/dom.js"

/**
 * @typedef {object} Todo
 * @property {number} id
 * @property {string} title
 * @property {boolean} completed 
 */
export class TodoList {

    /** @type {Todo[]} */
    #todos = []
    
    /** @type {HTMLUListElement} */
    #listElement = []

    /**
     * 
     * @param {Todo[]} todos 
     */
    constructor (todos) {
        this.#todos = todos
    }

    /**
     * 
     * @param {HTMLElement} element 
     */
    appendTo (element) {
        element.innerHTML = `<form class="d-flex pb-4">
            <input required="" class="form-control" type="text" placeholder="Quel est notre mission aujourd'hui ?" name="title" data-com.bitwarden.browser.user-edited="yes">
            <button class="btn btn-primary ms-2">Ajouter</button>
        </form>
        <main>
            <div class="btn-group mb-4" role="group">
                <button type="button" class=" btn btn-outline-primary active" data-filter="all">Toutes</button>
                <button type="button" class=" btn btn-outline-primary" data-filter="todo">A faire</button>
                <button type="button" class=" btn btn-outline-primary" data-filter="done">Faites</button>
            </div>

            <ul class="list-group">
            </ul>
        </main>`
        this.#listElement = document.querySelector('.list-group')
        for (let todo of this.#todos) {
            const t = new TodoListItem(todo)
            this.#listElement.append(t.element)
        }
        element.querySelector('form').addEventListener('submit', (e) => this.#onSubmit(e))
        element.querySelectorAll('.btn-group button').forEach(button => {
            button.addEventListener('click', e => this.#toggleFilter(e))
        })
    }

    /**
     * 
     * @param {SubmitEvent} e 
     */
    #onSubmit (e) {
        e.preventDefault()
        const form = e.currentTarget
        const title = new FormData(form).get('title').toString().trim()
        if (title === '') {
            return
        }
        const todo = {
            id: Date.now(),
            title,
            completed: false
        }
        const item = new TodoListItem(todo)
        this.#listElement.prepend(item.element)
        form.reset()
    }

    /**
     * 
     * @param {PointerEvent} e 
     */
    #toggleFilter (e) {
        e.preventDefault()
        const filter = e.currentTarget.getAttribute('data-filter')
        e.currentTarget.parentElement.querySelector('.active').classList.remove('active')
        e.currentTarget.classList.add('active')
        if (filter === 'todo') {
            this.#listElement.classList.add('hide-completed')
            this.#listElement.classList.remove('hide-todo')
        } else if (filter === 'done') {
            this.#listElement.classList.add('hide-todo')
            this.#listElement.classList.remove('hide-completed')
        } else {
            this.#listElement.classList.remove('hide-todo')
            this.#listElement.classList.remove('hide-completed')
        }
    }
}

class TodoListItem {

    #element

    /** @type {Todo} */
    constructor (todo) {
        const li = createElement('li', {
            class: 'todo list-group-item d-flex align-items-center'
        })
        this.#element = li

        const checkbox = createElement('input', {
            type: 'checkbox',
            class: 'form-check-input',
            id: `todo-${todo.id}`,
            checked: todo.completed ? '' : null
        })
        const title = createElement('label', {
            class: 'ms-2 form-check-label',
            for: `todo-${todo.id}`
        })
        title.innerText = todo.title
        const deleteButton = createElement('label', {
            class: 'ms-auto btn btn-danger btn-sm'
        })
        deleteButton.innerHTML = '<i class="bi-trash"></i>'

        li.append(checkbox)
        li.append(title)
        li.append(deleteButton)
        this.toggle(checkbox)

        deleteButton.addEventListener('click', (e) => this.remove(e))
        checkbox.addEventListener('change', e => this.toggle(e.currentTarget))
    }

    /**
     * 
     * @return {HTMLElement} 
     */
    get element () {
        return this.#element
    }

    remove (e) {
        e.preventDefault()
        this.#element.remove()
    }

    /**
     * Change l'état (à faire/fait) de la tache
     * @param {HTMLInputElement} checkbox 
     */
    toggle (checkbox) {
        if (checkbox.checked) {
            this.#element.classList.add('is-completed')
        } else {
            this.#element.classList.remove('is-completed')
        }
    }
}