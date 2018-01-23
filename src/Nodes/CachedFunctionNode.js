/**
 * Created by iddo on 1/21/18.
 */
"use strict";

const hash = require('object-hash');

if (!global._function_node_cache) global._function_node_cache = {};

class CachedFunctionNode {
  constructor(innerNode) {
    this.innerNode = innerNode;
  }

  getName() {
    return this.innerNode.getName();
  }

  //noinspection JSAnnotator
  async eval(context, ops) {

    const processedArgs = this.innerNode.getProcessedArgs(context);

    const innerNodeHash = hash({
      name: this.innerNode.getName(),
      args: processedArgs
    });

    if (innerNodeHash in global._function_node_cache) {
      return await this.innerNode.continueTree(context, ops, await global._function_node_cache[innerNodeHash]);
    } else {
      global._function_node_cache[innerNodeHash] = this.innerNode.performFunction(processedArgs, context, ops);;
      const innerNodeValue = await global._function_node_cache[innerNodeHash];
      return await this.innerNode.continueTree(context, ops, innerNodeValue);
    }
  }
}

module.exports = CachedFunctionNode;