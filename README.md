# AVL Tree Visualizer by Saroj Rawal(080BCT076)

A small interactive AVL Tree visualizer built with plain HTML, CSS and JavaScript.

This repository contains a single-page app that lets you insert, delete and search values in an AVL tree and see how the tree balances itself.

## Features
- Insert / Delete / Search nodes
- Visual display of tree structure with connecting lines
- Optional balance factor display per node
- Hover tooltip for a node showing value, height, left child and right child
- Traversal outputs (inorder, preorder, postorder)

## Files
- `index.html` — main UI and markup
- `style.css` — styles for the UI and canvas
- `script.js` — AVL logic and rendering code

## How to run (local)
You can open `index.html` directly in a browser (double-click) for basic usage. For a more stable local experience (avoids some browser restrictions), serve the folder via a simple HTTP server.

PowerShell examples:

- Using Python 3 (recommended if installed):

```powershell
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

- Using Node (serve):

```powershell
npx serve .
# then open the provided local URL in your browser
```
## Quick usage
🔗 **Live Demo:** [Click here to try it out!](https://avltree-saroj.netlify.app/)

1. Open the app (index.html or via local server).
2. Insert values using the Insert field + button — the tree will update.
3. Use Delete to remove a node.
4. Use Search to highlight a node (animated).
5. Toggle the balance factor checkbox (if present) to show/hide node balance values.



## Developer notes
- Layout is implemented using simple absolutely-positioned node elements and line divs. Node positions are computed in `script.js`.
- If you plan to change spacing, adjust `levelHeight` and `nodeGap` inside `drawTree()`.
- The tooltip element `#nodeTooltip` is created in the HTML and styled in `style.css`.

## Contributing
PRs and issues welcome. Small, focused changes are easiest to review.

## License
MIT


