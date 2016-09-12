
/*
 * Controls how Exceptions are handled by the compiler. On strict all Exceptions
 * Are thrown. On relaxed only Lexer Exceptions are respected. On silent all 
 * Exceptions are consumed.
 */
HTMLmini.mode = 'strict';
/*
 * Specify the number of spaces tabs in source should be expanded to.
 */
HTMLmini.tabSize = 4;
/**
 * When set to true comments will appear in HTMl in <!-- --> tags.
 */
HTMLmini.preserveComments = false;
/*
 * Based of the list from https://developer.mozilla.org/en-US/docs/Glossary/Empty_element
 * 
 * Keys in this object will be prevented from containing child nodes and will have 
 * their source transformed from <tag></tag> to <tag>. The value will is used to 
 * substitute element text as an attribute value. If this value is an empty string
 * no text will be allowed.
 */
HTMLmini.emptyElements = {
    area     : '',
    base     : 'href',
    br       : '',
    col      : '',
    colgroup : '',
    command  : '',
    embed    : 'src',
    hr       : 'hr',
    img      : 'src',
    input    : 'value',
    keygen   : '',
    link     : 'href',
    meta     : 'content',
    param    : 'value',
    source   : 'src',
    track    : 'src',
    wbr      : ''
};
/*
 * Define aliases which will set any specified element data before parsing is
 * continued.
 */
HTMLmini.aliases = {
    css : {
        tag  : 'link',
        attr : { 
            rel  : 'stylesheet',
            type : 'text/css'}
    }
};
/*
 * Specify what Exceptions are consume. 
 */
HTMLmini.modes = {
    strict  : [],
    relaxed : ['ParserException'],
    silent  : []
}