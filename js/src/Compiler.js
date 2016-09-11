HTMLmini.Compiler = new function() {
    
    this.html = function(input, array) {
        return HTMLmini.Generator.html(this.compile(input), array);
    }
    
    this.stringify = function(input) {
        return HTMLmini.Generator.stringify(this.compile(input));
    }
    
    this.minify = function(input) {
        return HTMLmini.Generator.minify(this.compile(input));
    }
    
    this.compile = function(input) {
        return HTMLmini.Parser.parse(HTMLmini.Lexer.lex(input));
    }
    
}