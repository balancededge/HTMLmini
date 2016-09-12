HTMLmini.Compiler = new function() {
    /*
     * Returns HTML nodes or node.
     * 
     * @param source    source string
     * @param map       template map
     * @param array     if TRUE returns nodes as array, if FALSE returns first node
     * @return          nodes or node
     */
    this.html = function( source, map, array ) {
        return HTMLmini.Generator.html( this.compile( source, map ), array );
    };
    /*
     * Returns HTML source.
     * 
     * @param source    source string
     * @param map       template map
     * @param tabSize   number of spaces in a tab
     * @return          HTML source
     */
    this.stringify = function( source, map, tabSize ) {
        return HTMLmini.Generator.stringify( this.compile( source, map ), tabSize );
    };
    /*
     * Returns parsed Element tree.
     * 
     * @param source    source string
     * @param map       template map
     * @return          tree of Elements
     */
    this.compile = function( source, map ) {
        return HTMLmini.Parser.parse( HTMLmini.Lexer.lex( source, map ) );
    };  
};