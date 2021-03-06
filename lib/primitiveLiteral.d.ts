import * as Lexer from './lexer';
export declare function nullValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function booleanValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function guidValue(value: any, index: any): Lexer.Token;
export declare function sbyteValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function byteValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function int16Value(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function int32Value(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function int64Value(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function decimalValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function doubleValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function singleValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function stringValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function durationValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function binaryValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function dateValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function dateTimeOffsetValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function timeOfDayValue(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function positionLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function pointData(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function lineStringData(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function ringLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function polygonData(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function sridLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function pointLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function polygonLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function collectionLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function lineStringLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function multiLineStringLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function multiPointLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function multiPolygonLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function multiGeoLiteralFactory(value: number[] | Uint8Array, index: number, prefix: string, itemLiteral: Function): Lexer.Token;
export declare function multiGeoLiteralOptionalFactory(value: number[] | Uint8Array, index: number, prefix: string, itemLiteral: Function): Lexer.Token;
export declare function geoLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function fullPointLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function fullCollectionLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function fullLineStringLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function fullMultiLineStringLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function fullMultiPointLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function fullMultiPolygonLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function fullPolygonLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function fullGeoLiteralFactory(value: number[] | Uint8Array, index: number, literal: Function): Lexer.Token;
export declare function geographyCollection(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geographyLineString(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geographyMultiLineString(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geographyMultiPoint(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geographyMultiPolygon(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geographyPoint(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geographyPolygon(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geometryCollection(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geometryLineString(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geometryMultiLineString(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geometryMultiPoint(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geometryMultiPolygon(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geometryPoint(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geometryPolygon(value: number[] | Uint8Array, index: number): Lexer.Token;
export declare function geoLiteralFactory(value: number[] | Uint8Array, index: number, type: string, prefix: Function, literal: Function): Lexer.Token;
export declare function primitiveLiteral(value: number[] | Uint8Array, index: number): Lexer.Token;
