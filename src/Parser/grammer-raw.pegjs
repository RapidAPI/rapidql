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
	= RenameNode
    / OptionalNode
    / LogicNode
    / CachedFunctionNode
    / FunctionNode
    / CompositeNode
   	/ CastedLeafNode
	/ LeafNode

RenameNode = name:Word ":" n:Node {
	return {type: 'rename', value:n, name:name}
}

OptionalNode = "?" n:Node {
	return {type: 'optional', value:n}
}

CastedLeafNode = cast:Word "(" innerNode:LeafNode ")" {
	return {cast:cast, innerNode:innerNode}
}

LeafNode = Word

CompositeNode = label:Word values:Complex {
    return {'label' : label, 'value': values};
}

LogicNode = "@" n:FunctionNode f:LogicNode?{
	return {'t':'logic', 'l':n.label, 'a':n.args,'f':f};
}

CachedFunctionNode = "*" n:FunctionNode {
	return {type: 'cached', value:n}
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
KVValue = Number / ValueWord / Word / KVCompValue / KVArray

//Support array parameters
KVArray = "[" el0:KVValue? els:("," value:KVValue)* "]" {
	let res = [];
    if (el0) {
    	res[0] = el0;
        els.forEach(function(e) {
        	res.push(e[1]);
        });
    }
    return res;
}

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

Word = chars:[-$!<=>@_0-9a-zA-Z.]+ {
	return chars.join("");
} / str:StringLiteralValue {
    return str.slice(1,-1);
}

ValueWord = StringLiteralValue

Number = sign:"-"? chars:[-.0-9]+ {
	return parseFloat([sign].concat(chars).join(""));
}

StringLiteralValue
  = '"' chars:DoubleStringCharacter* '"' { return '"' +chars.join('') + '"'; }
  / "'" chars:SingleStringCharacter* "'" { return '"' +chars.join('') + '"'; }

DoubleStringCharacter
  = !('"' / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

SingleStringCharacter
  = !("'" / "\\") char:. { return char; }
  / "\\" sequence:EscapeSequence { return sequence; }

EscapeSequence
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b";   }
  / "f"  { return "\f";   }
  / "n"  { return "\n";   }
  / "r"  { return "\r";   }
  / "t"  { return "\t";   }
  / "v"  { return "\x0B"; }
