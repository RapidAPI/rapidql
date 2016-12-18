# To compile
# npm install -g nearley
# nearleyc -o grammer.js  grammer.ne

expression ->
    number
    | expression "+" expression {%
        function(data, location, reject) {
            return {
                op: "sum",
                op1: data[0],
                op2: data[2]
            }
        }
    %}
    | expression "-" expression
    | "(" expression ")" {%
        function(data, location, reject) {
            return {
                expression: data[1]
            }
        }
    %}

number ->
    [0-9] {%
        function(data, location, reject) {
                    return data[0];
                }
    %}
    | number [0-9] {%
                           function(data, location, reject) {
                                       return data[0];
                                   }
                       %}