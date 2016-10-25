"use strict";

customElements.define('custom-header', class extends HTMLElement {
  constructor() {
    super();

    const doc = document.currentScript.ownerDocument;
    const tmpl = doc.querySelector('#header-template');
    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(tmpl.content.cloneNode(true));
  }

  connectedCallback() {
    console.log('custom header in the dom');
  }
});