import * as Utils from './utils';
import * as Lexer from './lexer';
import * as PrimitiveLiteral from './primitiveLiteral';
import * as NameOrIdentifier from './nameOrIdentifier';
import * as Expressions from './expressions';

export function resourcePath(value:number[] | Uint8Array, index:number):Lexer.Token {
	if (value[index] == 0x2f) index++;
	var token = batch(value, index) ||
		entity(value, index) ||
		metadata(value, index);
	if (token) return token;

	token = functionImportCall(value, index) ||
		crossjoin(value, index) ||
		all(value, index) ||
		NameOrIdentifier.entitySetName(value, index) ||
		NameOrIdentifier.singletonEntity(value, index) ||
		actionImportCall(value, index);

	if (token && token.type != Lexer.TokenType.Crossjoin && token.type != Lexer.TokenType.AllResource){
		var nav = singleNavigation(value, token.next) ||
			singlePath(value, token.next) ||
			collectionNavigation(value, token.next) ||
			collectionPath(value, token.next) ||
			complexPath(value, token.next);

		if (nav) return Lexer.tokenize(value, index, nav.next, { resource: token, navigation: nav }, Lexer.TokenType.ResourcePath);
	}

	return token;
}

export function batch(value:number[] | Uint8Array, index:number):Lexer.Token {
	if (Utils.equals(value, index, '$batch')) return Lexer.tokenize(value, index, index + 6, '$batch', Lexer.TokenType.Batch);
}

export function entity(value:number[] | Uint8Array, index:number):Lexer.Token {
	if (Utils.equals(value, index, '$entity')){
		var start = index;
		index += 7;

		var name;
		if (value[index] == 0x2f){
			name = NameOrIdentifier.qualifiedEntityTypeName(value, index + 1);
			if (!name) return;
			index = name.next;
		}

		return Lexer.tokenize(value, start, index, name || '$entity', Lexer.TokenType.Entity);
	}
}

export function metadata(value:number[] | Uint8Array, index:number):Lexer.Token {
	if (Utils.equals(value, index, '$metadata')) return Lexer.tokenize(value, index, index + 9, '$metadata', Lexer.TokenType.Metadata);
}

export function collectionNavigation(value:number[] | Uint8Array, index:number):Lexer.Token {
	var start = index;
	var name;
	if (value[index] == 0x2f){
		index++;
		name = NameOrIdentifier.qualifiedEntityTypeName(value, index);
		if (!name) return;
		index = name.next;
	}

	var path = collectionNavigationPath(value, index);
	if (path) index = path.next;

	if (!name && !path) return;

	return Lexer.tokenize(value, start, index, { name, path }, Lexer.TokenType.CollectionNavigation);
}

export function collectionNavigationPath(value:number[] | Uint8Array, index:number):Lexer.Token {
	var start = index;
	var token = collectionPath(value, index) ||
		Expressions.refExpr(value, index);
	if (token) return token;

	var predicate = Expressions.keyPredicate(value, index);
	if (predicate){
		var tokenValue:any = predicate;
		index = predicate.next;

		var navigation = singleNavigation(value, index);
		if (navigation){
			tokenValue = { predicate, navigation };
			index = navigation.next;
		}

		return Lexer.tokenize(value, start, index, tokenValue, Lexer.TokenType.CollectionNavigationPath);
	}
}

export function singleNavigation(value:number[] | Uint8Array, index:number):Lexer.Token {
	var token = boundOperation(value, index) ||
		Expressions.refExpr(value, index) ||
		Expressions.valueExpr(value, index);
	if (token) return token;

	var start = index;
	var name;
	if (value[index] == 0x2f){
		token = propertyPath(value, index + 1);
		if (!token) return;
		index = token.next;
	}

	if (value[index] == 0x2f){
		name = NameOrIdentifier.qualifiedEntityTypeName(value, index + 1);
		if (!name) return;
		index = name.next;
	}

	if (!name && !token) return;

	return Lexer.tokenize(value, start, index, { name: name, path: token }, Lexer.TokenType.SingleNavigation);
}

export function propertyPath(value:number[] | Uint8Array, index:number):Lexer.Token {
	var token = NameOrIdentifier.entityColNavigationProperty(value, index) ||
		NameOrIdentifier.entityNavigationProperty(value, index) ||
		NameOrIdentifier.complexColProperty(value, index) ||
		NameOrIdentifier.complexProperty(value, index) ||
		NameOrIdentifier.primitiveColProperty(value, index) ||
		NameOrIdentifier.primitiveProperty(value, index) ||
		NameOrIdentifier.streamProperty(value, index);

	if (!token) return;
	var start = index;
	index = token.next;

	var navigation = boundOperation(value, index) ||
		collectionNavigation(value, index) ||
		singleNavigation(value, index) ||
		collectionPath(value, index) ||
		complexPath(value, index) ||
		singlePath(value, index);
	if (navigation) index = navigation.next;

	return Lexer.tokenize(value, start, index, { path: token, navigation }, Lexer.TokenType.PropertyPath);
}

export function collectionPath(value:number[] | Uint8Array, index:number):Lexer.Token {
	return Expressions.countExpr(value, index) ||
		boundOperation(value, index);
}

export function singlePath(value:number[] | Uint8Array, index:number):Lexer.Token {
	return Expressions.valueExpr(value, index) ||
		boundOperation(value, index);
}

export function complexPath(value:number[] | Uint8Array, index:number):Lexer.Token {
	var token = boundOperation(value, index);
	if (token) return token;

	var start = index;
	var name;
	if (value[index] == 0x2f){
		index++;
		name = NameOrIdentifier.qualifiedComplexTypeName(value, index);
		if (!name) return;
		index = name.next;
	}

	if (value[index] == 0x2f){
		token = propertyPath(value, index + 1);
		if (!token) return;
		index = token.next;
	}

	if (!name && !token) return;

	return Lexer.tokenize(value, start, index, { name: name, path: token }, Lexer.TokenType.ComplexPath);
}

export function boundOperation(value:number[] | Uint8Array, index:number):Lexer.Token {
	if (value[index] != 0x2f) return;
	var start = index;
	index++;

	var operation = boundEntityColFuncCall(value, index) ||
		boundEntityFuncCall(value, index) ||
		boundComplexColFuncCall(value, index) ||
		boundComplexFuncCall(value, index) ||
		boundPrimitiveColFuncCall(value, index) ||
		boundPrimitiveFuncCall(value, index) ||
		boundActionCall(value, index);
	if (!operation) return;
	index = operation.next;

	var name;
	if (value[index] == 0x2f){
		name = NameOrIdentifier.qualifiedComplexTypeName(value, index + 1);
		if (!name) return;
		index = name.next;
	}

	var navigation = collectionNavigation(value, index) ||
		singleNavigation(value, index) ||
		complexPath(value, index) ||
		collectionPath(value, index) ||
		singlePath(value, index);
	if (navigation) index = navigation.next;

	return Lexer.tokenize(value, start, index, { operation, name, navigation }, Lexer.TokenType.BoundOperation);
}

export function boundActionCall(value:number[] | Uint8Array, index:number):Lexer.Token {
	var namespaceNext = NameOrIdentifier.namespace(value, index);
	if (namespaceNext == index) return;
	var start = index;
	index = namespaceNext;

	if (value[index] != 0x2e) return;
	index++;

	var action = NameOrIdentifier.action(value, index);
	if (!action) return;

	return Lexer.tokenize(value, start, action.next, action, Lexer.TokenType.BoundActionCall);
}

function boundFunctionCall(value:number[] | Uint8Array, index:number, odataFunction:Function, tokenType:Lexer.TokenType):Lexer.Token {
	var namespaceNext = NameOrIdentifier.namespace(value, index);
	if (namespaceNext == index) return;
	var start = index;
	index = namespaceNext;

	if (value[index] != 0x2e) return;
	index++;

	var call = odataFunction(value, index);
	if (!call) return;
	index = call.next;

	var params = functionParameters(value, index);
	if (!params) return;
	index = params.next;

	return Lexer.tokenize(value, start, index, { call, params }, tokenType);
}

export function boundEntityFuncCall(value:number[] | Uint8Array, index:number):Lexer.Token { return boundFunctionCall(value, index, NameOrIdentifier.entityFunction, Lexer.TokenType.BoundEntityFunctionCall); }
export function boundEntityColFuncCall(value:number[] | Uint8Array, index:number):Lexer.Token { return boundFunctionCall(value, index, NameOrIdentifier.entityColFunction, Lexer.TokenType.BoundEntityCollectionFunctionCall); }
export function boundComplexFuncCall(value:number[] | Uint8Array, index:number):Lexer.Token { return boundFunctionCall(value, index, NameOrIdentifier.complexFunction, Lexer.TokenType.BoundComplexFunctionCall); }
export function boundComplexColFuncCall(value:number[] | Uint8Array, index:number):Lexer.Token { return boundFunctionCall(value, index, NameOrIdentifier.complexColFunction, Lexer.TokenType.BoundComplexCollectionFunctionCall); }
export function boundPrimitiveFuncCall(value:number[] | Uint8Array, index:number):Lexer.Token { return boundFunctionCall(value, index, NameOrIdentifier.primitiveFunction, Lexer.TokenType.BoundPrimitiveFunctionCall); }
export function boundPrimitiveColFuncCall(value:number[] | Uint8Array, index:number):Lexer.Token { return boundFunctionCall(value, index, NameOrIdentifier.primitiveColFunction, Lexer.TokenType.BoundPrimitiveCollectionFunctionCall); }

export function actionImportCall(value:number[] | Uint8Array, index:number):Lexer.Token {
	var action = NameOrIdentifier.actionImport(value, index);
	if (action) return Lexer.tokenize(value, index, action.next, action, Lexer.TokenType.ActionImportCall);
}

export function functionImportCall(value:number[] | Uint8Array, index:number):Lexer.Token {
	var fnImport = NameOrIdentifier.entityFunctionImport(value, index) ||
		NameOrIdentifier.entityColFunctionImport(value, index) ||
		NameOrIdentifier.complexFunctionImport(value, index) ||
		NameOrIdentifier.complexColFunctionImport(value, index) ||
		NameOrIdentifier.primitiveFunctionImport(value, index) ||
		NameOrIdentifier.primitiveColFunctionImport(value, index);

	if (!fnImport) return;
	var start = index;
	index = fnImport.next;

	var params = functionParameters(value, index);
	if (!params) return;
	index = params.next;

	return Lexer.tokenize(value, start, index, { import: fnImport, params: params.value }, Lexer.TokenType.FunctionImportCall);
}

export function functionParameters(value:number[] | Uint8Array, index:number):Lexer.Token {
	var open = Lexer.OPEN(value, index);
	if (!open) return;
	var start = index;
	index = open;

	var params = [];
	var token = functionParameter(value, index);
	while (token){
		params.push(token);
		index = token.next;

		var comma = Lexer.COMMA(value, index);
		if (comma){
			index = comma;
			token = functionParameter(value, index);
			if (!token) return;
		}else break;
	}

	var close = Lexer.CLOSE(value, index);
	if (!close) return;
	index = close;

	return Lexer.tokenize(value, start, index, params, Lexer.TokenType.FunctionParameters);
}

export function functionParameter(value:number[] | Uint8Array, index:number):Lexer.Token {
	var name = Expressions.parameterName(value, index);
	if (!name) return;
	var start = index;
	index = name.next;

	var eq = Lexer.EQ(value, index);
	if (!eq) return;
	index = eq;

	var token = Expressions.parameterAlias(value, index) ||
		PrimitiveLiteral.primitiveLiteral(value, index);

	if (!token) return;
	index = token.next;

	return Lexer.tokenize(value, start, index, { name, value: token }, Lexer.TokenType.FunctionParameter);
}

export function crossjoin(value:number[] | Uint8Array, index:number):Lexer.Token {
	if (!Utils.equals(value, index, '$crossjoin')) return;
	var start = index;
	index += 10;

	var open = Lexer.OPEN(value, index);
	if (!open) return;
	index = open;

	var names = [];
	var token = NameOrIdentifier.entitySetName(value, index);
	if (!token) return;

	while (token){
		names.push(token);
		index = token.next;

		var comma = Lexer.COMMA(value, index);
		if (comma){
			index = comma;
			token = NameOrIdentifier.entitySetName(value, index);
			if (!token) return;
		}else break;
	}

	var close = Lexer.CLOSE(value, index);
	if (!close) return;

	return Lexer.tokenize(value, start, index, { names }, Lexer.TokenType.Crossjoin);
}

export function all(value:number[] | Uint8Array, index:number):Lexer.Token {
	if (Utils.equals(value, index, '$all')) return Lexer.tokenize(value, index, index + 4, '$all', Lexer.TokenType.AllResource);
}
