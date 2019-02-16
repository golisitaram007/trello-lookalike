import './CardComponent.js';
import { deleteColumn, addCard, validateCards, validateColumns, modifyColumn } from '../controllers/common.js';
import { createModal, destroyModal } from '../controllers/modal.js';

const columnStyle = `
<style>
    .title {
        font-family: sans-serif;
        font-size: 1rem;
        color: #ccc;
        padding: 5px 0;
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: baseline;
    }
    .title div span{
        cursor: pointer;
    }
    span.add{
        font-size: 1.3rem;
    }
    .addNewCard {
        font-family: sans-serif;
        font-size: 1rem;
        color: #fff;
        border-radius: 4px;
        margin: 8px 3px;
        padding: 3px;
        background: #2bb7ce;
        cursor: pointer;
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

class ColumnComponent extends HTMLElement {
    constructor() {
        super(); 
        this._shadowRoot = this.attachShadow({ 'mode': 'open' });
        this._shadowRoot.innerHTML = '';
        this._column = {};
    }

    connectedCallback() {
        this.deleteColumnComp();
        this.addNewCard();
        this._shadowRoot
            .querySelector('.edit')
            .addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                this.modifyColumn();
            });
        this._shadowRoot
            .addEventListener('dragstart', (e) => {
                e.dataTransfer.setData("data", JSON.stringify(e.target['_card']));
            }, false);
        this._shadowRoot
            .addEventListener('dragend', (e) => {
                e.dataTransfer.setData("text", e.target.value);
            }, false);
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
            ${columnStyle}
            <div class="column">
                <div class="title">
                    <div style="flex-grow: 9">${d.title}</div>
                    <div style="flex-grow: 1">
                        <span class="edit" title="edit column">&#9998;</span>
                        <span class="delete" title="delete column" col-id=${d.id}>&#10005;</span>
                    </div>
                </div>
            </div>
        `;
        d.cards.forEach(card => {
            let $cardCompEl = document.createElement('card-component');
            $cardCompEl.card = card;
            $cardCompEl.draggable = true;
            this._shadowRoot.appendChild($cardCompEl);
        });

        const $addCardEl = document.createElement('div');
        $addCardEl.className = "addNewCard";
        $addCardEl.innerHTML = '&#43; Add New Card';
        $addCardEl.setAttribute('col-id', this._column.id);
        this._shadowRoot.appendChild($addCardEl);
    }

    set column(data) {
        this._column = data;
        this._render(data);
    }

    get column() {
        return this._column;
    }

    deleteColumnComp() {
        this._shadowRoot
            .querySelector('.delete')
            .addEventListener('click', (e) => {
                const colId = parseInt(e.target.getAttribute("col-id"));
                deleteColumn(colId);
            });
    }

    addNewCard() {
        this._shadowRoot
            .querySelector('.addNewCard')
            .addEventListener('click', (e) => {
                const columnId = parseInt(e.target.getAttribute("col-id"));
                e.preventDefault();
                e.stopPropagation();
                const $createModal = createModal();
                $createModal.open({
                    title: "Add New Card",
                    content: `${modalStyle}
                        <form id="formElement">
                            <div>
                                <label>Column: </label>
                                <input name="columnId" class="form-input" readonly value="${columnId}" required/>
                            </div>
                            <div>
                                <label>Card Title: </label>
                                <input name="title" class="form-input" placeholder="Enter New Card Title" required/>
                            </div>
                            <div>
                                <label>Card Description: </label>
                                <textarea name="description" placeholder="Enter Card Description" class="form-input" required></textarea>
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
                        if(!Object.values(params).includes('')){
                            if(validateCards(params)){
                                alert('Card name is already exists on the column.');
                            }else{
                                addCard(params);
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
            });
    }

    modifyColumn(){
        const $createModal = createModal();
        $createModal.open({
            title: "Modify Column",
            content: `
                <form id="formElement">
                    <label>Column Name: </label>
                    <input id="columnInput" placeholder="Enter Column Name" value="${this._column.title}" required/>
                </form>
            `,
            submit: (e) => {
                e.preventDefault();
                const newColumn = e.srcElement.querySelector('#columnInput').value;
                if(newColumn){
                    if(validateColumns(newColumn, this._column.title)){
                        alert('Column name given is already added.')
                    }else{
                        modifyColumn({...this._column,title: newColumn});
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
    }

}

window.customElements.define('column-component', ColumnComponent);