/**
 * The parent class of any component.
 * Import the class in another component's JS file 
 * or load it in the HTML `<head>` like this `<script src="example-full.js" type="module" defer></script>`.
 * You can use it like this: `<example-full></example-full>`.
 */
class ExampleFull extends HTMLElement {
  constructor(state = {}){
    super()
    this.attachShadow({mode: 'open'})

    this.state = this._reactiveState(state)

    this._render()
    this.listen()
  }

  // --- Boilerplate Public Methods ---

  /**
   * Define the template to be (re)rendered with this component.
   * It will be rerendered if any top-level property of `this.state` changes.
   * @returns {string} - must be HTML as a string.
   */
  get template(){ return /* html */`
    <style>${this.css}</style>
    <h2>Hello World 👋!</h2>
  `}

  /**
   * Define CSS to be inserted right before this.template
   */
  get css(){ return /*css */`
    // Reset component styles:
    :host { display: block; }
    :host * { box-sizing: border-box; } 

    // Custom CSS:


  `}

  /**
   * Define event listeners to be registered after every rerender.
   */
  listen(){}

  // --- Custom Methods ---

  


  // --- Boilerplate Helper Methods ---

  /**
   * Listen to events on all queried elements.
   * @param {string} selectorString - Select all elements by the selector string
   * @param {string} eventString - The event name, e.g. 'click' or 'input'
   * @param {function} callbackFunction - The callback to be executed for each (!) selected element
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