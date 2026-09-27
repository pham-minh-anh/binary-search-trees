class Node {
  constructor(data = null, right = null, left = null) {
    this.data = data;
    this.right = right;
    this.left = left;
  }
}

class Tree {
  constructor(arr) {
    this.root = Tree.#buildTree(arr);
  }

  static #buildTree(array) {
    const uniqueArray = [...new Set(array)];

    if (uniqueArray.length === 0) {
      return null;
    }

    uniqueArray.sort((a, b) => a - b);

    const midIndex = Math.floor(uniqueArray.length / 2);
    const middleNum = uniqueArray[midIndex];
    const root = new Node(middleNum);
    const leftHalf = uniqueArray.slice(0, midIndex);
    const rightHalf = uniqueArray.slice(midIndex + 1);
    root.right = Tree.#buildTree(rightHalf);
    root.left = Tree.#buildTree(leftHalf);

    return root;
  }

  static prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null || node === undefined) {
      return;
    }

    Tree.prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    Tree.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  };

  includes(value) {
    return Tree.#search(this.root, value);
  }

  static #search(node, value) {
    if (node === null) return false;
    if (value === node.data) return true;

    return value < node.data
      ? Tree.#search(node.left, value)
      : Tree.#search(node.right, value);
  }

  insert(value) {
    this.root = Tree.#insertNode(this.root, value);
  }
  static #insertNode(node, value) {
    if (node === null) {
      return new Node(value);
    }
    if (value < node.data) {
      node.left = Tree.#insertNode(node.left, value);
    } else if (value > node.data) {
      node.right = Tree.#insertNode(node.right, value);
    }
    return node;
  }

  deleteItem(value) {
    this.root = Tree.#deleteNode(this.root, value);
  }
  // Return the new node after deleted
  static #deleteNode(node, value) {
    if (node === null) {
      return node;
    }
    if (value < node.data) {
      node.left = Tree.#deleteNode(node.left, value);
    } else if (value > node.data) {
      node.right = Tree.#deleteNode(node.right, value);
    } else {
      if (node.right === null && node.left === null) {
        return null;
      } else if (node.right === null) {
        return node.left;
      } else if (node.left === null) {
        return node.right;
      } else {
        let replaceNode = node.right;
        while (replaceNode.left != null) {
          replaceNode = replaceNode.left;
        }
        node.data = replaceNode.data;
        node.right = Tree.#deleteNode(node.right, replaceNode.data);
        return node;
      }
    }
    return node;
  }

  levelOrderForEach(callback) {
    if (!callback) {
      throw new Error("Call back not specified.");
    }
    if (this.root === null) {
      return;
    }
    let queue = [];
    let length = 0;
    queue.push(this.root);
    length++;
    while (length > 0) {
      let current = queue.shift();
      length--;
      if (current.left !== null) {
        queue.push(current.left);
        length++;
      }
      if (current.right !== null) {
        queue.push(current.right);
        length++;
      }
      current.data = callback(current.data);
    }
  }

  inOrderForEach(callback) {
    if (!callback) {
      throw new Error("Call back not specified.");
    }
    Tree.#inOrderNodeRecurs(this.root, callback);
  }
  static #inOrderNodeRecurs(node, callback) {
    if (node === null) {
      return;
    }
    Tree.#inOrderNodeRecurs(node.left, callback);
    node.data = callback(node.data);
    Tree.#inOrderNodeRecurs(node.right, callback);
  }

  preOrderForEach(callback) {
    if (!callback) {
      throw new Error("Call back not specified.");
    }
    Tree.#preOrderNodeRecurs(this.root, callback);
  }
  static #preOrderNodeRecurs(node, callback) {
    if (node === null) {
      return;
    }
    node.data = callback(node.data);
    Tree.#preOrderNodeRecurs(node.left, callback);
    Tree.#preOrderNodeRecurs(node.right, callback);
  }

  postOrderForEach(callback) {
    if (!callback) {
      throw new Error("Call back not specified.");
    }
    Tree.#postOrderNodeRecurs(this.root, callback);
  }
  static #postOrderNodeRecurs(node, callback) {
    if (node === null) {
      return;
    }
    Tree.#postOrderNodeRecurs(node.left, callback);
    Tree.#postOrderNodeRecurs(node.right, callback);
    node.data = callback(node.data);
  }

  depth(value) {
    return Tree.#depthSearch(this.root, value);
  }

  static #depthSearch(node, value) {
    let height = 0;
    if (node === null) {
      return;
    }
    if (node.data === value) {
      return height;
    } else if (node.data > value) {
      height++;
      height += Tree.#depthSearch(node.left, value);
    } else {
      height++;
      height += Tree.#depthSearch(node.right, value);
    }
    return height;
  }

  isBalanced() {}
}

export { Tree };
