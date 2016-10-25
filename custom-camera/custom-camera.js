"use strict";

customElements.define('custom-camera', class extends HTMLElement {
  constructor() {
    super();

    const doc = document.currentScript.ownerDocument;
    const tmpl = doc.querySelector('#camera-template');
    this.root = this.attachShadow({ mode: 'open' });
    this.root.appendChild(tmpl.content.cloneNode(true));
  }

  connectedCallback() {
    this.root.querySelector('button').addEventListener('click', this.snapShot);

    const constraints = {
      video: true,
      audio: false
    };

    navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
      console.log(mediaStream);
      this.root.querySelector('video').src = window.URL.createObjectURL(mediaStream);
    }).catch((err) => {
      console.error(err);
    });
  }

  snapShot() {
    const canvas = this.parentNode.querySelector('canvas');
    const context = canvas.getContext('2d');
    const video = this.parentNode.querySelector('video');

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    console.log(canvas.toDataURL('image/jpg'));
    const imageData = canvas.toDataURL('image/jpg');
    fetch('http://localhost:8080/label', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: imageData
      })
    })
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data);
    })
    .catch(err => console.error(err));
  }
});