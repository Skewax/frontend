
let Range = window.ace.acequire('ace/range').Range;

class CustomHighlightRules extends window.ace.acequire("ace/mode/text_highlight_rules").TextHighlightRules {
	constructor() {
		super();

        //constant and keyword declarations

        this.indentCommands = [
            'then',
            'do'
        ];

        this.lineCommands = [
            'branch',
            'goto',
            'if',
            'exit',
            'on',
            'for',
            'gosub',
            'run',
            'pollrun',
            'stop',
            'eeprom',
            'read',
            'write',
            'store',
            'get',
            'put',
            'configpin',
            'input',
            'output',
            'reverse',
            'low',
            'high',
            'toggle',
            'pulsin',
            'pulsout',
            'button',
            'count',
            'xout',
            'auxio',
            'mainio',
            'ioterm',
            'pollin',
            'pollout',
            'pollmode',
            'lookup',
            'lookdown',
            'random',
            'serin',
            'serout',
            'owin',
            'owout',
            'shiftin',
            'shiftout',
            'i2cin',
            'i2cout',
            'lcdcmd',
            'lcdin',
            'lcdout',
            'compare',
            'pot',
            'pwm',
            'rctime',
            'pause',
            'pollwait',
            'sound',
            'freqout',
            'dtmfout',
            'nap',
            'sleep',
            'end',
            'debug',
            'debugin',
            'word'
        ]

        this.redentCommands = [
            'else',
        ]

        this.postdentCommands = [
            'return',
            'end',
        ]

        this.outdentCommands = [
            'endif',
            'next',
            'loop'
           
        ]

        this.varTypes = [
            'byte',
            'word',
            'nib',
            'bit',
            'data'
        ]

        this.constants = [
            'cr',
        ]
    
        this.varDeclarations = [
            'var',
            'con',
            'data',
        ]

        this.comparators = [
            '=',
            '<',
            '>',
            '<=',
            '>=',
            '<>'
        ]

        this.$rules = {
            "start": [
                {
                    token: "comment",
                    regex: "'.*$",
                    next: "start"
                }, {
                    token: "string",
                    regex: "\"(?=.)",
                    next: "string" 
                }, {
                    token: "storage.type",
                    regex: "^(" + this.varTypes.join("|")+")(\\s|$)",
                    caseInsensitive: true
                }, {
                    token: "markup.italic",
                    regex: "(" + this.comparators.join("|")+")",
                    caseInsensitive: true,
                    next: "start"
                }, {
                    token: "keyword",
                    regex: "(^|\\s)(" + this.indentCommands.join("|")+")(\\s|$|\\:)",
                    caseInsensitive: true,
                    next: "start"
                }, {
                    token: "keyword",
                    regex: "(^|\\s)(" + this.lineCommands.join("|")+")(\\s|$)",
                    caseInsensitive: true,
                    next: "start"
                }, {
                    token: "keyword",
                    regex: "(^|\\s)(" + this.redentCommands.join("|")+")(\\s|$)",
                    caseInsensitive: true,
                    next: "start"
                }, {
                    token: "keyword",
                    regex: "(^|\\s)(" + this.outdentCommands.join("|")+")(\\s|$)",
                    caseInsensitive: true,
                    next: "start" 
                }, {
                    token: "keyword",
                    regex: "(^|\\s)(" + this.postdentCommands.join("|")+")(\\s|$)",
                    caseInsensitive: true,
                    next: "start" 
                }, {
                    token: "support.function",
                    regex: "^.*:$",
                    next: "start",
                }, {
                    token: "constant.numeric",
                    regex: "(^|\\s)(" + this.constants.join("|")+")(\\s|$)",
                    caseInsensitive: true,
                    next: "start"
                }, 
                {
                    token: "keyword",
                    regex: "("+this.varDeclarations.join("|")+")(\\s|$)",
                    caseInsensitive: true,
                    next: "var"
                }, {
                    token: "constant.numeric",
                    regex: "[0-9]",
                    next: "string"
                },
            ],
            "string": [
                {
                    token: "string",
                    regex: "\"|$",
                    next: "start"
                }, {
                    defaultToken: "string"
                }
            ],
            "vstring": [
                {
                    token: "string",
                    regex: "\"",
                    next: "var"
                }, {
                    defaultToken: "string"
                }
            ],
            "var": [
                {
                    token: "storage.type",
                    regex: "(" + this.varTypes.join("|")+")(\\s|$|,)",
                    caseInsensitive: true,
                    next: "var"
                }, {
                    token: "constant.numeric",
                    regex: "[0-9]",
                    next: "var"
                }, {
                    token: "string",
                    regex: "\"",
                    next: "vstring"
                },  {
                    token: "constant.numeric",
                    regex: "(^|\\s)(" + this.constants.join("|")+")(\\s|$|,)",
                    caseInsensitive: true,
                    next: "var"
                }, {
                    token: "comment",
                    regex: "'.*",
                    next: "start"
                }, {
                    token: "text",
                    regex: "$|^",
                    next: "start"
                }, {
                    defaultToken: "text"
                },
            ]
        };
	}
}

export default class PbasicMode extends window.ace.acequire('ace/mode/text').Mode {
	constructor() {
		super();
		this.HighlightRules = CustomHighlightRules;

        let accessibleRules = new CustomHighlightRules();

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
    
            if (state === "start") {
                var match = line.match(/^.*[{([:]\s*$/);
                if (match) {
                    indent += tab;
                }
            }
    
            return indent;
        };
        

        this.checkOutdent = function(state, line, input) {
            var tokens = line.split(" ").filter(function(value, index, arr) {
                var emptys = {
                    "\n":1,
                    "\r":1,
                    '':1
                }
                return !emptys[value] 
            })
            if(tokens.length === 1 && accessibleRules.outdentCommands.concat(accessibleRules.redentCommands, accessibleRules.postdentCommands).includes(tokens[0])) {
                return 1
            }
            return 0
        }

        this.autoOutdent = (state, doc, row) => {
            var tokens = doc.getLine(row).split(" ").filter(function(value, index, arr) {
                var emptys = {
                    "\n":1,
                    "\r":1,
                    '':1
                }
                return !emptys[value]
            })
            tokens[0] = tokens[0].toLowerCase()
            var indent = this.$getIndent(doc.getLine(row));
            var tab = doc.getTabString();
            console.log(tokens)
            //self line indent
            if (indent.slice(-tab.length) === tab && !accessibleRules.postdentCommands.includes(tokens[0])) {
                doc.remove(new Range(row, indent.length-tab.length, row, indent.length));
            }
            //next line indent

            if (!accessibleRules.redentCommands.includes(tokens[0])) {
                row += 1; 
                indent = this.$getIndent(doc.getLine(row));
                tab = doc.getTabString();
                if (indent.slice(-tab.length) === tab)
                doc.remove(new Range(row, indent.length-tab.length, row, indent.length));
            }
           
        };
	}
}
