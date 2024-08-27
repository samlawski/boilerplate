/**
 * Embed YouTube videos but don't insert them into the DOM before
 * the user's explicit consent.
 */
class YouTubeEmbed extends HTMLElement {
  /** @type {(string|Array)} List of observed attribute names will trigger a rerender on change. */
  static observedAttributes = ['videoId', 'title', 'width']

  /**
   * Define the template to be (re)rendered with this component.
   * It will be rerendered if any top-level property of `this.state` changes.
   * @returns {string} Must be HTML as a string.
   */
  get template(){ return /* html */`
    <style>${this.css}</style>
    <div class="yt_embed__outer" style="width: ${this.getAttribute('width')}px;">
    <div id="video_${this.getAttribute('videoId')}" class="yt_embed">
      <p>
        <strong>${this.getAttribute('title')}</strong>
        <button name="Play" title="Play YouTube Video">&#9658;</button>
        <small>By clicking "Play", you will open a YouTube Video and <a rel="noreferrer" href="https://policies.google.com/privacy" target="_blank">Google's privacy policy</a> applies.</small>
      </p>
    </div>
  </div>
  `}

  /**
   * Define CSS to be inserted right before this.template
   * @returns {string} Must be valid CSS as a string.
   */
  get css(){ return /*css */`
    /* Reset Component Styles */
    :host { display: block; }
    :host * { box-sizing: border-box; } 

    /* Custom CSS */
    /* The component's styles can be overwritten from parent components using the following variables:
      --youtube-embed--background: Navy;
      --youtube-embed--button: Navy;
      --youtube-embed--link: Lightyellow;
    */

    .yt_embed__outer {
      max-width: 100%;
      position: relative;
      background: var(--youtube-embed--background, Grey);
      margin: 10px 0;
    }
  
    .yt_embed {
      position: relative;
      padding-bottom: 56.25%;
      padding-top: 0;
      height: 0;
      overflow: hidden;
  
      display: flex;
      align-items: center;
      justify-content: center;
      
      margin: 20px 0;
    }
    .yt_embed p {
      display: block;
      margin-top: 56.25%;
      text-align: center;
      color: white;
  
      padding: 20px;
    }
    .yt_embed p > * {
      display: block;
      margin: 10px;
    }
    .yt_embed a {
      color: var(--youtube-embed--link, lightyellow);;
    }
    .yt_embed button {
      display: block;
      margin: auto;
  
      cursor: pointer;
      padding: 20px 50px;
      font-size: 3rem;
      border: 0;
      background: var(--youtube-embed--button, lightgray);
    }
    .yt_embed iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `}

  /**
   * Define event listeners to be registered after every rerender.
   * You may use this.onEvent() as a convenience method.
   */
  listen(){
    this.onEvent('button', 'click', e => this.handleButtonClick(e))
  }

  // --- Custom Methods ---

  handleButtonClick(event){
    this.shadowRoot.getElementById('video_' + this.getAttribute('videoId')).innerHTML = '<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/' + this.getAttribute('videoId') + '?autoplay=1&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
  }


  // --- Boilerplate Public Methods ---
  
  constructor(){
    super()
    this.attachShadow({mode: 'open'})
    window[this.localName] = this 
    
    /** @type {State} */
    this._render()
    this.listen()
  }

  connectedCallback(){
    // Add  an event to allow for a ready-check in parent HTML
    this.dispatchEvent(new CustomEvent('ready', { bubbles: true, composed: true }))
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue !== newValue){
      this._render()
      this.listen()
    }
  }

  // --- Boilerplate Helper Methods ---

  /**
   * Listen to events on all queried elements.
   * @param {string} selectorString Select all elements by the selector string
   * @param {string} eventString The event name, e.g. 'click' or 'input'
   * @param {function} callbackFunction The callback to be executed for each (!) selected element
   */
  onEvent(selectorString, eventString, callbackFunction){
    this.shadowRoot.querySelectorAll(selectorString).forEach($el => {
      $el.addEventListener(eventString, callbackFunction)
    })
  }

  // --- Boilerplate Private Methods ---

  _render(){
    this.shadowRoot.innerHTML = this.template
  }
}
customElements.define('youtube-embed', YouTubeEmbed)

export { YouTubeEmbed }