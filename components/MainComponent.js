import './ColumnComponent.js';
import { modifyCard, checkIfTitleExists } from '../controllers/common.js';

const mainStyle = `
    <style>
    column-component {
        background: #6E8898;
        display: block;
        border-radius: 8px;
        padding: 10px;
        box-sizing: border-box;
        flex-basis: 240px;
        margin: 10px;
        min-height: 250px;
    }
    @media only screen and (min-width : 320px) and (max-width: 479px) {
        column-component{ 
            flex-grow: 1;
            flex-flow: row wrap;
            flex-basis: 100%;
        }
    }
    @media only screen and (min-width : 480px) and (max-width: 767px) {
        column-component{ 
            flex-flow: row wrap;
            flex-basis: 200px;
        }
    }
    </style>
`;

class MainComponent extends HTMLElement {
    constructor() {
        super();
        this.dataSet = [];
        this.innerHTML = ``;
    }

    connectedCallback() {
        this.addEventListener('drop', (ev) => {
                ev.preventDefault();
                const recieved = JSON.parse(ev.dataTransfer.getData("data"));
                const hosting = ev.target['_column'];
                const cardTitles = hosting['cards'].map(e => e.title);
                if(hosting.id !== parseInt(recieved.columnId)){
                    if(checkIfTitleExists(recieved.title, cardTitles)){
                        alert("Card with the same title already exists.")
                    }else{
                        modifyCard({...recieved, columnId: hosting.id})
                    }
                }
        }, false);
        this.addEventListener('dragover', (e) => {
                e.preventDefault()
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
        this.innerHTML = `${mainStyle}`;
        d.forEach(column => {
            let $colCompEl = document.createElement('column-component');
            $colCompEl.column = column;
            this.appendChild($colCompEl);
        });
    }

    set dataSrc(data) {
        this.dataSet = data;
        this._render(data);
    }

    get dataSrc() {
        return this.dataSet;
    }

}

window.customElements.define('main-component', MainComponent);