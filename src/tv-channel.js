// import stuff
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.title = '';
    this.video = '';
    this.presenter = '';
    this.thumbnail = '';
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      video: {type: String},
      presenter: { type: String },
      timecode: {type: Number},
      thumbnail: {type: String},
      active: {type: Boolean, reflect: true},
      index: {type: Number}
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        display: inline-flex;
      }
      .thumbnail {
        max-width: 100%;
        height: auto;
        margin-bottom: 10px;
        object-fit: cover;
      }
      .wrapper {
        padding-top: 10px;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 10px;
        background-color: #eeeeee;
        margin-top: 12px;
      }
    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper">
        <img class="thumbnail" src="${this.thumbnail}" alt="${this.title}">
        <h3>${this.title}</h3>
        <h3>${this.video}</h3>
        <h4>${this.presenter}</h4>
        <slot></slot>
      </div>  
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
