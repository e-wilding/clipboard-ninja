let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.body.style.backgroundColor = "' + color + '";console.log("test");'});
  });
};

class Clipboard { 
  constructor() {
    this.clipboard = []
    this.div = document.getElementById('clipboard')
    this.MAX_MESSAGES = 5;
  }

  storeMessage = (msg) => { 
    console.log('inside storeMessage');

    if (this.clipboard.length >= this.MAX_MESSAGES) {
      this.clipboard.shift();
    }
    this.clipboard.push(new Message(msg));
    
    console.log('this.clipboard', this.clipboard);

    this.processMessage();
  }

  displayMessages = () => {
    console.log(this.clipboard)
  }

  processMessage = () => {
    console.log('inside processMessage');
    // Clear our all messages
    if (this.clipboard.length > 1) {
      console.log('triggering deleteMessges');
      this.deleteMessages()
    }
    
    // Render
    this.renderMessages();
  }
  
  renderMessages = () => {
    console.log('inside renderMessages')
    console.log('this.clipboard', this.clipboard)
    for (const message of this.clipboard) {
      console.log('message', message)
      console.log('this.div', this.div);
      console.log('message.div', message.div);
      this.div.appendChild(message.div);
      console.log('this.div', this.div);
    }
  }
  
  deleteMessages = () => {
    console.log('inside deleteMessages');
    const messages = document.querySelectorAll('#message')
    for(const msg of messages) {
      console.log('msg being deleted', msg);
      msg.remove();
    }
    console.log('messages deleted');
  }
}

class Message { 
  constructor(msg) {
    this.message = msg 
    this.div = document.createElement("div")
    this.div.id = 'message'
    this.div.innerHTML = msg;
  }
}

console.log('inside popup.js');

const clipboard = new Clipboard();

let port = chrome.extension.connect({
  name: "Sample Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
  console.log('received: ', msg);
  clipboard.storeMessage(msg);
});

