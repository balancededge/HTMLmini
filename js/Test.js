HTMLmini.tests = {};
HTMLmini.log   = [];

HTMLmini.test = function() {
    var errors = [];
    var total  = 0;
    for ( var component in HTMLmini.tests ) {
        for ( var test in HTMLmini.tests[component] ) {
            total++;
            try {
                HTMLmini.saveConsole();
                HTMLmini.tests[component][test]();
                HTMLmini.restorConsole();
                console.log( '%cSUCCESS%c ' + component + '.' + test, 'color:green', 'color:auto' );
            } catch( err ) {
                HTMLmini.restorConsole();
                errors.push({ 
                    exception : err.message || err, 
                    stack     : err.stack,  
                    test      : component + ' ' + test 
                });
                console.log( '%cFAILED%c ' + component + '.' + test, 'color:red;', 'color:auto'  );
            }
        }
    }
    var passed  = total - errors.length;
    var percent = ( (passed / total) * 100 + '' ).substring( 0, 5 ) + '%';
    console.log( 'Passed ' + passed + '/' + total + '(' + percent + ')' );
    for( var i in errors ) {
        var error = errors[i];
        console.error( '%cFAILURE: ' + error.test, 'color:red' );
        console.log( error.exception );
        if ( typeof error.stack != 'undefined' ) {
            console.log( error.stack );
        }
    }
};

HTMLmini.saveConsole = function() {
    HTMLmini.console = console.log;
    console.log = function( arg ) {
        HTMLmini.log.push( arg );
    };
};

HTMLmini.restorConsole = function() {
    console.log = HTMLmini.console;
};