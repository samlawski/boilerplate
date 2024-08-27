/**
 * A web component to display a progress bar of items.
 * The component exposes two custom events:
 * - 'ready' is triggered on initial load
 * - 'list-change' is triggered whenever a checkbox on the progress bar is clicked
 * Write and read `this.state.items` and `this.state.checkedItems` from outside the component. 
 */
class ProgressList extends HTMLElement {
  /**
   * @typedef {Object} State - Must be an object and any changes to it are observed and trigger a rerender.
   * @property {{label: string, labelURL: string}[]} items - The list of items.
   * @property {string[]} checkedItems - Strings of item IDs that have been checked.
   * @property {string} uid - Set a unique identifier in case multiple instances of this element exist on a page.
   */
  /** @type {State} */
  static initialState = {
    items: [],
    checkedItems: [],
    uid: '1'
  }

  /**
   * Define the template to be (re)rendered with this component.
   * It will be rerendered if any top-level property of `this.state` changes.
   * @returns {string} - must be HTML as a string.
   */
  get template(){ return /* html */`
    <style>${this.css}</style>

    <ul>
      ${this.state.items.map((item, i) => (
        `<li class="
          ${i <= this.state.currentItemIndex && 'active '}
          ${this.state.currentItemIndex == i && 'current '}"
        >
          <div aria-hidden="true" class="timeline">
            <div aria-hidden="true" class="timeline__line"></div>
          </div>

          <div class="content">
            <div class="timeline__item">
              <input 
                class="timeline__dot" 
                type="checkbox" 
                name="progress_item_${this.state.uid}_${i + 1}" 
                id="progress_item_${this.state.uid}_${i}"
                ${this.state.checkedItems.includes(`progress_item_${this.state.uid}_${i}`)  && 'checked'}
              >
              <a href=${item.labelURL} target="_blank">${item.label}</a>
            </div>

            <div class="timeline__insert">
              <slot name="${i}"></slot>
              <slot name="0"></slot>
            </div>
          </div>
        </li>`
      )).join('')}
    </ul>
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
      --progress-list--color-highlight: Navy;
      --progress-list--color-link: Navy;
      --progress-list--color-border: LightGray;
      --progress-list--color-bg, white;
    */

    ul {
      list-style: none;
      padding: 0;
    }
    li {
      padding: 0;
    }
    li a {
      padding: .4rem 0;
      display: inline-block;
  
      flex-grow: 1;
      text-decoration: none;

      color: var(--progress-list--color-link, Navy);
    }
  
    /* Timeline */
    li {
      display: flex;
    }
    .content {
      flex-grow: 1;
      border-bottom: 1px solid var(--progress-list--color-border, LightGray);
    }
    .timeline {
      flex-shrink: 0;
      flex-grow: 0;
      position: relative;
    }
    .timeline__line {
      background-color: var(--progress-list--color-border, LightGray);
      width: 4px;
      height: 100%;
      margin: 0 10px;
    }
    .timeline__insert {
      margin-left: 16px;
    }

    .timeline__item {
      display: flex;
      align-items: center;
  
      transition: all .4s;
    }
    .timeline__item:hover {
      background-color: var(--progress-list--color-highlight, Navy);
    }
    .timeline__item:hover a {
      color: white;
    }

    .timeline__dot {
      transform: scale(1.4);
      appearance: none;
      background-color: var(--progress-list--color-bg, white);
      border: 2px solid var(--progress-list--color-border, LightGray);
      border-radius: 50%;
      height: 16px;
      width: 16px;
      cursor: pointer;
      position: relative;

      z-index: 1;
      margin: 0 20px 0 -20px;
    }
    .timeline__dot:checked {
      background-color: var(--progress-list--color-highlight, Navy);
      border-color: var(--progress-list--color-highlight, Navy);
    }
  
    .current .timeline__dot::after {
      content: "";
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border-radius: 50%;
      border: 10px solid var(--progress-list--color-highlight, Navy);
      opacity: 0;
      animation: timeline_pulse 1.8s infinite;
    }
    .active .timeline__line {
      background-color: var(--progress-list--color-highlight, Navy);
    }
    .active .timeline__dot {
      border-color: var(--progress-list--color-highlight, Navy);
    }

    @keyframes timeline_pulse {
      0% {
        transform: scale(1);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.5);
        opacity: 0;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
  `}

  /**
   * Define event listeners to be registered after every rerender.
   * You may use this.onEvent() as a convenience method.
   */
  listen(){
    const self = this

    // Update list of checked items as they're clicked:
    this.onEvent('input[type="checkbox"]', 'change', function(){
      if(this.checked){
        self.state.checkedItems = [...new Set([...self.state.checkedItems, this.id])]
      }else{
        self.state.checkedItems = self.state.checkedItems.filter(item => item !== this.id)
      }
      self.updateTimelineFromCheckedItems()
      
      // Trigger custom event so that state changes can be stored externally
      self.dispatchEvent(new CustomEvent('list-change', { bubbles: true, composed: true }))
    })
  }

  // --- Custom Methods ---

  updateTimelineFromCheckedItems(){
    this.shadowRoot.querySelectorAll('li').forEach($el => {
      $el.classList.remove('active')
      $el.classList.remove('current')
    })

    for (const item of this.shadowRoot.querySelectorAll('li')) {
      const checkbox = item.querySelector('input[type="checkbox"]')
      
      item.classList.add('active')
      if(!checkbox.checked){
        item.classList.add('current')
        break;
      } 
    }
  }

  // --- Boilerplate Public Methods ---

  constructor(){
    super()
    this.attachShadow({mode: 'open'})

    // Initialize
    /** @type {State} */
    this.state = this._reactiveState(this.constructor.initialState)
    this._render()
    this.listen()
  }

  connectedCallback(){
    // Add  an event to allow for a ready-check in parent HTML
    this.dispatchEvent(new CustomEvent('ready', { bubbles: true, composed: true }))
    
    // Set initial timeline state:
    this.updateTimelineFromCheckedItems()
  }


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

  // --- Boilerplate ---

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
customElements.define('progress-list', ProgressList)

export { ProgressList }