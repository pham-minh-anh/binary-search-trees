# Binary Search Trees

A balanced binary search tree (BST) in JavaScript, with a browser page that draws the tree and lets you try each of its functions.

**Live demo:** https://pham-minh-anh.github.io/binary-search-trees/

## Authorship

| File | Written by |
| --- | --- |
| `implementation.js` | Me (the project author) |
| `main.js` | Me (the project author) |
| `dom.js` | [Claude](https://claude.ai/code) (AI assistant) |
| `index.html` | [Claude](https://claude.ai/code) (AI assistant) |

I wrote the binary search tree itself (the `Node` and `Tree` classes and every tree function) in `implementation.js`, and the console tests in `main.js`.
Claude wrote the visual interface: the tree drawing and controls in `dom.js`, and the page layout and styles in `index.html`. The interface only calls the public methods of my `Tree` class and doesn't change the implementation.

## Features

### Tree implementation (`implementation.js`)

- `new Tree(array)` builds a balanced BST from an array. Duplicates are removed and the values are sorted first.
- `insert(value)` adds a value.
- `deleteItem(value)` removes a value. Nodes with zero, one or two children are all handled.
- `includes(value)` checks whether a value is in the tree.
- `levelOrderForEach(callback)` visits nodes breadth-first.
- `inOrderForEach(callback)`, `preOrderForEach(callback)` and `postOrderForEach(callback)` visit nodes depth-first.
- `height(value)` gives the number of edges from the node to its deepest leaf.
- `depth(value)` gives the number of edges from the root to the node.
- `isBalanced()` checks that no node's two subtrees differ in height by more than 1.
- `rebalance()` returns a new, balanced tree with the same values.
- `Tree.prettyPrint(node)` prints the tree to the console.

### Visualizer (`dom.js` + `index.html`)

- Draws the tree as SVG and redraws it after every change.
- Builds a tree from a list of numbers you type, or from random numbers.
- Has buttons for insert, delete, find, height and depth. **Find** animates the path the search takes.
- Animates the level-order, in-order, pre-order and post-order traversals and lists the values in the order they're visited.
- Checks whether the tree is balanced and can rebalance it.
- Clicking a node puts its value in the input box.

## Project structure

```
.
├── implementation.js   # BST implementation (author)
├── main.js             # Console tests (author)
├── dom.js              # Visualizer logic (Claude)
└── index.html          # Page layout and styles (Claude)
```
