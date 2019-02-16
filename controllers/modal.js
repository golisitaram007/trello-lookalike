import { Modal } from '../components/ModalComponent.js';

export function createModal() {
    const modal = document.createElement('modal-component');
    document.querySelector('body').appendChild(modal);
    return new Modal();
}

export function destroyModal() {
    const modal = document.querySelector('modal-component');
    document.querySelector('body').removeChild(modal);
}