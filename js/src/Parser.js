HTMLmini.Parser = new function() {  
    /*
     * Element class used to generate HTML.
     * 
     * @return void
     */
    this.Element = function( line, char ) {
        this.indent = 0;
        this.attr   = {};
        this.class  = [];
        this.child  = [];
        this.line   = line;
        this.char   = char;
    };
    /*
     * Parses an array of tokens into an Element tree.
     * 
     * @param tokens    array of tokens
     * @return          Element tree
     */
    this.parse = function( tokens ) {
        return this.walk( this.processEmptyElements( this.elementalize( tokens ) ) );
    };
    /*
     * Converts an array of tokens into an array of Elements.
     * 
     * @throws ParserException  when given a malformed token
     * @param tokens            array of tokens
     * @return                  array of Elements
     */
    this.elementalize = function( tokens ) {
        this.elements = [];
        this.element  = new this.Element();
        this.inattr   = false;
        this.intext   = false;
        for(var i in tokens) {
            var token = tokens[i];
            console.log( token.name );
            if ( !( token.name in this ) ) {
                HTMLmini.throw( 'Parser', 'malformed token ' + token.name, token.line, token.char );
            }
            this[token.name]( token );  
        }
        return this.elements;
    };
    /*
     * Parses newline token. If class or attributes have been set, but no
     * tag has been defiend it is defaulted to a div. If only text is
     * defined the tag remains undefined. If the element has either a tag
     * and or text it is added to the list of valid elements.
     * 
     * @param token matched Token
     * @return      void
     */
    this.newline = function( token ) {  
        if(                                                             
            typeof this.element.tag == 'undefined' && (              
            Object.keys( this.element.attr ).length > 0 ||  
            this.element.class              .length > 0)       
          ) {
            this.element.tag = 'div';                      
        }
        if ( 
            typeof this.element.tag  != 'undefined' ||               
            typeof this.element.text != 'undefined'                  
        ) {
            this.elements.push( this.element );            
        }
        // reset
        this.element = new this.Element( token.line + 1, token.char );
        this.inattr  = false;
        this.intext  = false;
        delete this.attr;
    };
    /*
     * Parses a newinline token. Calls the newline parser and adjusts
     * the next element's indentation.
     * 
     * @param token matched Token
     * @return      void
     */
    this.newinline = function( token ) {
        this.newline( token );
        if ( this.elements.length > 0 ) {
            this.element.indent = this.elements[this.elements.length - 1].indent;
        }
    };
    /*
     * Parses whitespace. Every space increases indentation.
     * 
     * @param token matched Token
     * @return      void
     */
    this.whitespace = function( token ) {
        this.element.indent++;
    };
    /*
     * Opens an attribute region. 
     * 
     * @throw ParserException   when opening an attribute region within a text region
     * @param token             matched Token
     * @return                  void
     */
    this.attrl = function( token ) {
        if ( this.intext ) {
            HTMLmini.throw( 'Parser', 'cannot open an attribute region in a text region', token.line, token.char );
        }
        this.inattr = true;
    };
    /*
     * Closes an attribute region. If an attribute has been defined
     * but has not been given a value it is defaulted to an empty
     * string.
     * 
     * @throw ParserException   when not in an attribute region
     * @param token             matched Token
     * @return                  void
     */
    this.attrr = function( token ) {
        if ( this.intext ) {
            HTMLmini.throw( 'Parser', 'cannot close an attribute region in a text region', token.line, token.char );
        } else if ( typeof this.attr != 'undefined' ) {
            this.element.attr[this.attr] = '';
            delete this.attr;
        }
        this.inattr = false;
    };
    /*
     * Opens a text region. 
     * 
     * @throw ParserException   when opening a text region within an attribute region
     * @param token             matched Token
     * @return                  void
     */
    this.text = function( token ) {
        if( this.inattr ) {
            HTMLmini.throw( 'Parser', 'cannot define text in attributes', token.line, token.char );
        }
        this.intext = true;
    };
    /*
     * Parses tag. When in attribute region the tag specifies the
     * current attribute name. Multiple tags will produce multiple
     * attributes that default to an empty string. When in a text
     * region tags are parsed as strings.
     * 
     * @throw ParserException   when tag is already defined
     * @param token             match Token
     * @return                  void
     */
    this.tag = function( token ) {
        if ( this.inattr && typeof this.attr == 'undefined' ) { 
            this.attr = token.source;
        } else if ( this.inattr ) {
            this.element.attr[this.attr] = '';
            this.attr = token.source;
        } else if ( this.intext && typeof this.element.text != 'undefined' ) {
            this.element.text += ' ' + token.source;
        } else if ( this.intext ) {
            this.element.text = token.source;
        } else if ( typeof this.element.tag == 'undefined' ) {
            this.element.tag = token.source;
            if ( token.source in HTMLmini.aliases ) {
                var alias = HTMLmini.aliases[token.source];
                this.element.tag   = alias.tag   || token.source;
                this.element.attr  = alias.attr  || {};
                this.element.class = alias.class || [];
                this.element.id    = alias.id;
                this.element.text  = alias.text;
            }
        } else {
            HTMLmini.throw( 'Parser', 'cannot redefine tag: ' + this.element.tag, token.line, token.char );
        }
    };
    /*
     * Parses id. When in a text region ids are parsed as comments.
     * 
     * @throw ParserException   when id is already defiend or in attribute region
     * @param token             match Token
     * @return                  void
     */
    this.id = function( token ) {
        if ( typeof this.element.id != 'undefined' ) {
            HTMLmini.throw( 'Parser', 'cannot redefine id: ' + this.element.id, token.line, token.char );
        } else if( this.inattr ) {
            HTMLmini.throw( 'Parser', 'cannot define id in attribute region: ' + token.source, token.line, token.char );
        } else if( this.intext ) {
            this.comment( token );
        } else {
            this.element.id = token.source.substring( 1 );
        }
    };
    /*
     * Parses class. When in text region classes are parsed as
     * strings.
     * 
     * @throw ParserException   when in attribute region
     * @param token             match Token
     * @return      
     */
    this.class = function( token ) {
        if( this.inattr ) {
            HTMLmini.throw( 'Parser', 'cannot define class in attributes: ' + source, token.line, token.char );
        } else if ( this.intext && typeof this.element.text == 'undefined' ) {
            this.element.text = token.source;
        } else if ( this.intext ) {
            this.element.text += token.source;
        } else {
            this.element.class.push( token.source.substring( 1 ) );
        }
    };
    /*
     * Parses string. In attribute region sets attribute value. In
     * text defines TextNode.
     * 
     * @throw ParserException   when not in an expected region
     * @param token             match Token
     * @return                  void
     */
    this.string = function( token ) {
        if ( this.inattr && typeof this.attr != 'undefined' ) {
            this.element.attr[this.attr] = HTMLmini.escapeString( token.source );
            delete this.attr;
        } else if( this.intext ) {
            this.element.text = HTMLmini.escapeString( token.source );
        } else if ( typeof this.element.tag == 'undefined' && !this.inattr ) {
            this.element.text = HTMLmini.escapeString( token.source );
            this.intext = true;
        } else {
            HTMLmini.throw( 'Parser', 'unexpected string ' + token.source, token.line, token.char );
        }
    };
    /*
     * Parses comment. Comments appear inline with the current
     * or last inserted element.
     * 
     * @param token match Token
     * @return      void
     */
    this.comment = function( token ) {
        if ( HTMLmini.preserveComments ) {
            var comment = new this.Element( token.line + 1, token.char );
            comment.tag    = '!--';
            comment.text   = token.source.substring( 1 );
            if ( this.inttext ) {
                comment.indent = this.element.indent;
            } else if ( this.element.length > 0 ) {
                comment.indent = this.elements[this.elements.length - 1].indent;
            } else {
                comment.indent = 0;
            }
            this.elements.push( comment );
        }
    };
    /*
     * Replaces empty element attributes with text if applicable.
     * 
     * @throw ParserException   when Empty element without attribute has text
     * @param elements          array of ELements
     * @return                  array of Elements
     */
    this.processEmptyElements = function( elements ) {
        for ( var i in elements ) {
            var element = elements[i];
            if ( element.tag in HTMLmini.emptyElements ) {
                if ( 
                    HTMLmini.emptyElements[element.tag] == '' && 
                    typeof element.text != 'undefined' 
                ) {
                    HTMLmini.throw( 'Parser', 'cannot add text to empty element', element.line, element.char );
                } else if ( typeof element.text != 'undefined' ) {
                    element.attr[HTMLmini.emptyElements[element.tag]] = element.text;
                }
            }
        }
        return elements;
    };
    /*
     * Walks an array of Elements and produces a tree of Elements.
     * 
     * @throw ParserException   when there is an invalid tree structure
     * @param elements          array of Elements
     * @return                  tree of Elements
     */
    this.walk = function( elements ) {
        var element = elements.shift();
        if ( typeof element == 'undefined' ) {
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
                if ( element.tag in HTMLmini.emptyElements ) {
                    HTMLmini.throw( 'Parser', 'cannot add children to an empty element', element.line, element.char );
                }
                stack.push({
                    current : current,
                    indent  : indent
                });
                current = current[current.length - 1].child;
                indent  = element.indent;
                current.push( element );
            } else if ( element.indent < indent ) {
                if ( stack.length == 0 ) {
                    HTMLmini.throw( 'Parser', 'invalid tree structure', element.line, element.char );
                }
                var popped = stack.pop();
                current    = popped.current;
                indent     = popped.indent;
                elements.unshift( element );
            }
        }
        return tree;
    };
};