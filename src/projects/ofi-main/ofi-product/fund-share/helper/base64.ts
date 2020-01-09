declare function atob(decode: string);
declare function btoa(decode: string);
export class Base64 {
    static encode(string): string {
        if (typeof btoa === 'undefined') {
            return Buffer.from(string).toString('base64');
        }
        return btoa(string);
    }
    static decode(string): string {
        if (typeof atob === 'undefined') {
            return Buffer.from(string, 'base64').toString('binary');
        }
        return atob(string);
    }
}
