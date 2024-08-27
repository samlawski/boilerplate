# ProgressList

This component lets you display a list of links together with a progress timeline that lets users track their progress going through the links. 

This can be used, for example, for learning material and tutorials. 

## Usage

Import the web component in your HTML or another JavaScript web component: 

```html
<script type="module" src="progress-list/index.js" defer></script>
```

Include the component in your HTML like this: 

```html
<progress-list></progress-list>
```

### Define list items

List items are passed to the component through its properties. For that you need to wait for the component to be "ready". You can use the included event listener for that: 

```html
<script>
  document.querySelector('progress-list').addEventListener('ready', function(){
    this.state.items = [
      {label: 'lesson 1', labelURL: 'https://mywebsite.com'},
      {label: 'lesson 2', labelURL: 'https://mywebsite.com'},
      {label: 'lesson 3', labelURL: 'https://mywebsite.com'},
      {label: 'lesson 22', labelURL: 'https://mywebsite.com'}
    ]
  })
</script>
```

Check the demo for a more comprehensive example of all the component's functionality.