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
    let clickAnimation = this.animate(
      [
        { transform: 'translateY(0)' },
        { transform: 'translateY(15%)'},
        { transform: 'translateY(0)' }
      ], {
        easing: 'ease-in-out',
        duration: 500
      }
    );
    clickAnimation.onfinish = () => {
      if (this.parentNode.querySelector('li') !== null) {
        let elements = this.parentNode.querySelectorAll('li');
        elements.forEach((item) => {
          let animation = item.animate([
            { transform: 'translateX(110%)' }
          ], {
            duration: 700,
            easing: 'ease-out'
          });
          animation.onfinish = () => {
            item.parentNode.removeChild(item);
          };
        });
      }
      const canvas = this.parentNode.querySelector('canvas');
      const context = canvas.getContext('2d');
      const video = this.parentNode.querySelector('video');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

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
        if (data.data.length > 0) {
          const list = this.parentNode.querySelector('ul');
          data.data.forEach((label) => {
            let listItem = document.createElement('li');
            let node = document.createTextNode(label);
            listItem.appendChild(node);

            list.appendChild(listItem);
            listItem.animate([
              { opacity: 0 },
              { opacity: 1 }
            ], {
              easing: 'ease-in',
              duration: 500
            });
          });
        } else {
          const list = this.parentNode.querySelector('ul');
          let listItem = document.createElement('li');
          let node = document.createTextNode('No landmark found');
          listItem.appendChild(node);

          list.appendChild(listItem);
          listItem.animate([
            { opacity: 0 },
            { opacity: 1 }
          ], {
            easing: 'ease-in',
            duration: 500
          });
        }
      })
      .catch(err => console.error(err));
      }
    }
});