import { deleteCard, modifyCard, validateCards } from '../controllers/common.js';
import { createModal, destroyModal } from '../controllers/modal.js';

const cardStyle = `
    <style>
        .card {
            font-family: monospace;
            font-size: 1rem;
            color: #555;
            border-radius: 4px;
            margin: 8px 3px;
            padding: 5px;
            background: #F7FFF7;
            cursor: move;
        }
        .description {
            color: #FF6B6B;
            display: none;
            transition: opacity 1s ease-out;
            opacity: 0; 
        }
        .active .description, .active + .description{
            display: block;
            transition: opacity 1s ease-in;
            opacity: 1; 
        }
        .actBtn{
            cursor: pointer;
            float: right;
            margin: 0 3px;
        }
        .actBtn.edit{
            color: green;
        }
        .actBtn.delete{
            color: red;
            font-weight: bold;
        }
    </style>
`;


const modalStyle = `
    <style>
    #formElement{
        width: 500px;
    }
    #formElement > div {
        display: flex;
        flex-wrap: nowrap;
        align-items: baseline;
        margin: 10px 0;
    }
    #formElement label {
        flex-grow: 2;
        flex-basis: 100px;
    }
    #formElement .form-input {
        flex-grow: 8;
    }
    </style>
`;

class CardComponent extends HTMLElement {
    constructor() {
        super(); 
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._card = {};
    }

    connectedCallback() {
        this.showDescription();
        this._shadowRoot
            .querySelector('.actBtn.delete')
            .addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                deleteCard(this._card);
            });
        this._shadowRoot
            .querySelector('.actBtn.edit')
            .addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                this.modifyCard();
            });
        
    }

    disconnectedCallback() {
        // console.log('disconnected!');
    }

    attributeChangedCallback(name, oldVal, newVal) {
        // console.log(`Attribute: ${name} changed!`);
    }

    adoptedCallback() {
        // console.log('adopted!');
    }

    _render(d) {
        this._shadowRoot.innerHTML = `
            ${cardStyle}
            <div class="card" draggable="true">
                <div class="head">
                    <div class="title">
                        ${d.title}
                        <span class="actBtn delete" title="delete column">&#10005;</span>
                        <span class="actBtn edit" title="edit column">&#9998;</span>
                    </div>
                </div>
                <div class="description">${d.description}</div>
            </div>
        `;
        
    }

    set card(data) {
        this._card = data;
        this._render(data);
    }

    get card() {
        return this._card;
    }

    get draggable() {
        return this.getAttribute("draggable");
    }
  
    set draggable(value) {
        this.setAttribute("draggable", value);
    }

    showDescription() {
        this._shadowRoot
            .addEventListener('click', (e) => {
                this._shadowRoot.querySelector('.card').classList.toggle('active');
            });
    }

    modifyCard() {
        const $createModal = createModal();
        $createModal.open({
            title: "Modify Card",
            content: `${modalStyle}
                <form id="formElement">
                    <div>
                        <label>Column: </label>
                        <input name="columnId" class="form-input" readonly value="${this._card.columnId}" required/>
                    </div>
                    <div>
                        <label>Card Title: </label>
                        <input name="title" class="form-input" placeholder="Enter Card Title" value="${this._card.title}" required/>
                    </div>
                    <div>
                        <label>Card Description: </label>
                        <textarea name="description" placeholder="Enter Card Description" class="form-input" required>${this._card.description}</textarea>
                    </div>
                </form>
            `,
            submit: (e) => {
                e.preventDefault();
                let formData = new FormData(e.target.querySelector('form#formElement'));
                let params = {};
                formData.forEach((val, key) => {
                    params[key] = val;
                });
                const updateParams = {...this._card,...params};
                if(!Object.values(updateParams).includes('')){
                    if(validateCards(updateParams, this._card)){
                        alert('Card name is already exists on the column.');
                    }else{
                        modifyCard(updateParams);
                        destroyModal();
                    }
                }else{
                    alert("All Fields are mandatory");
                }
            },
            cancel: (e) => {
                e.preventDefault();
                destroyModal();
            }
        });
    }
}

window.customElements.define('card-component', CardComponent);