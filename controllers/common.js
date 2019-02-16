import { state } from '../state.js';
import Data from '../controllers/data.js';


export function checkIfTitleExists(title, arr) {
    return arr.includes(title.trim());
}
export function dataMapping(columns, cards) {
    return columns.map(col => {
        col.cards = cards.filter(card => {
            return parseInt(col.id) === parseInt(card.columnId) 
        });
        return col;
    });
}

export function fetchData() {
    const columnFetch = new Data('columns').getData();
    const cardFetch = new Data('cards').getData();
    const data = Promise.all([columnFetch, cardFetch]);
    data.then(([columns, cards]) => {
        state.data = dataMapping(columns, cards);
        localStorage.setItem('data', JSON.stringify(state.data));
        console.log("State Data###", state.data);
    });
}

export function getRealData() {
    return JSON.parse(localStorage.getItem('data'));
}

export function validateColumns(title, modify = null) {
    if(modify && (title.trim() === modify.trim())){
        return false;
    }else{
        const titleArr = state.data.map(e => e.title);
        return checkIfTitleExists(title, titleArr);
    }
}

export function validateCards(card, modify = null) {
    const column = state.data.find(e => e.id === parseInt(card.columnId));
    if(modify && (modify.title.trim() === card.title.trim())){
        return false;
    }else{
        const titleCard = column.cards.map(e => e.title);
        return checkIfTitleExists(card.title, titleCard);
    }
    
}
export function addColumn(data) {
    const postColumn = new Data('columns').postData(data);
    postColumn.then(res => {
        fetchData();
    });
}

export function deleteColumn(id) {
    const deleteCol = new Data(`columns/${id}`).deleteData();
    deleteCol.then(() => {
        fetchData();
    });
}

export function addCard(data) {
    const addCard = new Data('cards').postData(data);
    addCard.then(() => {
        fetchData();
    });
}

export function deleteCard(card) {
    const _deleteCard = new Data(`cards/${card.id}`).deleteData();
    _deleteCard.then(() => fetchData());
}

export function modifyCard(card) {
    const _modifyCard = new Data(`cards/${card.id}`).putData(card);
    _modifyCard.then(() => fetchData());
}

export function modifyColumn(column) {
    const _modifyColumn = new Data(`columns/${column.id}`).putData(column);
    _modifyColumn.then(() => fetchData());
}