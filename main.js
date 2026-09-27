import { Tree } from "./implementation.js";

let test = new Tree([
  1, 99, 2, 3, 4, 50, 50, 10, 22, 10, 33, 34, 100, 35, 6, 13, 35,
]);

test.insert(15);
test.insert(7);
test.insert(5);
test.insert(49);
test.insert(4);

test.deleteItem(49);
test.deleteItem(34);
test.deleteItem(50);
test.deleteItem(101);

console.log("Level order");
test.levelOrderForEach((n) => {
  console.log(n);
  return n;
});
console.log("In order");
test.inOrderForEach((n) => {
  console.log(n);
  return n;
});
console.log("Pre order");
test.preOrderForEach((n) => {
  console.log(n);
  return n;
});

console.log("Post order");
test.postOrderForEach((n) => {
  console.log(n);
  return n;
});

let num = 13;
console.log(`Depth ${num}:`, test.depth(num));

Tree.prettyPrint(test.root);
console.log(test.includes(51));
