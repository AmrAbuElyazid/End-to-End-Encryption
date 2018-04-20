import { Component, OnInit, ViewChild } from '@angular/core';
import { RsaService } from '../../rsa.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	messages1: any[] = [];
	messages2: any[] = [];
	msg1: string = '';
	msg2: string = '';
	progress: string = '0%';
	step: string = '';
	client: string = '';
	sending: boolean = false;
	progData: any[] = [];
	progTransition: string = '';

	@ViewChild('chat') chat;

  constructor(public rsa: RsaService) {
  	console.log(this.rsa.encrypt('Amr'));
  	console.log(this.rsa.decrypt(this.rsa.encrypt('Amr')));
  }

  ngOnInit() {
  }

  // addMessage(from, to) {
  // 	var message = this[`msg${from}`];
  // 	if (!message.length || this.sending) return;
  // 	this.sending = true;
  // 	var time = this.getTime();
  // 	this[`messages${from}`].push({text: message, time: time, personal: true});
  // 	this.client = `Client ${from}`;
  // 	this.step = `<p>Encrypting '${message}' from ${from} to ${to}</p>`;
		// this.progress = '20%';
		// var encrypted = this.rsa.encrypt(message);
		// var decrypted = this.rsa.decrypt(encrypted);
		// setTimeout(() => {
		// 	this.progress = '40%';
	 //  	this.step = `<p>Encrypted message <p>${encrypted}</p></p>`;
	 //  	setTimeout(() => {
	 //  		this.progress = '60%';
	 //  		this.step = `<p>Message sent`;
	 //  		setTimeout(() => {
		//   		this.progress = '80%';
		//   		this.step = `<p>Decrypting</p> <p>${encrypted}</p>`;
		// 	  	this.client = `Client ${to}`;
		//   		setTimeout(() => {
		// 				this.progress = '100%';
		// 		  	this.step = `<p>Decrypted message <p>${decrypted}</p></p>`;
		// 		  	this[`messages${to}`].push({text: decrypted, time: time});
		// 		  	setTimeout(() => {
		// 		  		this.sending = false;
		// 		  	}, 2000)
		//   		}, 2000)
	 //  		}, 2000)
	 //  	}, 2000)
		// }, 2000)
  // 	this[`msg${from}`] = '';
  // }

  addMessage(from, to) {
  	var message = this[`msg${from}`];
  	if (!message.length || this.sending) return;
  	this.sending = true;
  	var time = this.getTime();
  	this[`msg${from}`] = '';

		var encrypted = this.rsa.encrypt(message);
		var decrypted = this.rsa.decrypt(encrypted);
  	this.progData.push({client: `Client ${from}`, step: `<p>Encrypting '${message}' from ${from} to ${to}</p>`});
  	this.progData.push({client: `Client ${from}`, step: `<p>Encrypted message <p>${encrypted}</p></p>`});
  	this.progData.push({client: `Client ${from}`, step: `<p>Displaying message to client ${from}</p>`, callBack: () => this[`messages${from}`].push({text: message, time: time, personal: true})});
  	this.progData.push({client: `Client ${from}`, step: `<p>Encrypted message sent from ${from} to ${to}</p>`});
  	this.progData.push({client: `Client ${to}`, step: `<p>Encrypted message recieved</p>`});
  	this.progData.push({client: `Client ${to}`, step: `<p>Decrypting</p> <p>${encrypted}</p>`});
  	this.progData.push({client: `Client ${to}`, step: `<p>Decrypted message <p>${decrypted}</p></p>`});
  	this.progData.push({client: `Client ${to}`, step: `<p>Displaying decrypted message to client ${to}</p>`, callBack: () => this[`messages${to}`].push({text: decrypted, time: time})});
  	this.progData.push({client: `Client ${to}`, step: `<p>Done!</p>`});
  	this.progData.push({callBack: () => {this.sending = false; this.progData = []; return;}});
  	this.execProgress(this.progData);
  }

  execProgress(data) {
  	var l = data.length;
  	var time = [10];
		var j = 0;
		this.progress = '0%';
		setTimeout(() => {
			var totalTime = (l-2)*2;
			this.progTransition = `${totalTime}s linear`;
			this.progress = '100%';
		}, 10)
  	for (var i = 0; i < l; ++i) {
  		time[i+1] = time[i] + 2000;
  		setTimeout(() => {
  			if(data[j].callBack) {
					data[j].callBack();
	  			console.log(this.sending);
  			}
  			console.log(this.sending);
  			this.client = data[j].client;
  			this.step = data[j].step;
  			j++;
  		}, time[i])
  		if(j > i) break;
  	}
  }

  getTime() {
  	var time = new Date();
  	return time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

}
