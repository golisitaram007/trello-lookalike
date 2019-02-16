import './SearchComponent.js';

import { addColumn, validateColumns } from '../controllers/common.js';
import { createModal, destroyModal } from '../controllers/modal.js';

const navStyle = `
    <style>
    #navBar{
        display: flex;
    }
    .brand {
        font-size: 2rem;
        color: #ccc;
        font-family: monospace
    }
    .addColumn {
        margin: 0 10px;
        background: #6E8898;
        border-radius: 10px;
        color: #ccc;
        padding: 10px;
        font-family: monospace;
        cursor: pointer;
    }
    @media only screen and (min-width : 320px) and (max-width: 767px){
        #navBar{ 
            margin-bottom: 10px;
        }
    }
    </style>
`

class NavComponent extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.innerHTML = `
            ${navStyle}
            <div id="navBar">
                <div class="brand">Trello App</div>
                <div class="addColumn">+ Add Column</div>
            </div>
        `;
    }

    connectedCallback() {
        const searchEl = document.createElement('search-component');
        this._shadowRoot.appendChild(searchEl);
        this._shadowRoot
            .querySelector('.addColumn')
            .addEventListener('click', (e) => {
                e.stopPropagation();
                const $createModal = createModal();
                $createModal.open({
                    title: "Add Column",
                    content: `
                        <form id="formElement">
                            <label>Column Name: </label>
                            <input id="columnInput" placeholder="Enter Column Name" required/>
                        </form>
                    `,
                    submit: (e) => {
                        e.preventDefault();
                        const newColumn = e.srcElement.querySelector('#columnInput').value;
                        if(newColumn){
                            if(validateColumns(newColumn)){
                                alert('Column name given is already added.')
                            }else{
                                addColumn({title: newColumn});
                                destroyModal();
                            }
                        }else{
                            alert("Column name should not be empty");
                        }
                    },
                    cancel: (e) => {
                        e.preventDefault();
                        destroyModal();
                    }
                });
            });

    }

    disconnectedCallback() {
        // console.log('disconnected!');
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === "dataRecieved" && this._shadowRoot) {
            this._shadowRoot.querySelector("search-component").dataRecieved = newValue;
        }
    }

    adoptedCallback() {
        // console.log('adopted!');
    }

    get dataRecieved() {
        return this.getAttribute("dataRecieved");
    }
  
    set dataRecieved(value) {
        this.setAttribute("dataRecieved", value);
        this._shadowRoot.querySelector("search-component").dataRecieved = value;
    }
}

window.customElements.define('nav-component', NavComponent);