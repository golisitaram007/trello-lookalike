const modalStyle = `
<style>
*{
  box-sizing: border-box;
}
.wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.78);
  opacity: 0;
  visibility: hidden;
  transform: scale(1.1);
  transition: visibility 0s linear .25s,opacity .25s 0s,transform .25s;
  z-index: 1;
}
.visible {
  opacity: 1;
  visibility: visible;
  transform: scale(1);
  transition: visibility 0s linear 0s,opacity .25s 0s,transform .25s;
}
.modal {
  font-family: Helvetica;
  font-size: 14px;
  padding: 10px 10px 5px 10px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border-radius: 2px;
  min-width: 300px;
}
.header {
  font-size: 18px;
  border-bottom: 1px solid #ccc;
}
.button-container {
  text-align: right;
  border-top: 1px solid #ccc;
  padding: 10px 0;
}
button {
  min-width: 80px;
  background-color: #848e97;
  border-color: #848e97;
  border-style: solid;
  border-radius: 2px;
  padding: 3px;
  color:white;
  cursor: pointer;
}
button:hover {
  background-color: #6c757d;
  border-color: #6c757d;
}
.content {
    min-height: 100px;
    display: flex;
    align-items: center;
}
@media only screen and (min-width : 320px) and (max-width: 767px){
  .modal{
    width: 90%;
  }
}
</style>
`;

export class Modal extends HTMLElement {
  constructor() {
    super();
  }
 
  connectedCallback() {
    this._render();
    this._attachEventHandlers();
  }
  get visible() {
    return this.hasAttribute("visible");
  }

  set visible(value) {
    if(value) {
        this.setAttribute("visible", "");
    }else{
        this.removeAttribute("visible");
    }
  }

  get title() {
      return this.getAttribute("title");
  }

  set title(value) {
      this.setAttribute("title", value);
  }

  static get observedAttributes() {
    return ["visible", "title"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title" && this.shadowRoot) {
      this.shadowRoot.querySelector(".title").textContent = newValue;
    }
    if (name === "visible" && this.shadowRoot) {
      if (newValue === null) {
        this.shadowRoot.querySelector(".wrapper").classList.remove("visible");
      } else {
        this.shadowRoot.querySelector(".wrapper").classList.add("visible");
      }
    }
  }
  
 
  _render() {
    const wrapperClass = this.visible ? "wrapper visible" : "wrapper";
    const container = document.createElement("div");
    container.innerHTML = `${modalStyle}
      <div class="${wrapperClass}">
        <div class='modal'>
          <div class="header"><span class='title'>${this.title}</span></div>
          <div class='content'>
            <slot></slot>
          </div>
          <div class='button-container'>
            <button class='cancel'>Cancel</button>
            <button class='ok'>Okay</button>
          </div>
        </div>
      </div>`;
 
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(container);
  }

  _attachEventHandlers() {
    const cancelButton = this.shadowRoot.querySelector(".cancel");
    cancelButton.addEventListener('click', e => {
      this.dispatchEvent(new CustomEvent("cancel"))
    });
    const okButton = this.shadowRoot.querySelector(".ok");
    okButton.addEventListener('click', e => {
      this.dispatchEvent(new CustomEvent("ok"))
    });
  }

  open({...options}) {
    const $modal = document.querySelector("modal-component");
    const { title, content, submit, cancel } = options;
    $modal.innerHTML = content;
    $modal.setAttribute('title', title);
    $modal.visible = true;
    $modal.addEventListener("ok", e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        submit(e)
    });
    $modal.addEventListener("cancel", e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        cancel(e);
    });

  }

  close() {
    const $modal = document.querySelector("modal-component");
    $modal.innerHTML = '';
    $modal.setAttribute('title', '');
    $modal.removeAttribute('visible');
  }

  disconnectedCallback() {
    console.log('modal disconnected...!');
  }

}
window.customElements.define('modal-component', Modal);