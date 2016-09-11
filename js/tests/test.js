HTMLmini.assert = function(x, y) {
    if(y == undefined && x != undefined) {
        y = true;
    }
    if(typeof x != 'object' && x != y) {
        throw new HTMLmini.Exception(
            'AssertException',
            x + ' does not equal ' + y
        );
    }else if(typeof x == 'object' && typeof y != 'object') {
        throw new HTMLmini.Exception(
            'AssertException',
            JSON.stringify(x) + ' cannot be compared to ' + y
        );
    }else if(typeof x == 'object' && typeof y == 'object') {
        for(var i in x) {
            try {
                HTMLmini.assert(x[i], y[i]);
            } catch(err) {
                throw new HTMLmini.Exception(
                    'AssertException',
                    JSON.stringify(x) + ' does not equal ' + JSON.stringify(y) + ' when comparing property ' + i
                );
            }

        }
    }
}

HTMLmini.assertError = function(err) {
    HTMLmini.tests.err = err;
}

HTMLmini.tests = {};

HTMLmini.test = function() {
    for(var component in HTMLmini.tests) {
        console.log(component);
        for(var test in HTMLmini.tests[component]) {
            try {
                HTMLmini.tests[component][test]();
                console.log('.');
            } catch(err) {
                if(err.name != undefined && err.name == HTMLmini.tests.err) {
                    HTMLmini.tests.err = undefined;
                } else if(err.name != undefined) {
                    console.log(err.message);
                } else {
                    console.log(err);
                }
            }
        }
    }
}