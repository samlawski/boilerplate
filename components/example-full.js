/**
 * The parent class of any component.
 * Import the class in another component's JS file 
 * or load it in the HTML `<head>` like this `<script src="example-full.js" type="module" defer></script>`.
 * You can use it like this: `<example-full></example-full>`.
 * You can set state properties from the outside when the component is ready. In HTML you can do it with an event listener:
 * `document.querySelector('progress-list').addEventListener('ready', function(){ console.log('Edit this.state properties here') })`
 */
class ExampleFull extends HTMLElement {
  /** @type {(string|Array)} List of observed attribute names will trigger a rerender on change. */
  static observedAttributes = []

  /**
   * Define all state properties here with `@property`
   * @typedef {Object} State
   * 
   */
  /** @type {State} Must be an object and any changes to it are observed and trigger a rerender. */
  static initialState = {}

  /**
   * Define the template to be (re)rendered with this component.
   * It will be rerendered if any top-level property of `this.state` changes.
   * @returns {string} Must be HTML as a string.
   */
  get template(){ return /* html */`
    <style>${this.css}</style>
    <h2>Hello World 👋!</h2>
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


  `}

  /**
   * Define event listeners to be registered after every rerender.
   * You may use this.onEvent() as a convenience method.
   */
  listen(){}

  // --- Custom Methods ---

  

  // --- Boilerplate Public Methods ---
  
  constructor(){
    super()
    this.attachShadow({mode: 'open'})
    
    /** @type {State} */
    this.state = this._reactiveState(this.constructor.initialState)
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

  _reactiveState(initialState){
    const self = this
    return new Proxy(initialState, {
      set(target, property, value){
        if(value !== target[property]){
          target[property] = value
          self._render()
          self.listen()
        }
        return true
      }
    })
  }

  _render(){
    this.shadowRoot.innerHTML = this.template
  }
}
customElements.define('example-full', ExampleFull)

export { ExampleFull }