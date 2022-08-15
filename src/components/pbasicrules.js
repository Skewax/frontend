
let Range = window.ace.acequire('ace/range').Range;

class CustomHighlightRules extends window.ace.acequire("ace/mode/text_highlight_rules").TextHighlightRules {
	constructor() {
		super();
        this.$rules = {
            "start" : [{
                token : "empty_line",
                regex : '^$'
            }, {
                token : "comment",
                regex : "'.*"
            }, {
                token : "string",
                regex : "\".*\""
            }, {
                token : ["string", "incomplete_string"],
                regex : "\".*"
            }, {
                token : ["constant", "double-slash"],
                regex : "a' ^a"
            }, {
                token : "keyword.control",
                caseInsensitive : true,
                regex : 'branch|if|then|goto|gosub|on|run|pollrun|select|case|stop|do|loop|for'
            }, {
               token : ["keyword.control", "keyword"], 
               caseInsensitive : true,
               regex : 'endif|return|exit|next'
               
            }, {
                token : "storage",
                caseInsensitive : true,
                regex : 'eeprom|data|read|write|store|get|put' 
            }, {
                token : ["keyword"],
                caseInsensitive: true,
                regex : 'let'
            }, {
                token : "keyword",
                caseInsensitive: true,
                regex : 'debug'
            }, {
               token : "variable-declaration",
               caseInsensitive: true,
               regex : ' .* = ' 
            }, {
                token : "constant.numeric",
                caseInsensitive: true,
                regex : "cr"
            }, {
                defaultToken : "text"
            }]
        };
	}
}

export default class PbasicMode extends window.ace.acequire('ace/mode/text').Mode {
	constructor() {
		super();
		this.HighlightRules = CustomHighlightRules;

        this.toggleCommentLines = (state, doc, startRow, endRow) => {
            let alterLine = null
            if(doc.getLine(startRow)[0] === "'") {
                alterLine = (line) => {
                 return line.substring(1, line.length)
                }
            }
            else {
                alterLine = (line) => {
                    return (line[0] === "'" ? "" : "'") + line
                }
            }

            for (let i = startRow; i <= endRow; i++) {
                let line = doc.getLine(i);
                doc.replace(new Range(i, 0, i, line.length), alterLine(line));
            }
        }

        this.getNextLineIndent = function(state, line, tab) {
            var indent = this.$getIndent(line);
    
            var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
            var tokens = tokenizedLine.tokens;
    
            if (tokens.length && tokens[tokens.length-1].type === "comment") {
                return indent;
            }
    
            if (state == "start") {
                var match = line.match(/^.*[\{\(\[:]\s*$/);
                if (match) {
                    indent += tab;
                }
            }
    
            return indent;
        };
        
        var outdents = {
            "return": 1,
            "endif": 1,
            "next": 1
        }

        this.checkOutdent = function(state, line, input) {
            var tokens = line.split(" ").filter(function(value, index, arr) {
                var emptys = {
                    "\n":1,
                    "\r":1,
                    '':1
                }
                return !emptys[value] 
            })
            if(tokens.length === 1 && outdents[tokens[0]]) {
                return 1
            }
            return 0
        }

        this.autoOutdent = (state, doc, row) => {
            row += 1;
            var indent = this.$getIndent(doc.getLine(row));
            var tab = doc.getTabString();
            if (indent.slice(-tab.length) === tab)
                doc.remove(new Range(row, indent.length-tab.length, row, indent.length));
        };
	}
}

