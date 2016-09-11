/*
 * HTMLmini Lexer 
 * 
 * @auther Eric Buss
 * 
 */ 
HTMLmini.Lexer = new function() {
    
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
    }
    
    /*
     * @param source
     * @param map
     * @return
     */
    this.lex = function( source, map ) {  
        return this.tokenize( this.template( this.preprocess( source ), map ));
    }
    
    /*
     * @param source
     * @return
     */ 
    this.preprocess = function( source ) {
        return ('\n' + source + '\n')
            .replace( /\t/g, '    ' )
            .replace( /\r\n|\r|\n/g, '\n' );
    }
    
    /*
     * @param source
     * @param map
     * @return
     */
    this.template = function( source, map ) {
        for ( var key in map ) {
            source  = source.replace( new RegExp( '[^\\](\\\\)*:' + key, 'g' ), function( match ) {
                return match.replace( ':' + key, map[key] );
            });
        }
        return source;
    }
    
    /*
     * @param source
     * @return 
     */
    this.tokenize = function( source ) {
        var LINES  = source.split( '\n' ).length;   // Total lines in source
        var CHARS  = source.length;                 // Total characters in source
        var tokens = [];
        outer : while ( source.length > 0 ) {
            var line = LINES - source.split('\n').length;   // Current line
            var char = CHARS - source.length;               // Current character        
            for ( var name in this.tokens ) {
                if ( this.match( source, name ) ) {
                    tokens.push({
                        name   : name,
                        source : this.tokens[name].exec( source )[0].trim(),
                        line   : line,
                        char   : char
                    });
                    source = source.replace( this.tokens[name], '' );
                    continue outer;
                }                        
            }
            HTMLmini.throw('Lexer', 'unknown character sequence: ' + this.hint( source ), line, char );
        }
        return tokens;
    }
    
    /*
     * @param source
     * @param name
     * @return
     */
    this.match = function( source, name ) {
        var prefix = /^/.source;
        var suffix = /(.|\s)*/.source;
        return new RegExp( prefix + '(' + this.tokens[name].source + ')' + suffix ).test( source );
    }
    
    /*
     * Grabs a trimmed copy of the first few characters of
     * the source to use in error messages.
     * 
     * @source  the source string
     * @return  the hint 
     */
    this.hint = function( source ) {
        return source.substring( 0, 10 ).trim() + '...';
    }
    
}