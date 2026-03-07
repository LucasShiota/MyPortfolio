# PopUpPanel: Explain Like I'm 5 (ELI5)

Imagine you have a **magic button** and a **secret menu** that drops down below it.

You want the magic button to:

1. Show the secret menu when you click or hover over it.
2. **Stay looking "highlighted"** (like it's still being hovered) even when your mouse moves down into the secret menu itself.

Here is how the new `PopUpPanel` makes that happen without any messy, hardcoded code.

---

### The Setup

The `PopUpPanel` is basically just a wrapper container (a parent). You give the parent two children:

1. **The Trigger** (your button)
2. **The Panel** (your secret menu)

```html
<PopUpPanel>
  <!-- 1. THE TRIGGER -->
  <button slot="trigger" class="my-cool-button">Click Me!</button>

  <!-- 2. THE PANEL -->
  <div class="panel-section">Here is the secret stuff!</div>
</PopUpPanel>
```

### The Magic Sticker (`aria-expanded`)

When your mouse hovers over the button… **OR** when your mouse moves down into the panel… the `PopUpPanel` does **one** simple thing:

It slaps an invisible sticker onto your `<button>` that says: `aria-expanded="true"`.
When your mouse leaves, it rips the sticker off: `aria-expanded="false"`.

### How Your CSS Uses The Sticker

In your CSS, you normally have a hover effect for your button, like this:

```css
.my-cool-button:hover {
  background-color: blue; /* Turns blue when my mouse is on it */
}
```

Now, we just tell the CSS to _also_ trigger that exact same effect whenever it's wearing the magic sticker!

```css
.my-cool-button:hover,
.my-cool-button[aria-expanded="true"] {
  background-color: blue; /* Turns blue if my mouse is on it OR if the panel is open! */
}
```

### Why this is awesome (and Modular)

Because the `PopUpPanel` **only** handles putting on and taking off the sticker, it doesn't care what your button looks like.

You can put a round icon button, a big green text button, or a tiny link inside the trigger slot. As long as you add `, .your-button-class[aria-expanded="true"]` next to its normal `:hover` CSS rule, it will perfectly link up with the open/close state of the panel!
