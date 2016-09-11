function HTMLmini() {
    
    HTMLmini.file = '@';
    
    HTMLmini.html = function(source, array) {
        return HTMLmini.Compiler.html(source, array);
    }
    
    HTMLmini.stringify = function(source) {
        return HTMLmini.Compiler.stringify(source);
    }
    
    HTMLmini.minify = function(source) {
        return HTMLmini.Compiler.minify(source);
    }
    
    HTMLmini.compile = function(source) {
        return HTMLmini.Compiler.compile(source);    
    }
    
    HTMLmini.debug = function(arg) {
        console.log(JSON.stringify(arg, null, 4));
    }
    
    HTMLmini.throw = function(owner, message, line, char) {
        if(line != undefined && char != undefined) {
            throw new HTMLmini.Exception(
                owner + 'Exception',
                message + ' ' + HTMLmini.file + ':' + line + ':' + char
            );
        }
        throw new HTMLmini.Exception(
                owner + 'Exception',
                message + ' ' + HTMLmini.file
            );
    }
    
    HTMLmini.Exception = function(name, message) {
        this.name = name;
        this.message = name + ': ' + message;
    }
    
}