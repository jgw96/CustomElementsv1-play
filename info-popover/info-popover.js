"use strict";

customElements.define('info-popover', class extends HTMLElement {
  constructor() {
    super();

    const doc = document.currentScript.ownerDocument;
    const tmpl = doc.querySelector('#popover-template');
    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(tmpl.content.cloneNode(true));
  }

  connectedCallback() {
    this._root.querySelector('button').addEventListener('click', this.open);
  }

  open() {
    const popover = this.parentNode.querySelector('div');
    popover.style.display = 'block';
    const animation = popover.animate([
      { opacity: 1 }
    ], {
      easing: 'ease-in',
      duration: 300
    });

    animation.onfinish = () => {
      popover.style.opacity = 1;
      setTimeout(() => {
        const outAnimation = popover.animate([
          { opacity: 0 }
        ], {
          easing: 'ease-out',
          duration: 300
        });

        outAnimation.onfinish = () => {
          popover.style.opacity = 0;
          popover.style.display = 'none';
        };
      }, 2500);
    }
  }
});