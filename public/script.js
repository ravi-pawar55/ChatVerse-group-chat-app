var socket = io();

  var connectedUserList = document.getElementById("connected-user-list")
  var form = document.getElementById('input-form');
  var mainChatBox = document.getElementById('main-chat-box')
  var chatBox = document.getElementById('chat-box');
  var input = document.getElementById("msg");
  var typing = document.getElementById("user-typing");

  const userName = prompt("Enter your name to join the chat:");

  if(userName === null || userName === "" || userName.trim().length === 0) {
    alert("You must enter your name!");
    window.location.reload();
  } else {
    socket.emit("new-user-joining", userName);
  };
    
  socket.on("user-already-exists", (userName) => {
      alert("User with name " + userName + " already exists! Please choose another name.");
      window.location.reload();
  });

  function typingHandler() {
    console.log('typing');
    socket.emit('typing',userName);
  };

  socket.on("user-joined", (users) => {
    connectedUserList.innerHTML='';
    var option = document.createElement('option');
    option.text='Everyone';
    connectedUserList.add(option);
    users.forEach((user)=>{
      if(user!==userName){
      var option = document.createElement('option');
      option.text=user;
      connectedUserList.add(option);
      }
    });

    typing.innerHTML=`<div class="flex font-bold justify-center items-center mt-2 ">
                            <span class="text-xs text-white-500 leading-none">🟢 ${connectedUserList.length} user online </span>
                        </div>`;

  });

  socket.on("user-disconneted",(userName ) => {
    //console.log('Called');
    for(let i = 0 ; i < connectedUserList.length ; i++){
      if(connectedUserList.option[i]===userName){
             connectedUserList.remove(i);
      }
    }

    typing.innerHTML=`<div class="flex font-bold justify-center items-center mt-2 ">
                            <span class="text-xs text-white-500 leading-none">🟢 ${connectedUserList.length} user online </span>
                        </div>`;
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if(input.value){
       if(connectedUserList.value==='Everyone'){
          socket.emit('chat-msg',{msg:input.value,users:connectedUserList.value,user:userName});
       }else{
          socket.emit('private-msg',{msg:input.value,users:connectedUserList.value,user:userName});
       }
    }
    input.value = '';
     
  });

  socket.on('chat-msg', function(obj) {
    if(obj.user===userName){
      chatBox.innerHTML+=`<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                             <div>
                                 <span class="text-xs text-gray-500 leading-none">You</span>
                                 <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg break-words">
                                       <p class="text-sm">${obj.msg}</p>
                                 </div>
                             </div>
                          </div>`;

     }
     else{
      chatBox.innerHTML+=`<div class="flex w-full mt-2 space-x-3 max-w-xs">
                           <div>
                             <span class="text-xs text-gray-500 leading-none">${obj.user}</span>
                               <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg break-words">
                                 <p class="text-sm">${obj.msg}</p>
                               </div>    
                            </div>
                          </div>`;
     }
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  socket.on('private-msg',(obj)=>{
    
   if(obj.user===userName){
    chatBox.innerHTML+=`<div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                          <div>
                              <span class="text-xs text-gray-500 leading-none">You</span>
                              <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg break-words">
                                <p class="text-sm">${obj.msg}</p>
                              </div>
                              <span class="text-xs text-red-500 leading-none">Private to :${connectedUserList.value}</span>   
                          </div>
                        </div>`;
   }
   else{
    chatBox.innerHTML+=`<div class="flex w-full mt-2 space-x-3 max-w-xs">
                          <div>
                             <span class="text-xs text-gray-500 leading-none">${obj.user}</span>
                             <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg break-words">
                                <p class="text-sm">${obj.msg}</p>
                             </div>
                             <span class="text-xs text-red-500 leading-none">Private</span>    
                         </div>
                        </div>`;
   }
    chatBox.scrollTop = chatBox.scrollHeight;
  });

socket.on('joined',(username)=>{
  if(username!==userName){
  chatBox.innerHTML+=`<div class="flex font-bold justify-center items-center mt-2 ">
                          <span class="text-xs text-green-500 leading-none">${username} joined the chat</span>
                      </div>`;
  }else{
    chatBox.innerHTML+=`<div class="flex justify-center font-bold items-center mt-2 ">
                          <span class="text-xs text-green-500 leading-none">You joined the chat</span>
                      </div>`;
  }
});

socket.on('left',(username)=>{
    if(username!==userName){
    chatBox.innerHTML+=`<div class="flex font-bold justify-center items-center mt-2 ">
                            <span class="text-xs text-red-500 leading-none">${username} left the chat</span>
                        </div>`;
    }
});

socket.on('user-typing',(username)=>{
  //console.log('emiting');
  if(username!==userName){
    typing.innerHTML=`<div class="flex font-bold justify-center items-center mt-2 ">
                            <span class="text-xs text-white-500 leading-none">${username} is typing...</span>
                      </div>`;
    }

    setTimeout(()=>{
      typing.innerHTML=`<div class="flex font-bold justify-center items-center mt-2 ">
                            <span class="text-xs text-white-500 leading-none">🟢 ${connectedUserList.length} user online </span>
                        </div>`;
    }
    ,500);
});
