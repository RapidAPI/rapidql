# Nodes

After being parsed by the parser, a query essentially becomes a forest of nodes (forest = graph structure with multiple trees). The interpreter than starts at the top of each tree.

## Execution

- During the execution, the interpreter will call the `eval()` function of the topmost node in each tree.
- The node will evaluate. If it has children nodes, it'll call their `eval()` function as well.
- When done, it'll return the data to be added to the result. The interperter will append that data to the result, under the key returned by the node's `getName()` function.

Thus, every node must implement the following methods:

- **`constructor()`**: used to build a node by the parser.
- **`getName()`**: returns the node name.
- **`async eval()`**: evaluates the node, returning a promise which will resolve to it's value.

## Node Hierarchy

![](http://i.imgur.com/gVaFokf.jpg)