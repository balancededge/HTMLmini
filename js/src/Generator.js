HTMLmini.Generator = new function() {

    this.html = function(tree, array) {
        if(array == undefined) {
            array = false;
        }
        var nodes = [];
        
        for(var i in tree) {
            var element = tree[i];
            var child = this.html(element.child, true);
            
            if(element.tag == undefined) {
                nodes.push(document.createTextNode(element.text));
                continue;
            } else {
                var node = document.createElement(element.tag);
            }
            if(element.id != undefined) {
                node.setAttribute('id', element.id);
            }
            for(attr in element.attr) {
                node.setAttribute(attr, element.attr[attr]);
            }
            if(element.class.length > 0) {
                node.setAttribute('class', element.class.join(' '));
            }
            if(element.text != undefined) {
                node.appendChild(document.createTextNode(element.text));
            }
            for(var j in child) {
                node.appendChild(child[j]);
            }
            nodes.push(node);
        }
        if (array) {
            return nodes;
        }
        return nodes.shift();
    }
    
    this.stringify = function(tree) {
        var buffer = '';
        
        for(var i in tree) {
            var element = tree[i];
            var indent = this.indent(element.indent);
            if(element.tag == undefined) {
                buffer += indent + this.escape(element.text) + '\n';
                continue;    
            } else {
                buffer += indent + '<' + element.tag;
            }
            if(element.id != undefined) {
                buffer += ' id="' + element.id + '"';
            }
            for(attr in element.attr) {
                buffer += ' ' + attr + (element.attr[attr].length > 0 ? ('="' + element.attr[attr] + '"') : '');
            }
            if(element.class.length > 0) {
                buffer += ' class="' + element.class.join(' ') + '"';
            }
            buffer += '>';
            if(element.text != undefined) {
                buffer += this.escape(element.text);
            }
            if(element.child.length > 0) {
                buffer += '\n' + this.stringify(element.child) + indent;
            } else if(element.text != undefined && element.text.indexOf('\n') > -1) {
                buffer += '\n' + indent;
            }
            buffer += '</' + element.tag + '>\n';
        }
        return buffer
            .replace('<br></br>', '<br>')
            .replace('<hr></hr>', '<hr>')
            .replace('</link>', '');
    }
    
    this.minify = function(tree) {
        var buffer = '';
        
        for(var i in tree) {
            var element = tree[i];
            if(element.tag == undefined) {
                buffer += this.escape(element.text);
                continue;    
            } else {
                buffer += '<' + element.tag;
            }
            if(element.id != undefined) {
                buffer += ' id="' + element.id + '"';
            }
            for(attr in element.attr) {
                buffer += ' ' + attr + (element.attr[attr].length > 0 ? ('="' + element.attr[attr] + '"') : '');
            }
            if(element.class.length > 0) {
                buffer += ' class="' + element.class.join(' ') + '"';
            }
            buffer += '>';
            if(element.text != undefined) {
                buffer += this.escape(element.text);
            }
            if(element.child.length > 0) {
                buffer += this.minify(element.child);
            } 
            buffer += '</' + element.tag + '>';
        }
        return buffer
            .replace('<br></br>', '<br>')
            .replace('<hr></hr>', '<hr>')
            .replace('</link>', '');
    }
    
    this.indent = function(n) {
        var buffer = ''; 
        while (buffer.length < n) {
            buffer += ' '; 
        }
        return buffer; 
    }
    
    this.escape = function(source) {
        return source.replace(/[^0-9A-Za-z ]/g, function(c) {
            return "&#" + c.charCodeAt(0) + ";";
        });
    }
}