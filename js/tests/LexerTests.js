HTMLmini.tests.Lexer = new function() {
    
    this.testMatchSuccess = function() {
        HTMLmini.assert(HTMLmini.Lexer.match('  ', 'whitespace'));
    }
    
    this.testMatchFailure = function() {
        HTMLmini.assert(!HTMLmini.Lexer.match('#id ', 'tag'));
    }
    
    this.testLexSuccess = function() {
        HTMLmini.assert(HTMLmini.Lexer.lex(
            '# a comment\n []|tag#id.class\'string\'"\\""'), [
            {name: 'comment',    source: '# a comment', line: 1, char: 0},
            {name: 'newline',    source: '',            line: 2, char: 12},
            {name: 'whitespace', source:'',             line: 3, char: 13},
            {name: 'attrl',      source: '[',           line: 3, char: 14},
            {name: 'attrr',      source: ']',           line: 3, char: 15},
            {name: 'text',       source: '|',           line: 3, char: 16},
            {name: 'tag',        source: 'tag',         line: 3, char: 17},
            {name: 'id',         source: '#id',         line: 3, char: 20},
            {name: 'class',      source: '.class',      line: 3, char: 23},
            {name: 'string',     source: '\'string\'',  line: 3, char: 29},
            {name: 'string',     source: '\"\\\"\"',    line: 3, char: 37},
            {name: 'newline',    source: '',            line: 3, char: 41}
        ]);
    }
    
    this.testLexFailure = function() {
        HTMLmini.assertError('LexerException');
        HTMLmini.Lexer.lex('.tag"string"? ');
    }
    
}