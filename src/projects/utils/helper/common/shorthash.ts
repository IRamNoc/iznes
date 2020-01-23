/*
	shorthash
	(c) 2013 Bibig

	https://github.com/bibig/node-shorthash
	shorthash may be freely distributed under the MIT license.
*/


export class ShortHash {

    static bitwise(str) {
        let hash = 0;
        if (str.length === 0) {
            return hash;
        }
        for (let i = 0; i < str.length; i++) {
            const ch = str.charCodeAt(i);
            hash = ((hash<<5)-hash) + ch;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    static binaryTransfer(integer, binary) {
        binary = binary || 62;
        const stack = [];
        let num = 0;
        let result = '';
        const sign = integer < 0 ? '-' : '';

        function table (i: number) {
            return '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[i];
        }

        integer = Math.abs(integer);

        while (integer >= binary) {
            num = integer % binary;
            integer = Math.floor(integer / binary);
            stack.push(table(num));
        }

        if (integer > 0) {
            stack.push(table(integer));
        }

        for (let i = stack.length - 1; i >= 0; i--) {
            result += stack[i];
        }

        return sign + result;
    }

    static unique (text) {
        const id = ShortHash.binaryTransfer(ShortHash.bitwise(text), 61);
        return id.replace('-', 'Z');
    }
}
