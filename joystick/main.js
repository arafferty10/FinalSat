$(function() {
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

  // Initialize variables
  var $window = $(window);
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();

  var socket = io();

  function addParticipantsMessage (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }

  // Sets the client's username
  function setUsername () {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      // $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
      // window.location.replace("http://" + window.location.hostname + ":4000");
      
      
    }
  }

  // Sends a chat message
  function sendMessage () {
    $inputMessage.val('Hello World');
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (connected) {
      // $inputMessage.val('Hello World');
      addChatMessage({
        username: username,
        message: message
      });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  }

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
  }

  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing';
    addChatMessage(data);
  }

  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).html();
  }

  // Updates the typing event
  function updateTyping () {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username through our hash function
  function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  // Keyboard events
  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  // $inputMessage.on('input', function() {
  //   updateTyping();
  // });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    sendMessage();
  });

  // Socket events
  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    // Display the welcome message
    var message = "Welcome to Socket.IO Chat – ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.username + ' left');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

  socket.on('disconnect', function () {
    log('you have been disconnected');
  });

  socket.on('reconnect', function () {
    log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', function () {
    log('attempt to reconnect has failed');
  });

  ///////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////

  var s = function (sel) { return document.querySelector(sel); };
  var sId = function (sel) { return document.getElementById(sel); };
  var removeClass = function (el, clss) {
      el.className = el.className.replace(new RegExp('\\b' + clss + ' ?\\b', 'g'), '');
  }
  var joysticks = {
      dynamic: {
          zone: s('.zone.dynamic'),
          color: 'blue',
          multitouch: true
      },
      semi: {
          zone: s('.zone.semi'),
          mode: 'semi',
          catchDistance: 150,
          color: 'white'
      },
      static: {
          zone: s('.zone.static'),
          mode: 'static',
          position: {left: '50%', top: '50%'},
          color: 'red'
      }
  };
  var joystick;

  // Get debug elements and map them
  var elDebug = sId('debug');
  var elDump = elDebug.querySelector('.dump');
  var els = {
      position: {
          x: elDebug.querySelector('.position .x .data'),
          y: elDebug.querySelector('.position .y .data')
      },
      force: elDebug.querySelector('.force .data'),
      pressure: elDebug.querySelector('.pressure .data'),
      distance: elDebug.querySelector('.distance .data'),
      angle: {
          radian: elDebug.querySelector('.angle .radian .data'),
          degree: elDebug.querySelector('.angle .degree .data')
      },
      direction: {
          x: elDebug.querySelector('.direction .x .data'),
          y: elDebug.querySelector('.direction .y .data'),
          angle: elDebug.querySelector('.direction .angle .data')
      }
  };

  sId('buttons').onclick = createNipple;
  createNipple('dynamic');

  function bindNipple () {
      joystick.on('start end', function (evt, data) {
          dump(evt.type);
          debug(data);
          socket.emit('cursor display', {"username": username, "display":evt.type})
      }).on('move', function (evt, data) {
          debug(data);
          socket.emit('move', {"username": username, "force": data.force, "x": data.instance.frontPosition.x,"y": data.instance.frontPosition.y} )
      }).on('dir:up plain:up dir:left plain:left dir:down ' +
          'plain:down dir:right plain:right',
          function (evt, data) {
              dump(evt.type);
              // console.log(data)
          }
      ).on('pressure', function (evt, data) {
          debug({"pressure": data});
      });
  }

  function createNipple (evt) {
      var type = typeof evt === 'string' ?
          evt : evt.target.getAttribute('data-type');
      if (joystick) {
          joystick.destroy();
      }
      removeClass(s('.zone.active'), 'active');
      removeClass(s('.button.active'), 'active');
      removeClass(s('.highlight.active'), 'active');
      s('.highlight.' + type).className += ' active';
      s('.button.' + type).className += ' active';
      s('.zone.' + type).className += ' active';
      joystick = nipplejs.create(joysticks[type]);
      bindNipple();
  }

  // Print data into elements
  function debug (obj) {
      function parseObj(sub, el) {
          for (var i in sub) {
              if (typeof sub[i] === 'object' && el) {
                  parseObj(sub[i], el[i]);
              } else if (el && el[i]) {
                  el[i].innerHTML = sub[i];
              }
          }
      }
      setTimeout(function () {
          parseObj(obj, els);
      }, 0);
  }

  var nbEvents = 0;

  // Dump data
  function dump (evt) {
      setTimeout(function () {
          if (elDump.children.length > 4) {
              elDump.removeChild(elDump.firstChild);
          }
          var newEvent = document.createElement('div');
          newEvent.innerHTML = '#' + nbEvents + ' : <span class="data">' +
              evt + '</span>';
          elDump.appendChild(newEvent);
          nbEvents += 1;
      }, 0);
  }
});
