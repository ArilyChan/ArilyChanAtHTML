require('./style.css');

const app = require("./app/app");

function addLeftText(text, ul) {
    let li = document.createElement('li');
    ul.appendChild(li);
    li.classList.add('textLeft');
    let textDiv = document.createElement('div');
    textDiv.innerHTML = text.toString().replace(/[\r\n]/g, "</br>").replace(/\n/g, "</br>");
    li.appendChild(textDiv);
}

function addRightText(text, ul) {
    let li = document.createElement('li');
    ul.appendChild(li);
    li.classList.add('textRight');
    let textDiv = document.createElement('div');
    textDiv.innerHTML = text;
    li.appendChild(textDiv);
}

function addLeftBase64Pic(base64Code, ul) {
    addLeftText(`<img src="data:image/png;base64,${base64Code}">`, ul);
}

function initHTML(app) {
    let chatDiv = document.createElement('div');
    chatDiv.classList.add('chatdiv');
    let ul = document.createElement('ul');
    chatDiv.appendChild(ul);

    document.body.appendChild(chatDiv);

    let sendDiv = document.createElement('div');
    sendDiv.classList.add('sendDiv');
    let textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "textInput";
    textInput.value = "*help";
    textInput.onkeypress = async function () {
        if (event.keyCode == 13) {
            let textarea = document.getElementById("textInput");
            let text = textarea.value;
            textarea.value = "";
            if (text) {
                addRightText(text, ul);
                const reply = await app.send(text);
                addLeftText(reply, ul);
                chatDiv.scrollTop = chatDiv.scrollHeight;
            }
        }
    }
    sendDiv.appendChild(textInput);
    let sendButton = document.createElement("button");
    sendButton.innerText = "发送";
    sendButton.onclick = async function () {
        let textarea = document.getElementById("textInput");
        let text = textarea.value;
        textarea.value = "";
        if (text) {
            addRightText(text, ul);
            const reply = await app.send(text);
            addLeftText(reply, ul);
            chatDiv.scrollTop = chatDiv.scrollHeight;
        }
    }

    sendDiv.appendChild(sendButton);

    document.body.appendChild(sendDiv);
}

initHTML(app);