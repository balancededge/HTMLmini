HTMLmini.tests.Parser = new function() {

    this.testNewlineNoTag = function() {
        HTMLmini.assert(
            HTMLmini.Parser.elementalize(
                [{name: 'class', source: '.c'}, {name: 'newline'}]
            ),
            [{indent: 0, tag: 'div', attr: {}, class: ['c'], child: []}]
        );
    }
    
    this.testNewlineTag = function() {
        HTMLmini.assert(
            HTMLmini.Parser.elementalize(
                [{name: 'tag', source: 'p'}, {name: 'newline'}]
            ),
            [{indent: 0, tag: 'p', attr: {}, class: [], child: []}]
        );
    }
    
    this.testNewlineText = function() {
        HTMLmini.assert(
            HTMLmini.Parser.elementalize(
                [{name: 'string', source:'"test"'}, {name: 'newline'}]
            ),
            [{indent: 0, attr: {}, class: [], child: [], text:'test'}]
        );
    }
    
    this.testNewlineNone = function() {
        HTMLmini.assert(
            HTMLmini.Parser.elementalize(
                [{name: 'whitespace'}, {name: 'newline'}]
            ),
            []
        );
    }
    
    this.testWhitespace = function() {
        HTMLmini.assert(
            HTMLmini.Parser.elementalize(
                [{name: 'whitespace'}, {name: 'class', source: '.c'}, {name: 'newline'}]
            ),
            [{indent: 1, tag: 'div', attr: {}, class: ['c'], child: []}]
        );
    }
    
    this.testAttrl = function() {
        HTMLmini.Parser.elementalize([{name: 'attrl'}]);
        HTMLmini.assert(HTMLmini.Parser.inattr);
    }
    
    this.testAttrlText = function() {
        HTMLmini.assertError('ParserException');
        HTMLmini.Parser.elementalize({name: 'text'}, {name: 'attrl'});
    }
    
    this.testAttr = function() {
        
    }

}

