// Saroj Rawal(080BCT076)

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.x = 0;
    this.y = 0;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
    this.history = [];
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));
    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));

    return x;
  }

  leftRotate(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = 1 + Math.max(this.getHeight(x.left), this.getHeight(x.right));
    y.height = 1 + Math.max(this.getHeight(y.left), this.getHeight(y.right));

    return y;
  }

  insert(value) {
    this.history.push(this.clone(this.root));
    this.root = this._insert(this.root, value);
  }

  _insert(node, value) {
    if (!node) return new TreeNode(value);

    if (value < node.value) node.left = this._insert(node.left, value);
    else if (value > node.value) node.right = this._insert(node.right, value);
    else return node;

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    // Rotations
    if (balance > 1 && value < node.left.value) return this.rightRotate(node);
    if (balance < -1 && value > node.right.value) return this.leftRotate(node);
    if (balance > 1 && value > node.left.value) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    if (balance < -1 && value < node.right.value) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }

  delete(value) {
    this.history.push(this.clone(this.root));
    this.root = this._delete(this.root, value);
  }

  _delete(node, value) {
    if (!node) return node;

    if (value < node.value) node.left = this._delete(node.left, value);
    else if (value > node.value) node.right = this._delete(node.right, value);
    else {
      if (!node.left || !node.right) {
        const temp = node.left || node.right;
        if (!temp) return null;
        else return temp;
      }

      let temp = this.minValueNode(node.right);
      node.value = temp.value;
      node.right = this._delete(node.right, temp.value);
    }

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    if (balance > 1 && this.getBalance(node.left) >= 0) return this.rightRotate(node);
    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }
    if (balance < -1 && this.getBalance(node.right) <= 0) return this.leftRotate(node);
    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }

  minValueNode(node) {
    let current = node;
    while (current.left) current = current.left;
    return current;
  }

  traverse(type) {
    let result = [];
    const inorder = node => {
      if (!node) return;
      inorder(node.left);
      result.push(node.value);
      inorder(node.right);
    };
    const preorder = node => {
      if (!node) return;
      result.push(node.value);
      preorder(node.left);
      preorder(node.right);
    };
    const postorder = node => {
      if (!node) return;
      postorder(node.left);
      postorder(node.right);
      result.push(node.value);
    };

    if (type === "inorder") inorder(this.root);
    if (type === "preorder") preorder(this.root);
    if (type === "postorder") postorder(this.root);

    return result;
  }

  search(value) {
    return this._search(this.root, value);
  }

  _search(node, value) {
    if (!node || node.value === value) return node;
    if (value < node.value) return this._search(node.left, value);
    return this._search(node.right, value);
  }

  clone(node) {
    if (!node) return null;
    const newNode = new TreeNode(node.value);
    newNode.height = node.height;
    newNode.left = this.clone(node.left);
    newNode.right = this.clone(node.right);
    return newNode;
  }

  undo() {
    if (this.history.length > 0) {
      this.root = this.history.pop();
    }
  }
}

const tree = new AVLTree();
const canvas = document.getElementById("canvas");
const traversalOutput = document.getElementById("traversalOutput");

function insertNode() {
  const input = document.getElementById("insertInput");
  const value = parseInt(input.value);
  if (!isNaN(value)) {
    tree.insert(value);
    drawTree();
  }
  input.value = "";  // Clear the input field
}

function deleteNode() {
  const input = document.getElementById("deleteInput");
  const value = parseInt(input.value);
  if (!isNaN(value)) {
    tree.delete(value);
    drawTree();
  }
  input.value = "";  // Clear the input field
}


async function searchNode() {
  const input = document.getElementById("searchInput");
  const value = parseInt(input.value);
  if (isNaN(value)) return;

  const delay = (ms) => new Promise(res => setTimeout(res, ms));
  const speedEl = document.getElementById("speed");
  const animationSpeed = (speedEl ? parseInt(speedEl.value) : 1) * 100;

  let node = tree.root;
  while (node) {
    const nodeEl = [...canvas.querySelectorAll(".node")]
      .find(n => n.textContent.trim().startsWith(node.value));

    if (nodeEl) {
      nodeEl.classList.add("searching");
      await delay(animationSpeed);
      nodeEl.classList.remove("searching");
    }

    if (value === node.value) {
      nodeEl.classList.add("found");
      await delay(2000);
      nodeEl.classList.remove("found");
      input.value = "";  // ✅ Clear input field after successful search
      return;
    }

    node = value < node.value ? node.left : node.right;
  }

  // If not found
  const notFoundEl = [...canvas.querySelectorAll(".node")]
    .reverse()
    .find(n => n.textContent.trim().startsWith(value));
  if (notFoundEl) {
    notFoundEl.classList.add("not-found");
    await delay(2000);
    notFoundEl.classList.remove("not-found");
  }

  input.value = "";  // ✅ Clear input field even if not found
}


function resetTree() {
  tree.root = null;
  tree.history = [];
  drawTree();
}

function undo() {
  tree.undo();
  drawTree();
}

function inorderTraversal() {
  const type = document.getElementById("traversalType").value;
  const result = tree.traverse(type);
  traversalOutput.textContent = `[ ${result.join(", ")} ]`;
}

function drawTree() {
  canvas.innerHTML = "";
  if (!tree.root) return;

  const levelHeight = 80;
  const nodeGap = 50;
  const showBalance = document.getElementById("balanceToggle")?.checked;

  const setPositions = (node, depth = 0, x = 0) => {
    if (!node) return 0;
    const left = setPositions(node.left, depth + 1, x);
    const currX = x + left;
    const right = setPositions(node.right, depth + 1, currX + 1);
    node.x = currX * nodeGap + 50;
    node.y = depth * levelHeight + 20;
    return left + 1 + right;
  };
  setPositions(tree.root);

  // Determine bounds for the drawn nodes to size the canvas
  const nodes = [];
  (function collect(n){ if(!n) return; nodes.push(n); collect(n.left); collect(n.right);} )(tree.root);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x);
    maxX = Math.max(maxX, n.x + 40);
    minY = Math.min(minY, n.y);
    maxY = Math.max(maxY, n.y + 40);
  }
  const padding = 60;
  const width = Math.max(600, Math.ceil(maxX - minX + padding * 2));
  const height = Math.max(300, Math.ceil(maxY - minY + padding * 2));

  const canvasEl = document.getElementById("canvas");
  canvasEl.style.width = width + "px";
  canvasEl.style.height = height + "px";

  // Use a simple padding offset; do not center based on available width
  const xOffset = padding - minX;
  const yOffset = padding - minY;

  const drawLineOffset = (parent, child) => {
    const x1 = parent.x + 20 + xOffset;
    const y1 = parent.y + 20 + yOffset;
    const x2 = child.x + 20 + xOffset;
    const y2 = child.y + 20 + yOffset;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    const line = document.createElement("div");
    line.className = "line";
    line.style.width = length + "px";
    line.style.left = x1 + "px";
    line.style.top = y1 + "px";
    line.style.transform = `rotate(${angle}deg)`;
    canvas.appendChild(line);
  };

  const drawWithOffset = (node) => {
    if (!node) return;
    if (node.left) drawLineOffset(node, node.left);
    if (node.right) drawLineOffset(node, node.right);

    const div = document.createElement("div");
    div.className = "node";
    div.style.left = (node.x + xOffset) + "px";
    div.style.top = (node.y + yOffset) + "px";
    div.textContent = node.value;

    if (showBalance) {
      const bf = document.createElement("span");
      bf.style.fontSize = "10px";
      bf.style.position = "absolute";
      bf.style.top = "-10px";
      bf.style.left = "50%";
      bf.style.transform = "translateX(-50%)";
      bf.style.color = "limegreen";
      bf.textContent = tree.getBalance(node);
      div.appendChild(bf);
    }

    // Tooltip handlers
    div.addEventListener("mouseenter", function () {
      const tooltip = document.getElementById("nodeTooltip");
      if (!tooltip) return;
      tooltip.style.display = "block";
      tooltip.innerHTML = `
        <strong>Value:</strong> ${node.value}<br>
        <strong>Height:</strong> ${node.height}<br>
        <strong>Left Child:</strong> ${node.left ? node.left.value : "null"}<br>
        <strong>Right Child:</strong> ${node.right ? node.right.value : "null"}
      `;
    });
    div.addEventListener("mousemove", function (e) {
      const tooltip = document.getElementById("nodeTooltip");
      if (!tooltip) return;
      tooltip.style.left = (e.pageX + 15) + "px";
      tooltip.style.top = (e.pageY - 10) + "px";
    });
    div.addEventListener("mouseleave", function () {
      const tooltip = document.getElementById("nodeTooltip");
      if (tooltip) tooltip.style.display = "none";
    });

    canvas.appendChild(div);
    drawWithOffset(node.left);
    drawWithOffset(node.right);
  };

  drawWithOffset(tree.root);
}
document.querySelector(".traverse").onclick = inorderTraversal;
document.querySelector(".reset").onclick = resetTree;
document.querySelector(".undo").onclick = undo;
const insertBtn = document.querySelector(".insert");
if (insertBtn) insertBtn.onclick = insertNode;
const deleteBtn = document.querySelector(".delete");
if (deleteBtn) deleteBtn.onclick = deleteNode;
const searchBtn = document.querySelector(".search");
if (searchBtn) searchBtn.onclick = searchNode;

const balanceToggle = document.getElementById("balanceToggle");
if (balanceToggle) {
  balanceToggle.addEventListener("change", drawTree);
}

// Initial render
drawTree();

function toggleModal() {
  const modal = document.getElementById("avlModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}


document.getElementById("insertInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    insertNode();
  }
});

document.getElementById("deleteInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    deleteNode();
  }
});

document.getElementById("searchInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchNode();
  }
});
