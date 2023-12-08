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

      .description-box {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-top: 20px;
        }

      .leftBtn {
        display: inline-block;
        padding-top: 20px;
        padding-left: 50px;
        font-size: 20px;
        width: 200px;
        height: 50px;
      }

      .rightBtn {
        display: inline-block;
        padding-top: 20px;
        padding-left: 500px;
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
          <h2>Top 10 Hardest Bosses in the Souls Series. Games Dark Souls 1 - 3, Bloodborne, Sekrio.</h2>
      </div>
      </div>
    </div>
    <div class="rightElement">
      <div class="guideboxes">
      <h2>${this.name}</h2>
        ${
          this.listings.map(
            (item, index) => html`
              <tv-channel 
                ?active="${index === this.activeIndex}"
                index="${index}"
                title="${item.title}"
                presenter="${item.metadata.author}"
                @click="${this.itemClick}"
                timecode= "${item.metadata.timecode}"
                thumbnail="${item.metadata.thumbnail}"
              >
              </tv-channel>
            `
          )
        }
      </div>
      </div>

      <div class="buttons">
        <div class="leftBtn">
        <button type="button">Previous</button>   
        </div>
        <div class="rightBtn">
          <button type="button"> Next</button>
      </div>
      </div>
      
    `;
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    console.log(e.target);
    // this will give you the current time so that you can progress what's active based on it playing
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").media.currentTime
    // this forces the video to play
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play()
    // this forces the video to jump to this point in the video via SECONDS
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').seek(e.target.timecode)
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
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
