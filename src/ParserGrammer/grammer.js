// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "expression", "symbols": ["number"]},
    {"name": "expression", "symbols": ["expression", {"literal":"+"}, "expression"], "postprocess": 
        function(data, location, reject) {
            return {
                op: "sum",
                op1: data[0],
                op2: data[2]
            }
        }
            },
    {"name": "expression", "symbols": ["expression", {"literal":"-"}, "expression"]},
    {"name": "expression", "symbols": [{"literal":"("}, "expression", {"literal":")"}], "postprocess": 
        function(data, location, reject) {
            return {
                expression: data[1]
            }
        }
            },
    {"name": "number", "symbols": [/[0-9]/], "postprocess": 
        function(data, location, reject) {
                    return data[0];
                }
            },
    {"name": "number", "symbols": ["number", /[0-9]/], "postprocess": 
        function(data, location, reject) {
                    return data[0];
                }
                               }
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
