HTMLmini.Lexer = new function() {
    /*
     * HTMLmini tokens.
     */
    this.tokens = {   
        comment    : /(\n *#.*)|(# .*)/,                    
        newline    : /\n/,
        newinline  : />/,
        whitespace : /\s/,                  
        attrl      : /\[ */,
        attrr      : /\] */,
        text       : /\| */,
        tag        : /\w(\w|-)* */,
        id         : /#\w(\w|-)* */,
        class      : /\.\w(\w|-)* */,
        string     : /("([^"\\]|\\.)*")|('([^'\\]|\\.)*') */
    };    
    /*
     * Token Object that calculates line and character numbers.
     * 
     * @return void
     */
    this.Token = function( source, lexed, name ) {
        if ( typeof name != 'undefined') {
            this.name   = name;
            this.source = HTMLmini.Lexer.tokens[name].exec( lexed )[0].trim();
        }
        this.line   = source.split( '\n' ).length - lexed.split( '\n' ).length;
        this.char   = source.length - lexed.length;
    };
    /*
     * Lexes a string and applies a template map.
     * 
     * @param source            source string
     * @param map               template map
     * @return                  the lexed tokens
     */
    this.lex = function( source, map ) {  
        return this.tokenize( this.preprocess( source, map ) );
    };
    /*
     * Expands tabs, converts all newlines to unix standard, 
     * and replaces key with their template map value.
     * 
     * @param source    source string
     * @return          preprocessed string
     */ 
    this.preprocess = function( source, map ) {
        for ( var key in map ) {
            source = HTMLmini.replaceKey( source, key, map[key] );
        }
        return HTMLmini.expandTabs( ('\n' + source + '\n')
            .replace( /\r\n|\r|\n/g, '\n' ) 
        );
    };   
    /*
     * Converts a string into an array of tokens.
     * 
     * @throws LexerException   when provided with an unknown character sequence
     * @param source            source string
     * @return                  array of tokens
     */
    this.tokenize = function( source ) {
        var lexed = source;
        var tokens = [];
        outer : while ( lexed.length > 0 ) {    
            for ( var name in this.tokens ) {
                if ( HTMLmini.matchStart( this.tokens[name], lexed ) ) {
                    tokens.push( new this.Token( source, lexed, name ) );
                    lexed = lexed.replace( this.tokens[name], '' );
                    continue outer;
                }                        
            }
            var err = new this.Token( source, lexed );
            HTMLmini.throw('Lexer', 'unknown character sequence: ' + HTMLmini.hint( source ), err.line, err.char );
        }
        return tokens;
    };
};