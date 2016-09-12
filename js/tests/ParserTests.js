HTMLmini.tests.Parser = new function() {
    
    var assertException = HTMLmini.assertException;
    var assert          = HTMLmini.assert;

    this.testNewline = function() {
        assert(
            HTMLmini.Parser.elementalize(
                [{name: 'class', source: '.c'}, {name: 'newline'}]
            ),
            [{indent: 0, tag: 'div', attr: {}, class: ['c'], child: []}]
        );
        assert(
            HTMLmini.Parser.elementalize(
                [{name: 'tag', source: 'p'}, {name: 'newline'}]
            ),
            [{indent: 0, tag: 'p', attr: {}, class: [], child: []}]
        );
        assert(
            HTMLmini.Parser.elementalize(
                [{name: 'string', source:'"test"'}, {name: 'newline'}]
            ),
            [{indent: 0, attr: {}, class: [], child: [], text:'test'}]
        );
        assert(
            HTMLmini.Parser.elementalize(
                [{name: 'whitespace'}, {name: 'newline'}]
            ),
            []
        );
    };
    
    this.testWhitespace = function() {
        assert(
            HTMLmini.Parser.elementalize(
                [{name: 'whitespace'}, {name: 'class', source: '.c'}, {name: 'newline'}]
            ),
            [{indent: 1, tag: 'div', attr: {}, class: ['c'], child: []}]
        );
    };
    
    this.testAttrl = function() {
        HTMLmini.Parser.elementalize( [{ name : 'attrl' }] );
        assert( HTMLmini.Parser.inattr );
        assertException( 'ParserException', function() {
            HTMLmini.Parser.elementalize( { name : 'text'}, { name : 'attrl' } );
        });
    };
    
    this.testAttr = function() {
        
    };

};

