import { Tree } from "./implementation.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const NODE_RADIUS = 20;
const X_GAP = 48;
const Y_GAP = 70;
const PADDING = 40;
const STEP_DELAY = 500;

let tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
let animationTimers = [];

const svg = document.querySelector("#tree-svg");
const output = document.querySelector("#output");
const status = document.querySelector("#status");
const arrayInput = document.querySelector("#array-input");
const valueInput = document.querySelector("#value-input");

// ---------- Rendering ----------

// Lay nodes out by in-order index (x) and depth (y) so the drawing never overlaps.
function layoutTree(root) {
  const positions = new Map();
  let index = 0;
  let maxDepth = 0;

  (function walk(node, depth) {
    if (node === null) return;
    walk(node.left, depth + 1);
    positions.set(node, {
      x: PADDING + index * X_GAP,
      y: PADDING + depth * Y_GAP,
    });
    index++;
    maxDepth = Math.max(maxDepth, depth);
    walk(node.right, depth + 1);
  })(root, 0);

  return { positions, count: index, maxDepth };
}

function createSvgElement(tag, attributes) {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
}

function render() {
  clearAnimation();
  svg.replaceChildren();

  if (tree.root === null) {
    svg.setAttribute("width", 300);
    svg.setAttribute("height", 80);
    const text = createSvgElement("text", { x: 20, y: 45, class: "empty" });
    text.textContent = "The tree is empty.";
    svg.appendChild(text);
    return;
  }

  const { positions, count, maxDepth } = layoutTree(tree.root);
  const width = PADDING * 2 + (count - 1) * X_GAP;
  const height = PADDING * 2 + maxDepth * Y_GAP;
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  const edges = createSvgElement("g", {});
  const nodes = createSvgElement("g", {});

  for (const [node, { x, y }] of positions) {
    for (const child of [node.left, node.right]) {
      if (child === null) continue;
      const childPos = positions.get(child);
      edges.appendChild(
        createSvgElement("line", {
          x1: x,
          y1: y,
          x2: childPos.x,
          y2: childPos.y,
          class: "edge",
        }),
      );
    }

    const group = createSvgElement("g", {
      class: "node",
      "data-value": node.data,
    });
    group.appendChild(createSvgElement("circle", { cx: x, cy: y, r: NODE_RADIUS }));
    const label = createSvgElement("text", { x, y });
    label.textContent = node.data;
    group.appendChild(label);
    group.addEventListener("click", () => {
      valueInput.value = node.data;
    });
    nodes.appendChild(group);
  }

  svg.append(edges, nodes);
}

// ---------- Highlighting ----------

function nodeElement(value) {
  return svg.querySelector(`.node[data-value="${CSS.escape(String(value))}"]`);
}

function clearHighlights() {
  svg
    .querySelectorAll(".node")
    .forEach((el) => el.classList.remove("visited", "active", "found", "path"));
}

function clearAnimation() {
  animationTimers.forEach(clearTimeout);
  animationTimers = [];
}

function highlight(value, className) {
  nodeElement(value)?.classList.add(className);
}

// Visit each value in order, showing the sequence as it goes.
function animateSequence(values, label) {
  clearAnimation();
  clearHighlights();
  output.textContent = `${label}: `;

  values.forEach((value, i) => {
    const timer = setTimeout(() => {
      svg.querySelector(".node.active")?.classList.replace("active", "visited");
      highlight(value, "active");
      output.textContent += (i === 0 ? "" : ", ") + value;
      if (i === values.length - 1) {
        animationTimers.push(setTimeout(() => {
          svg.querySelector(".node.active")?.classList.replace("active", "visited");
        }, STEP_DELAY));
      }
    }, i * STEP_DELAY);
    animationTimers.push(timer);
  });
}

// ---------- Helpers ----------

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}

function readValue() {
  const raw = valueInput.value.trim();
  const value = Number(raw);
  if (raw === "" || Number.isNaN(value)) {
    setStatus("Please enter a valid number.", true);
    return null;
  }
  return value;
}

function parseArray(text) {
  return text
    .split(/[\s,]+/)
    .filter((part) => part !== "")
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

function randomArray(size = 15, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
}

// Path from root to value, used to show how a search walks the tree.
function searchPath(value) {
  const path = [];
  let node = tree.root;
  while (node !== null) {
    path.push(node.data);
    if (value === node.data) break;
    node = value < node.data ? node.left : node.right;
  }
  return path;
}

function collect(traversal) {
  const values = [];
  tree[traversal]((n) => {
    values.push(n);
    return n;
  });
  return values;
}

function afterChange(message) {
  render();
  setStatus(`${message} Balanced: ${tree.isBalanced() ? "yes" : "no"}.`);
  output.textContent = "";
}

// ---------- Actions ----------

const actions = {
  build() {
    const values = parseArray(arrayInput.value);
    tree = new Tree(values);
    afterChange(`Built a tree from [${values.join(", ")}].`);
  },

  random() {
    const values = randomArray();
    arrayInput.value = values.join(", ");
    tree = new Tree(values);
    afterChange("Built a tree from random numbers.");
  },

  insert() {
    const value = readValue();
    if (value === null) return;
    if (tree.includes(value)) {
      setStatus(`${value} is already in the tree.`, true);
      return;
    }
    tree.insert(value);
    afterChange(`Inserted ${value}.`);
    highlight(value, "found");
  },

  delete() {
    const value = readValue();
    if (value === null) return;
    if (!tree.includes(value)) {
      setStatus(`${value} is not in the tree.`, true);
      return;
    }
    tree.deleteItem(value);
    afterChange(`Deleted ${value}.`);
  },

  find() {
    const value = readValue();
    if (value === null) return;
    const found = tree.includes(value);
    const path = searchPath(value);
    animateSequence(path, "Search path");
    animationTimers.push(
      setTimeout(() => {
        if (found) highlight(value, "found");
        setStatus(found ? `${value} is in the tree.` : `${value} is not in the tree.`, !found);
      }, path.length * STEP_DELAY),
    );
  },

  height() {
    const value = readValue();
    if (value === null) return;
    if (!tree.includes(value)) {
      setStatus(`${value} is not in the tree.`, true);
      return;
    }
    clearHighlights();
    highlight(value, "found");
    setStatus(`Height of ${value}: ${tree.height(value)}.`);
  },

  depth() {
    const value = readValue();
    if (value === null) return;
    if (!tree.includes(value)) {
      setStatus(`${value} is not in the tree.`, true);
      return;
    }
    clearAnimation();
    clearHighlights();
    searchPath(value).forEach((v) => highlight(v, "path"));
    highlight(value, "found");
    setStatus(`Depth of ${value}: ${tree.depth(value)}.`);
  },

  balanced() {
    setStatus(`Is the tree balanced? ${tree.isBalanced() ? "Yes" : "No"}.`);
  },

  rebalance() {
    tree = tree.rebalance();
    afterChange("Rebalanced the tree.");
  },

  levelOrder() {
    animateSequence(collect("levelOrderForEach"), "Level order");
  },

  inOrder() {
    animateSequence(collect("inOrderForEach"), "In order");
  },

  preOrder() {
    animateSequence(collect("preOrderForEach"), "Pre order");
  },

  postOrder() {
    animateSequence(collect("postOrderForEach"), "Post order");
  },

  clear() {
    clearAnimation();
    clearHighlights();
    output.textContent = "";
    setStatus("");
  },
};

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => actions[button.dataset.action]());
});

valueInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") actions.insert();
});

arrayInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") actions.build();
});

render();
setStatus(`Balanced: ${tree.isBalanced() ? "yes" : "no"}.`);
