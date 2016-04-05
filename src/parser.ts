import * as Utils from './utils';
import * as Lexer from './lexer';
import * as PrimitiveLiteral from './primitiveLiteral';
import * as Expressions from './expressions';
import * as Query from './query';
import * as ResourcePath from './resourcePath';
import * as ODataUri from './odataUri';

var parserFactory = function(fn){
	return function (source, options) {
		var raw = new Uint8Array(source.length);
		var pos = 0;
		var tokens = [];
		for (var i = 0; i < source.length; i++) {
			raw[i] = source.charCodeAt(i);
		}
		while (pos < raw.length) {
			var token = fn(raw, pos);
			if (token) {
				pos = token.next;
				tokens.push(token);
			} else {
				//throw new Error('Fail at ' + pos);
				pos++;
			}
		}
		return tokens.length > 1 ? tokens : tokens[0];
	};
};

export class Parser{
	odataUri(source:string, options?:any):Lexer.Token { return parserFactory(ODataUri.odataUri)(source, options); }
	resourcePath(source:string, options?:any):Lexer.Token { return parserFactory(ResourcePath.resourcePath)(source, options); }
	query(source:string, options?:any):Lexer.Token { return parserFactory(Query.queryOptions)(source, options); }
	filter(source:string, options?:any):Lexer.Token { return parserFactory(Expressions.boolCommonExpr)(source, options); }
	keys(source:string, options?:any):Lexer.Token { return parserFactory(Expressions.keyPredicate)(source, options); }
	literal(source:string, options?:any):Lexer.Token { return parserFactory(PrimitiveLiteral.primitiveLiteral)(source, options); }
}
