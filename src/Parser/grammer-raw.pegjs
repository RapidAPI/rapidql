start = Complex

Complex = "{" firstNode:Node? nodes:("," Node)* "}" {
	var ns = [];
    nodes.forEach(function(n) {
    	ns.push(n[1]);
    });
    if (firstNode)
            return [firstNode, ...ns];
        else
            return [];
}

Node
	= FunctionNode
    / CompositeNode
	/ LeafNode

LeafNode = Word

CompositeNode = label:Word values:Complex {
    return {'label' : label, 'value': values};
}

FunctionNode = label:Word args:ArgSet values:Complex {
	return {'label': label, 'args': args, 'value': values};
}

ArgSet = "(" tuple:KVTuple? tuples:("," KVTuple)* ")" {
	let rs = {};
    Object.assign(rs, tuple);
    tuples.forEach(function(t) {
    	Object.assign(rs, t[1]); //each object in tuples is an array containg comma and them KVTuple
    });
	return rs;
}

//Key Value Tuple
KVTuple = key:Word ":" value:KVValue {
	var rs = {};
    rs[key] = value;
    return rs;
}

//Added new intermidiate type to support (key:{subkey:value})
KVValue = Word / KVCompValue

//This support having json types in args
KVCompValue = "{}" {return {};} //empty
	/ "{" key0:Word ":" value0:KVValue values:("," key:Word ":" value:KVValue)* "}" {
    	let rs = {};
        rs[key0] = value0;
        values.forEach(function(t) {
        	rs[t[1]] = t[3];
        });
        return rs;
    }

Word = chars:[<=>-@_0-9"'a-zA-Z.]+ {
	return chars.join("");
}