/*
 * Pretty prints Objects.
 * 
 * @param arg   variable to print
 * @return      void
 */
HTMLmini.print = function( arg ) {
    if ( typeof arg == 'object' ) {
        console.log( JSON.stringify( arg, null, 4 ) );
    } else {
        console.log( arg );
    }
};
/*
 * Exception Object with formatted message.
 * 
 * @param name      Exception name
 * @param message   Exception message
 * @param line      line of source
 * @param char      char of source
 * @return          void
 */ 
HTMLmini.Exception = function( name, message, line, char, stack ) {
    if ( typeof line != 'undefined' && typeof char != 'undefined ') {
        this.message = name + 'Exception: ' + message + '    ' + line + ':' + char;
    } else {
        this.message = name + 'Exception: ' + message;
    }
    this.stack   = stack || new Error().stack;
    this.name    = name  || '';
    this.name   += 'Exception';
};
/*
 * Filters Exception based off mode.
 * 
 * @throws Exception    when mode does not consume Exception
 * @param name          Exception name
 * @param message       Exception message
 * @param line          line of source
 * @param char          char of source
 * @return void
 */ 
HTMLmini.throw = function( name, message, line, char ) {
    if ( 
        !( name in HTMLmini.modes[HTMLmini.mode] ) && 
        HTMLmini.mode != 'silent' 
    ) {
        throw new HTMLmini.Exception( name, message, line, char );
    }
};
/*
 * Assert that a is TRUE or a equals b. Performs a deep comparison.
 * 
 * @throws AssertException  when a does not equal b
 * @param a                 first variable
 * @param b                 second variable (default true)
 * @return                  void
 */
HTMLmini.assert = function( a, b ) {
    if ( arguments.length < 2 ) {   // Allow undefined to be passed in as b
        b = b || true;
    }
    var details = {};
    if ( !HTMLmini.equal( a, b, details ) ) {
        throw new HTMLmini.Exception( 'Assert', details.a + ' ' + details.err + ' ' + details.b );
    }
};
/*
 * Assers that the callback with throw an Exception with the provided name.
 * 
 * @throw AssertException   when callback does not throw the correct Exception
 * @param name              the name of the Exception
 * @param callback          the function to run
 * @return                  void
 */
HTMLmini.assertException = function( name, callback ) {
    try {
        callback();
    } catch( err ) {
        HTMLmini.assert( name, err.name );
        return;
    }
    throw new HTMLmini.Exception( 'Assert', 'No exception thrown' );
};
/*
 * Deep equals for Objects or primitives.
 * 
 * @param a         first variable
 * @param b         second variable
 * @param details   object to write error data to
 * @return          TRUE if equal FALSE if not equal
 */ 
HTMLmini.equal = function( a, b, details ) {
    deails = details || {};
    
    if ( typeof a != 'object' && typeof b != 'object' && a != b ) {
        details.a   = a;
        details.b   = b;
        details.err = 'does not equal';
        return false;
    }
    if ( typeof a == 'object' && typeof b != 'object' ) {
        details.a   = 'Object {}';
        details.b   = b;
        details.err = 'cannot be compared to';
        return false;
    }
    if ( typeof a != 'object' && typeof b == 'object' ) {
        details.a   = a;
        details.b   = 'Object {}';
        details.err = 'cannot be compared to';
        return false;
    }
    if ( typeof a == 'object' && typeof b == 'object' ) {
        var innerDetails = {};
        for ( var i in a ) {
            if ( !HTMLmini.equal( a[i], b[i], innerDetails ) ) {
                details.a   = 'Object {}[' + i + '] : ' + innerDetails.a;
                details.b   = 'Object {}[' + i + '] : ' + innerDetails.b;
                details.err = 'does not equal';
                return false;
            }
        }
        for ( var i in b ) {
            if ( !HTMLmini.equal( a[i], b[i], innerDetails ) ) {
                details.a   = 'Object {}[' + i + '] : ' + innerDetails.a;
                details.b   = 'Object {}[' + i + '] : ' + innerDetails.b;
                details.err = 'does not equal';
                return false;
            }
        }
    }
    return true;
};
/*
 * Returns a set of spaces.
 * 
 * @param n number of spaces
 * @return  string padding
 */
HTMLmini.pad = function( n ) {
    n = n || 0;
    return Array( n + 1 ).join( ' ' );
};
/*
 * Replaces HTML parsable characters with their literal counterparts.
 * 
 * @param source    source string
 * @return          the escaped string
 */ 
HTMLmini.escapeHTML = function( source ) {
    return source.replace( /[^0-9A-Za-z ]/g, function( char ) {
        return '&#' + char.charCodeAt( 0 ) + ';';
    });
};
/*
 * Removes quotes from around string and manages escape characters.
 * 
 * @param source    source string
 * @return          the escaped string
 */
HTMLmini.escapeString = function( source ) {
    source = source
        .replace( /"\n/g,  '"'  )
        .replace( /'\n/g,  '\'' )
        .replace( /\n"/g,  '"'  )
        .replace( /\n'/g,  '\'' );
    if ( source.startsWith( '"' ) ) {
        source = source
            .replace( /\\"/g, '"' )
            .replace( /\\\\/g, '\\' ); 
        if ( source.endsWith( '"' ) ) {
            return source.substring( 1, source.length - 1 );    
        }
        return source.substring( 1 );
    }
    source = source
        .replace( /\\\'/g, '\'' )
        .replace( /\\\\/g, '\\' );
    if ( source.endsWith( '\'' ) ) {
        return source.substring( 1, source.length - 1 )   
    }
    return source.substring( 1 );
};
/*
 * Correctly expands tabs in a string.
 * 
 * @param source    source string
 * @param size      number of spaces in a tab (defaults to HTMLmini.tabSize)
 * @return          the expanded string
 */
HTMLmini.expandTabs = function( source, size ) {
    size = size || HTMLmini.tabSize;
    source = source.replace( /.*/g, function( line ) {
        var adjust = line.startsWith( '\n' ) ? 1 : 0;
        for ( var i = 0; i < line.length; i++ ) {
            if ( line[i] == '\t' ) {
                var indent = HTMLmini.pad( size - ( ( i - adjust ) % size ) );
                line = line.replace( '\t', indent );
            }
        }
        return line;
    });
    return source;
};
/*
 * Replaces :keys in a string.
 * 
 * @param source    source string
 * @param key       key name 
 * @param value     value to insert (defaults to an empty sring)
 * @return          the new string
 */
HTMLmini.replaceKey = function( source, key, value ) {
    value  = value  || '';
    source = source.replace( new RegExp( / *?([^\\]|^)(\\\\)*:/.source + key, 'g' ), function( match ) {
        var indent = HTMLmini.pad( match.search(/\S/) );
        return match.replace( ':' + key, value.replace( /\n/g, '\n' + indent ) );
    });
    return source;
};
/*
 * Matches a regular expression to the start of a string.
 * 
 * @param regex     regex or string to match
 * @param source    source string
 * @return          TRUE if matches the start FALSE if does not match
 */
HTMLmini.matchStart = function( regex, source ) {
    regex = regex.source || regex;
    return new RegExp( '^' + regex + '(.|\s)*' ).test( source );
};
/*
 * Returns a short snippet of a string.
 * 
 * @param source    source string
 * @param size      number of characters to include in a hint (defaults to 10)
 * @return          hint string
 */
HTMLmini.hint = function( source, size ) {
    size = size || 10;
    return source.substring( 0, size ).trim() + ( source.length >= size ? '...' : '' );
};