start = Complex

Complex = "{" firstNode:Node nodes:("," Node)* "}" {
	var ns = [];
    nodes.forEach(function(n) {
    	ns.push(n[1]);
    });
    return [firstNode, ...ns];
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
KVTuple = key:Word "=" value:Word {
	var rs = {};
    rs[key] = value;
    return rs;
}

Word = chars:[0-9"'a-zA-Z.]+ {
	return chars.join("");
}