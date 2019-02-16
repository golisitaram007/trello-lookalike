import './components/MainComponent.js';
import './components/NavComponent.js';
import { fetchData } from './controllers/common.js';
import { state } from './state.js';

const $main = document.getElementById("mainApp");

window.addEventListener('load', () => {

    const navComponent = document.createElement('nav-component');
    const $section = document.createElement('section');
    $main.appendChild(navComponent);
    $main.appendChild($section);
    fetchData();

    console.log("Components Loaded");
    
});

state.registerListner((data) => {
    const mainComponent = document.createElement('main-component');
    mainComponent.dataSrc = data;
    $main.querySelector('section').innerHTML = '';
    $main.querySelector('section').appendChild(mainComponent);
    if(data){
        $main.querySelector('nav-component').dataRecieved = true;
    }
});