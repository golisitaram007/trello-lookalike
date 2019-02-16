import { state } from '../state.js';
import { getRealData } from '../controllers/common.js';

const style = `
    <style>
        input {
            border-radius: 4px;
            border: none;
            width: 200px;
            padding: 8px 10px;
        }
    </style>
`;
const template = `
    <input placeholder="Search" id="globalsearch"/>
`;
export default class SearchComponent extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.innerHTML = style + template;
        this._data = getRealData();
    }

    

    connectedCallback() {
        let delay;
        this._shadowRoot
            .querySelector('#globalsearch')
            .addEventListener('keyup', (e) => {
                clearTimeout(delay);
                const search = e.target.value;
                delay = setTimeout(() => {
                    if(search.trim() == ''){
                        state.data = getRealData();
                    }else{
                        const searchFilter = this.searchObject(getRealData(), search.trim());
                        state.data = searchFilter;
                    }
                }, 500);
            });
    }

    get dataRecieved() {
        return this.getAttribute("dataRecieved");
    }
  
    set dataRecieved(value) {
        this.setAttribute("dataRecieved", value);
        this._getLatestData = state.data;
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (name === "dataRecieved" && this._shadowRoot && newVal) {
            this._getLatestData = state.data;
        }
    }

    searchObject(arr, keyword) {
        const regExp = new RegExp(keyword,"gi");
        const check = obj => {
            if (obj !== null && typeof obj === "object") { return Object.values(obj).some(check) }
            if (Array.isArray(obj)) { return obj.some(check) }
            return (typeof obj === "string" || typeof obj === "number") && regExp.test(obj);
        }
        return arr.filter(check);
    }
}


customElements.define('search-component', SearchComponent);