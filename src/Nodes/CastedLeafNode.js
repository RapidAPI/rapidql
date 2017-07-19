/**
 * Created by iddo on 7/14/17.
 */
"use strict";

const typeConverters = {
    int(val) {
        if (typeof val === 'number' || typeof val === 'string') {
            if(!isNaN(parseInt(val)))
                return parseInt(val);
            else
                throw `String ${val} cannot be casted into an int`;
        } else {
            throw `TypeError: Type ${typeof val} cannot be casted to an int`;
        }
    },
    float(val) {
        if (typeof val === 'number' || typeof val === 'string') {
            if(!isNaN(parseFloat(val)))
                return parseFloat(val);
            else
                throw `String ${val} cannot be casted into an float`;
        } else {
            throw `TypeError: Type ${typeof val} cannot be casted to an float`;
        }
    },
    date(val) {
        // Special check for boolean
        if (typeof val === 'boolean')
            throw `TypeError: cannot convert ${val} to a date`;

        // Convert to date object
        const tempDate = new Date(val);

        // Check it is valid
        if (!isNaN(tempDate.getTime())) {
            // Convert to 0 timezone
            return tempDate;
        } else {
            throw `TypeError: cannot convert ${val} to a date`;
        }
    }
};

class CastedLeafNode {
    constructor(type, innerNode) {
        this.type = type.toLowerCase();
        if (!typeConverters.hasOwnProperty(this.type))
            throw `TypeCastedLeaf node does not support casting to type ${type}`;
        this.innerNode = innerNode;
    }

    getName() {
        return this.innerNode.getName();
    }

    //noinspection JSAnnotator
    async eval(context, ops) {
        const innerValue = await this.innerNode.eval(context, ops);
        return typeConverters[this.type](innerValue);
    }
}

module.exports = CastedLeafNode;
module.exports.typeConverters = typeConverters;