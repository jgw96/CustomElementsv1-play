"use strict";

customElements.define('info-popover', class extends HTMLElement {
  constructor() {
    super();

    const doc = document.currentScript.ownerDocument;
    const tmpl = doc.querySelector('#popover-template');
    this._root = this.attachShadow({ mode: 'open' });
    this._root.appendChild(tmpl.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['open'];
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(val) {
    if (val) {
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('open');
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.open) {
      this.openMethod();
    }
  }

  openMethod() {
    const popover = this._root.querySelector('div');
    popover.style.display = 'block';
    const animation = popover.animate([
      { transform: 'translateY(110%)'},
      { transform: 'translateY(0)' }
    ], {
      easing: 'ease-in',
      duration: 400
    });

    animation.onfinish = () => {
      setTimeout(() => {
        const outAnimation = popover.animate([
          { transform: 'translateY(0)' },
          { transform: 'translateY(110%)' }
        ], {
          easing: 'ease-out',
          duration: 400
        });

        outAnimation.onfinish = () => {
          popover.style.display = 'none';
          this.removeAttribute('open');
        };
      }, 2500);
    }
  }

});