// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "@lrnwebcomponents/video-player/video-player.js";
import "./tv-channel.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.activeIndex = 0;
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeIndex: {type: Number},

    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        
      }
      .guideboxes {
        display: grid;
      }

      .videoContainer {
        display: grid;
      }

      .description-box {
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      .leftElement {
        grid-column: 1;
        size: 100px;
        margin-top: 50px;
        margin-left: 50px;
      }

      .rightElement{
        padding-left: 100px;
        grid-column: 2;
        width: 300px;
        font-size: .94rem;
        margin-top: 32px;
        text-align: center;
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
        height: 82.5vh;
      }

      .previous-button,
      .next-button {
        display: inline-block;
        padding-left: 20px;
        margin-left: 20px;
        margin-bottom: 15px;
        margin-top: 15px;
        font-size: 20px;
        width: 200px;
        height: 50px;
      }

      .thumbnail {
          max-width: 100%;
          height: auto;
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
    <div class="videoContainer">
      <div class="gridPlayer">
        <div class="leftElement">
        <!-- video -->
        <video-player class="player" source="https://www.youtube.com/watch?v=maBZZoK5Qbo" accent-color="orange" dark track="https://haxtheweb.org/files/HAXshort.vtt"></video-player>
        <div class="description-box">
          ${this.listings.length > 0 ? this.listings[this.activeIndex].description : ''}
      </div>
      </div>
    </div>
    <div class="rightElement">
      <div class="guideboxes">
      <h2>${this.name}</h2>
        ${this.listings.map(
            (item, index) => html`
              <tv-channel 
                ?active="${index === this.activeIndex}"
                index="${index}"
                title="${item.title}"
                presenter="${item.metadata.author}"
                @click="${this.itemClick}"
                timecode= "${item.metadata.timecode}"
                thumbnail="${item.metadata.thumbnail}"
                minuteTranslation="${item.metadata.minuteTranslation}"
              >
              </tv-channel>
            `
          )
        }
      </div>
      </div>

      <div class="buttons">
        <button class="previous-button" @click="${this.prevSlide}">Previous</button>
        <button class="next-button" @click="${this.nextSlide}">Next</button>
      </div>
      </div>
      
    `;
  }

  itemClick(e) {
    console.log(e.target);
    this.activeIndex= e.target.index;
    
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play();
   
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }

      if(propName === "activeIndex"){
        console.log(this.shadowRoot.querySelectorAll("tv-channel"));
        console.log(this.activeIndex)

        var activeChannel = this.shadowRoot.querySelector("tv-channel[index = '" + this.activeIndex + "' ] ");
       
        console.log(activeChannel);
        this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(activeChannel.timecode);
      }
      
    });
  }

  prevSlide() {
    this.activeIndex = Math.max(0, this.activeIndex - 1);
    
  }

  nextSlide() {
    this.activeIndex = Math.min(this.listings.length - 1, this.activeIndex + 1);  

  }


  connectedCallback() {
    super.connectedCallback();
    
    setInterval(() => {
      const currentTime = this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').media.currentTime;
      if (this.activeIndex + 1 < this.listings.length &&
          currentTime >= this.listings[this.activeIndex + 1].metadata.timecode) {
        this.activeIndex++;
      }
    }, 1000);
  }


  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
