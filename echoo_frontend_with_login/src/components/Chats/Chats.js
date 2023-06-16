import React, { useEffect } from 'react';
import './Chats.css';
import SendIcon from "../../media/send-icon.svg";

const Chats = () => {
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
    const userNames = window.UserName;
    const onclicktoggle = () => {
        // togglehamburger = !togglehamburger;
        const first_toggle = document.getElementById('chat_head');
        const second_toggle = document.getElementById('chat_main');
        first_toggle.classList.toggle("hamur");
        first_toggle.classList.toggle("cross");
        second_toggle.classList.toggle("wed");
        second_toggle.classList.toggle("ham_on");
    }


    const websocket_connection = () => {
        const send_btn = document.getElementById('message_send_btn');
        const roomName = send_btn.className; 

        if (window.chatSocket){
            window.chatSocket.close();
        }

        window.chatSocket = new WebSocket(
            `ws://${window.location.host}/ws/chat/${roomName}/`
        );
        window.chatSocket.onopen = () => {
            console.log('WebSocket connection established.');
        };

        window.chatSocket.onmessage = function (e) {
            const data1 = JSON.parse(e.data);
            const data = data1.message
            console.log(data);
            const chatsDiv = document.getElementById('chats');
            const chatDiv = document.createElement('div');
            chatDiv.classList.add(data.chatBy === window.UserName ? 'Self_chat' : 'otherchat');

            const chatByDiv = document.createElement('div');
            chatByDiv.textContent = data.chatBy;
            chatByDiv.className = "chatBy";

            const chatContentDiv = document.createElement('div');
            chatContentDiv.textContent = data.chat_content;
            chatContentDiv.className = "chatContent";

            const chatDateDiv = document.createElement('div');
            const chatDate = new Date(data.chat_date);
            const formattedDate = chatDate.toLocaleString();
            chatDateDiv.textContent = formattedDate;
            chatDateDiv.className = "chatDate";

            chatDiv.appendChild(chatByDiv);
            chatDiv.appendChild(chatContentDiv);
            chatDiv.appendChild(chatDateDiv);

            chatsDiv.appendChild(chatDiv);
            chatDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
        };

        window.chatSocket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };
        document.querySelector('#message_send_btn').onclick = function (e) {
            e.preventDefault();
            const messageInput = document.getElementById('message_input');
            const message = messageInput.value;
            window.chatSocket.send(JSON.stringify({
                'message': { 'chatBy': window.UserName, 'chat_content': message,"group_name":document.querySelector('#Chat_topic h3').innerText }
            }));

            messageInput.value = '';
        }

        return () => {
            window.chatSocket.close();
        };

    }

    const eachtopic_onclick = (e) => {
        const chatTopic = document.getElementById("Chat_topic");
        chatTopic.innerHTML = `<h3>${e.target.innerText}</h3>`;
        const username = userNames;
        const send_btn = document.getElementById('message_send_btn');
        send_btn.className = e.target.id;
        const chatsDiv = document.getElementById('chats');
        chatsDiv.innerHTML = "";
        fetch('/api/group-chats', {
            method: 'POST',
            body: JSON.stringify({ access_key: e.target.id }),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                data.forEach(chat => {
                    const chatDiv = document.createElement('div');
                    chatDiv.classList.add(chat.chatBy === username ? 'Self_chat' : 'otherchat');

                    const chatByDiv = document.createElement('div');
                    chatByDiv.textContent = chat.chatBy;
                    chatByDiv.className = "chatBy";

                    const chatContentDiv = document.createElement('div');
                    chatContentDiv.textContent = chat.chat_content;
                    chatContentDiv.className = "chatContent";

                    const chatDateDiv = document.createElement('div');
                    const chatDate = new Date(chat.chat_date);
                    const formattedDate = chatDate.toLocaleString();
                    chatDateDiv.textContent = formattedDate;
                    chatDateDiv.className = "chatDate";

                    chatDiv.appendChild(chatByDiv);
                    chatDiv.appendChild(chatContentDiv);
                    chatDiv.appendChild(chatDateDiv);

                    chatsDiv.appendChild(chatDiv);

                });
                websocket_connection();
            })
            .catch(error => {
                console.log('Error:', error);
            });

    }

    useEffect(() => {
        const groupsbar = document.querySelector('#topics div');
        fetch("/api/groups", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({ username: window.UserName }),
        })
            .then(response => response.json())
            .then(data => {
                groupsbar.innerHTML = "";
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    const new_group = document.createElement("div")
                    new_group.innerText = data[i].groupName;
                    new_group.id = data[i].accessKey;
                    new_group.className = "Each_group_chat";
                    new_group.addEventListener("click", eachtopic_onclick);
                    groupsbar.appendChild(new_group);
                    new_group.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
            })

    })

    useEffect(()=>{
        document.querySelector('#message_input').onkeyup = function(e) {
            if (e.keyCode === 13) {  // enter, return
                document.querySelector('#message_send_btn').click();
            }
        };
    })
    

    return (
        <div >
            <div id='chat_head' className="hamur">
                <div className='hamburger' onClick={onclicktoggle}>
                    <div className='lines1'></div>
                    <div className='lines2'></div>
                    <div className='lines3'></div>
                </div>
                <div id='Chat_topic'>
                    <h3>.</h3>
                </div>
            </div>
            <div id='chat_main' className="wed">
                <div id='topics'>
                    <div>

                    </div>
                </div>
                <div id='chatarea'>
                    <div id='chats'>
                        <div id='click_a_grp'>
                            <div>
                                Click a group
                            </div>
                        </div>
                    </div>
                    <div id='write_chat'>
                        <form >
                            <input id='message_input' type='text' />
                            <button id='message_send_btn' type='submit'>
                                <img src={SendIcon} alt='Send' />
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Chats;