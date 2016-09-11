/*
 * HTMLmini Parser 
 * 
 * @auther Eric Buss
 * 
 */ 
HTMLmini.Parser = new function() {
    
    /*
     * @param tokens
     * @return
     */
    this.parse = function( tokens ) {
        return this.walk( this.elementalize( tokens ) );
    }
    
    /*
     * @param tokens 
     * @return 
     */
    this.elementalize = function( tokens ) {
        this.elements = [];
        this.element  = new this.Element();
        this.inattr   = false;
        this.intext   = false;
        this.attr     = undefined;
        for(var i in tokens) {
            var token = tokens[i];
            if ( this[token.name] == undefined ) {
                HTMLmini.throw( 'Parser', 'malformed token ' + token.name, token.line, token.char );
            }
            this[token.name]( token );  
        }
        return this.elements;
    }
    
    /*
     * @return
     */
    this.Element = function() {
        this.indent = 0;
        this.attr   = {};
        this.class  = [];
        this.child  = [];
    }
    
    /*
     * @param token
     * @return
     */
    this.newline = function( token ) {  
        if(                                                             
            this.element.tag == undefined && (              // No tag defined AND
            Object.keys( this.element.attr ).length > 0 ||  // Some attribute defined OR
            this.element.class              .length > 0)    // Some class defined    
          ) {
            this.element.tag = 'div';                       // Default to div
        }
        if ( this.element.tag != undefined ||               // Tag defined OR
            this.element.text != undefined                  // Text defined
        ) {
            this.elements.push( this.element );            
        }
        // reset
        this.element = new this.Element();
        this.inattr  = false;
        this.intext  = false;
        this.attr    = undefined;
    }
    
    /*
     * @param token
     * @return
     */
    this.newinline = function( token ) {
        this.newline();
        if ( this.elements.length > 0 ) {
            this.element.indent = this.elements[this.elements.length - 1].indent;
        }
    }
    
    /*
     * @param token
     * @return
     */
    this.whitespace = function( token ) {
        this.element.indent++;
    }
    
    /*
     * @param token
     * @return
     */
    this.attrl = function( token ) {
        if ( this.intext ) {
            HTMLmini.throw( 'Parser', 'cannot define attributes in text', token.line, token.char );
        }
        this.inattr = true;
    }
    
    /*
     * @param token
     * @return
     */
    this.attrr = function( token ) {
        if ( this.intext ) {
            HTMLmini.throw( 'Parser', 'cannot define attributes in text', token.line, token.char );
        } else if ( this.attr != undefined ) {
            this.element.attr[this.attr] = '';
            this.attr = undefined;
        }
        this.inattr = false;
    }
    
    /*
     * @param token
     * @return
     */
    this.text = function( token ) {
        if( this.inattr ) {
            HTMLmini.throw( 'Parser', 'cannot define text in attributes', token.line, token.char );
        }
        this.intext = true;
    }
    
    /*
     * @param token
     * @return
     */
    this.tag = function( token ) {
        if ( this.inattr && this.attr == undefined ) { 
            this.attr = token.source;
        } else if ( this.inattr ) {
            this.element.attr[this.attr] = '';
            this.attr = token.source;
        } else if ( this.intext && this.element.text != undefined ) {
            this.element.text += ' ' + token.source;
        } else if ( this.intext ) {
            this.element.text = token.source;
        } else if ( this.element.tag == undefined ) {
            this.element.tag = token.source;
        } else {
            HTMLmini.throw( 'Parser', 'cannot redefine tag: ' + this.element.tag, token.line, token.char );
        }
           
    }
    
    /*
     * @param token
     * @return
     */
    this.id = function( token ) {
        if ( this.element.id != undefined ) {
            HTMLmini.throw( 'Parser', 'cannot redefine id: ' + this.element.id, token.line, token.char );
        } else if( this.inattr ) {
            HTMLmini.throw( 'Parser', 'cannot define id in attributes: ' + token.source, token.line, token.char );
        } else if( !this.intext ) {
            this.element.id = token.source.substring( 1 );
        }
    }
    
    /*
     * @param token
     * @return
     */
    this.class = function( token ) {
        if( this.inattr ) {
            HTMLmini.throw( 'Parser', 'cannot define class in attributes: ' + source, token.line, token.char );
        } else if ( this.intext ) {
            this.element.text = token.source;
        } else {
            this.element.class.push( token.source.substring( 1 ) );
        }
    }
    
    /*
     * @param token
     * @return
     */
    this.string = function( token ) {
        if ( this.inattr && this.attr != undefined ) {
            this.element.attr[this.attr] = this.escape( token.source );
            this.attr = undefined;
        } else if( this.intext ) {
            this.element.text = this.escape( token.source );
        } else if ( this.element.tag == undefined && !this.inattr ) {
            this.element.text = this.escape( token.source );
        } else {
            HTMLmini.throw( 'Parser', 'unexpected string ' + token.source, token.line, token.char );
        }
    }
    
    /*
     * @param token
     * @return
     */
    this.comment = function( token ) {
    }
    
    /*
     * @param elements
     * @return
     */
    this.walk = function( elements ) {
        var element = elements.shift();
        if ( element == undefined ) {
            return [];
        }
        var tree    = [element];
        var current = tree;
        var stack   = [];
        var indent  = element.indent;
        while ( elements.length > 0 ) {            
            element = elements.shift();
            if ( element.indent == indent ) {
                current.push( element );
            } else if ( element.indent > indent ) {
                stack.push({
                    current : current,
                    indent  : indent
                });
                current = current[current.length - 1].child;
                indent  = element.indent;
                current.push( element );
            } else if ( element.indent < indent ) {
                if ( stack.length == 0 ) {
                    HTMLmini.throw('Parser', 'invalid tree structure');
                }
                var popped = stack.pop();
                current = popped.current;
                indent = popped.indent;
                elements.unshift( element );
            }
        }
        return tree;
    }
    
    /*
     * @param source
     * @return
     */
    this.escape = function( source ) {
        source = source
            .replace( /"\n/g,  '"'  )
            .replace( /'\n/g,  '\'' )
            .replace( /\n"/g,  '"'  )
            .replace( /\n'/g,  '\'' );
        if ( source.startsWith( '"' ) ) {
            source = source.replace( /\\"/g, '"' );
            if ( source.endsWith( '"' ) ) {
                return source.substring( 1, source.length - 1 ).replace( /\\\\/g, '\\' );    
            }
            return source.substring( 1 ).replace( /\\\\/g, '\\' );
        }
        source = source.replace( /\\\'/g, '\'' );
        if ( source.endsWith( '\'' ) ) {
            return source.substring( 1, source.length - 1 ).replace( /\\\\/g, '\\' );   
        }
        return source.substring( 1 ).replace( /\\\\/g, '\\' );
    }
    
}