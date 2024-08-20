/**
 * The parent class of any component.
 * Import the class in another component's JS file 
 * or load it in the HTML `<head>` like this `<script src="example-simple.js" type="module" defer></script>`.
 * You can use it like this: `<example-simple></example-simple>`.
 */
class ExampleSimple extends HTMLElement {
  constructor(state = {}){
    super()

    this._render()
  }

  // --- Boilerplate Public Methods ---

  /**
   * Define the template to be (re)rendered with this component.
   * It will be rerendered if any top-level property of `this.state` changes.
   * @returns {string} - must be HTML as a string.
   */
  get template(){ return /* html */`
    <h2>Hello World 👋!</h2>
  `}

  // --- Custom Methods ---



  // --- Boilerplate Private Methods ---
  _render(){
    this.innerHTML = this.template
  }
}
customElements.define('example-simple', ExampleSimple)

export { ExampleSimple }