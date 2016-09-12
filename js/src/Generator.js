HTMLmini.Generator = new function() {
    /*
     * Generates HTML nodes.
     * 
     * @param tree  tree of Elements
     * @param array if TRUE returns nodes as array, if FALSE returns first node (defaults to FALSE)
     * @return      nodes or node
     */
    this.html = function( tree, array ) {
        array = array || false;
        var nodes = [];
        for ( var i in tree ) {
            var element = tree[i];
            var child   = this.html( element.child, true );
            if ( typeof element.tag == 'undefined' ) {
                nodes.push( document.createTextNode( element.text ) );
                continue;
            } else {
                var node = document.createElement( element.tag );
            }
            if ( typeof element.id != 'undefined' ) {
                node.setAttribute( 'id', element.id );
            }
            for ( attr in element.attr ) {
                node.setAttribute( attr, element.attr[attr] );
            }
            if ( element.class.length > 0 ) {
                node.setAttribute( 'class', element.class.join(' ') );
            }
            if( element.text != undefined ) {
                node.appendChild( document.createTextNode( element.text ) );
            }
            for ( var j in child ) {
                node.appendChild( child[j] );
            }
            nodes.push( node );
        }
        if ( array ) {
            return nodes;
        }
        return nodes.shift();
    };
    /*
     * Generates HTML source. If tabSize is zero no newlines will be inserted.
     * 
     * @param tree      tree of Elements
     * @param tabSize   number of spaces in a tab (defaults to 0)
     * @param tabNUm    starting number of tabs (defaults to 0)
     */
    this.stringify = function( tree, tabSize, tabNum ) {
        tabSize = tabSize || 0;
        tabNum  = tabNum  || 0;
        var indent  = HTMLmini.pad( tabSize * tabNum );
        var newline = tabSize > 0 ? '\n' : '';
        var html = '';
        for ( var i in tree ) {
            var element = tree[i];
            if ( typeof element.tag == 'undefined' ) {
                html += indent+ HTMLmini.escapeHTML( element.text ) + newline;
                continue;
            } else {
                html += indent + '<' + element.tag; 
            }
            if ( typeof element.id != 'undefined' ) {
                html += ' id="' + element.id + '"';
            }
            for ( attr in element.attr ) {
                html += ' ' + attr + ( element.attr[attr] != '' ? ( '="' + element.attr[attr] + '"' ) : '' );
            }
            if ( element.class.length > 0 ) {
                html += ' class="' + element.class.join( ' ' ) + '"';
            }
            if ( element.tag in HTMLmini.emptyElements ) {
                html += '>' + newline;
                continue;
            } else {
                html += '>';
            }
            if ( typeof element.text != 'undefined' ) {
                html += HTMLmini.escapeHTML( element.text );
            }
            if ( element.child.length > 0 ) {
                html += newline + this.stringify( element.child, tabSize, tabNum + 1 ) + indent;
            } else if ( typeof element.text != 'undefined' && element.text.indexOf('\n') > -1 ) {
                html += newline + indent;
            }
            html += '</' + element.tag + '>' + newline;
        }
        return html
            .replace( /<!-->/g,  '<!-- ' )
            .replace( /<\/!-->/g, ' -->' );
    };
};