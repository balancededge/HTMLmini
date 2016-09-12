HTMLmini.tests.Util = new function() {
    
    var assertException = HTMLmini.assertException;
    var assert          = HTMLmini.assert;
    
    this.testPrint = function() {
        HTMLmini.print( 4 );
        HTMLmini.print( { key : 'val' } );
        assert( HTMLmini.log.pop(), '{\n    "key": "val"\n}' );
        assert( HTMLmini.log.pop(), 4 );
    };
    
    this.testPrintObject = function() {
        HTMLmini.print( { key : 'val' } );
        assert( HTMLmini.log.pop(), '{\n    "key": "val"\n}' );
    };
    
    this.testException = function() {
        var exception = new HTMLmini.Exception( 'Test', 'message' );
        delete exception.stack;
        assert( exception, { 
            name    : 'TestException', 
            message : 'TestException: message'
        });
    };
    
    this.testThrow = function() {
        var mode = HTMLmini.mode;
        HTMLmini.mode = 'strict';
        assertException( 'TestException', function() {
            HTMLmini.throw( 'Test' );
        });
        HTMLmini.mode = 'silent';
        HTMLmini.throw( 'Test' );
        HTMLmini.mode = mode;
    };
    
    this.testAssert = function() {
        try {
            assert( 'test' );
        } catch(err) {
            return;
        }
        throw new HTMlmini.Exception( '', 'assert did not throw' );
    };
    
    this.testAssertException = function() {
        try {
            assertException( 'test', function() {} );
        } catch(err) {
            return;
        }
        throw new HTMlmini.Exception( '', 'assertException did not throw' );
    };
    
    this.testEqualPrimitive = function() {
        if ( !HTMLmini.equal( 4, 4 ) ) {
            throw new HTMLmini.Exception( '', 'equal not equal' );
        }
    };
    
    this.testEqualObject = function() {
        if ( !HTMLmini.equal( { key : 'val' }, { key : 'val' } ) ) {
            throw new HTMLmini.Exception( '', 'equal not equal' );
        }
    };
    
    this.testPad = function() {
        assert( HTMLmini.pad( 7 ), '       ' );
    };
    
    this.testEscapeHTML = function() {
        assert( 
            HTMLmini.escapeHTML( '<div></div>' ), '&#60;div&#62;&#60;&#47;div&#62;' 
        );
    };
    
    this.testEscapeString = function() {
        assert( HTMLmini.escapeString( "'test\\''" ), 'test\'' );
        assert( HTMLmini.escapeString( '"te\\\\st\\\\"' ), 'te\\st\\' );
    };
    
    this.testExpandTabs = function() {
        assert( HTMLmini.expandTabs( ' \t\n  \t\t' ), '    \n        ' );
    };
    
    this.testReplaceKey = function() {
        assert( HTMLmini.replaceKey( ':key \\:key', 'key', 'val' ), 'val \\:key');
    };
    
    this.testMatchStart = function() {
        HTMLmini.assert( HTMLmini.matchStart( /a+/, 'aaab' ) );
        HTMLmini.assert( !HTMLmini.matchStart( /a+/, 'baaaa' ) );
    };
    
    this.testHint = function() {
        assert( HTMLmini.hint( '012345678910' ), '0123456789...' );
        assert( HTMLmini.hint( 'short' ), 'short' );
    };
};