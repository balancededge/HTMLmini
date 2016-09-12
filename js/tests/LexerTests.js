HTMLmini.tests.Lexer = new function() {
    
    var assertException = HTMLmini.assertException;
    var assert          = HTMLmini.assert;
    
    this.testToken = function() {
        
    };
    
    this.testLex = function() {
        assert(HTMLmini.Lexer.lex(
            '# a comment\n []|tag#id.class\'string\'"\\""'), [
            {name: 'comment',    source: '# a comment', line: 0, char: 0},
            {name: 'newline',    source: '',            line: 1, char: 12},
            {name: 'whitespace', source:'',             line: 2, char: 13},
            {name: 'attrl',      source: '[',           line: 2, char: 14},
            {name: 'attrr',      source: ']',           line: 2, char: 15},
            {name: 'text',       source: '|',           line: 2, char: 16},
            {name: 'tag',        source: 'tag',         line: 2, char: 17},
            {name: 'id',         source: '#id',         line: 2, char: 20},
            {name: 'class',      source: '.class',      line: 2, char: 23},
            {name: 'string',     source: '\'string\'',  line: 2, char: 29},
            {name: 'string',     source: '\"\\\"\"',    line: 2, char: 37},
            {name: 'newline',    source: '',            line: 2, char: 41}
        ]);
        assertException( 'LexerException', function() {
            HTMLmini.Lexer.lex( '.tag"string"? ' );
        });
    };  
    
    this.testPreprocess = function() {
        
    };
    
    this.testTokenize = function() {
        
    };
};