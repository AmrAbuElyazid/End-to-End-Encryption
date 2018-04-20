import { Injectable } from '@angular/core';

@Injectable()
export class RsaService {

	bigInt;
	cypher: any = {};

 	constructor() {
		this.bigInt = require('big-integer');
		this.cypher.p = this.generatePrime();
		this.cypher.q = this.generatePrime();
		this.cypher.n = this.cypher.p * this.cypher.q;
		this.cypher.m = (this.cypher.p-1) * (this.cypher.q-1);
		this.cypher.e = this.copr(this.cypher.m);
		this.cypher.a = this.modInverse(this.cypher.e, this.cypher.m);
 	}

	isPrime(x) {
	    for(var i = 2; i <= Math.sqrt(x); i++){
	        if(x%i == 0)
	        return false;
	    }
	    return true;
	}

	generatePrime() {
		var u = Math.round(Math.random()*10000);
		while (!this.isPrime(u))
		{
			u = this.generatePrime();
		}
		return u;
	}

	gcd(a, b) {	
	    if (b == 0) 
		    return a;
		else
			return this.gcd(b, a%b);
	}

	copr (x) {
		var z = 2;
		while (z < x) {
			if (this.gcd(x,z) == 1){
				return z;
			} else {
				z++;
			}
		}
	}

	modInverse(e, m)
	{
	   e = e%m;
	    for (var a = 1; a < m; a++) {
	       if ((e*a)%m == 1) return a;
		}
	}

	// powMod(x, a, b) {
	//     return this.bigInt(x).modPow(a, b).value;
	// }

	powMod(x, a, b) {
	    let result = 1;
	    while (a > 0) {
			if ((a % 2) == 1) {
				result = (result * x) % b;
			}
			x = (x * x) % b;
			a = Math.floor(a / 2);
	    }
	    return result;
	}

	encryptChar (x, e, n) {
		var enc = this.powMod(x.charCodeAt(0), e, n);
		return enc;
	}

	decryptChar (enc, a, n) {
		var dec;
		dec = this.powMod(enc, a, n);
		return String.fromCharCode(dec);
	}

	encrypt(string) {
		var encrypted = [];
		for (var i = 0; i < string.length; i++) {
			encrypted.push(this.encryptChar(string[i], this.cypher.e, this.cypher.n));
		}
		return encrypted.join(' ');
	}

	decrypt(string) {
		var decrypted = '';
		var strArr = string.split(' ');
		for (var i = 0; i < strArr.length; i++) {
			decrypted += this.decryptChar(strArr[i], this.cypher.a, this.cypher.n);
		}
		return decrypted;
	}


	// encr() {
	// 	console.log('a')
	// 	var ss = document.getElementById('val').value;
	// 	var encrypted = [];
	// 	for (var i = 0; i < ss.length; i++) {
	// 		encrypted.push(encrypt(ss[i], cypher.e, cypher.n));
	// 	}
	// 	console.log(encrypted.join(' '));
	// 	document.getElementById('enc').innerHTML = encrypted.join(' ');
	// 	var decrypted = '';
	// 	for (var i = 0; i < encrypted.length; i++) {
	// 		decrypted += decrypt(encrypted[i], cypher.a, cypher.n);
	// 	}
	// 	console.log(decrypted);
	// 	document.getElementById('dec').innerHTML = decrypted;
	// }
}
