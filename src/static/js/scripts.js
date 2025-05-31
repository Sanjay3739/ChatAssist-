// Executes when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    var textarea = document.getElementById("answer");

    // Function to manage custom popups with local storage handling
    document.querySelectorAll(".custom-popup-link").forEach(function (link) {
        const openImg = link.querySelector('.open');
        const closeImg = link.querySelector('.close');
        if (openImg) {
            openImg.addEventListener("click", function (e) {
                const storedData = localStorage.getItem('userData');
                if (storedData) {
                    document.body.classList.add('popup-open');
                    var popupMain = document.querySelector('.custom-popup');
                    if (popupMain) {
                        popupMain.classList.add('full-height');
                    }
                    var popupContentInner = document.querySelectorAll('.popup-content-inner');
                    if (popupContentInner.length > 0) {
                        popupContentInner[0].style.display = 'none';
                        if (popupContentInner.length > 1) {
                            popupContentInner[1].style.display = 'block';
                        }
                    }
                } else {
                    var popupMain = document.querySelector('.custom-popup');
                    if (popupMain) {
                        popupMain.classList.remove('full-height');
                    }
                    document.querySelectorAll('.popup-content-inner').forEach(function (inner) {
                        inner.removeAttribute('style');
                    });
                    document.body.classList.toggle("popup-open");
                }
            });
        }
        if (closeImg) {
            closeImg.addEventListener("click", function (e) {
                e.stopPropagation();
                document.body.classList.remove("popup-open");
            });
        }
    });

    // Function to handle form submission in a custom popup, validating fields and storing user data in local storage
    document.querySelectorAll('.popup-content-inner .content-block .slide-btn').forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const location = document.getElementById('location').value.trim();
            if (!name || !email || !location) {
                alert('Please fill in all fields.');
                return;
            }
            // Validate email format using a regular expression
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            const userData = {
                name: name,
                email: email,
                location: location
            };
            const encryptedData = btoa(JSON.stringify(userData)); // Basic encryption using base64
            localStorage.setItem('userData', encryptedData);
            var inner = e.currentTarget.closest('.popup-content-inner');
            inner.style.display = 'none';
            inner.nextElementSibling.style.display = 'block';
            setTimeout(function () {
                inner.nextElementSibling.style.opacity = 1;
            }, 700);
            var customPopup = e.currentTarget.closest('.custom-popup');
            if (customPopup) {
                customPopup.classList.add('full-height');
            }
            var chatMessageBot = document.querySelector('.message.chat-message.bot.opening-statement');
            if (chatMessageBot) {
                chatMessageBot.innerHTML = `Hello <strong>${name}</strong>! Welcome to <strong>Sunlex</strong>.<br> I’m your virtual assistant here to help with your queries and provide information about our services.<br> How can I assist you today?`;
            }
        });
    });

    // Function to adjust textarea height dynamically based on content length
    function adjustTextareaHeight() {
        textarea.style.height = 29 + "px";
        textarea.style.height = textarea.scrollHeight + "px";
        if (textarea.scrollHeight > 80) {
            textarea.style.overflowY = "scroll";
        } else {
            textarea.style.overflowY = "hidden";
        }
    }

    // Event listeners to adjust textarea height dynamically
    textarea.addEventListener("input", adjustTextareaHeight);
    window.addEventListener("resize", adjustTextareaHeight);
    setTimeout(function () {
        adjustTextareaHeight();
    }, 300)

    // Function to handle click events on '.continue-link' elements
    document.querySelectorAll('.continue-link').forEach(function (link) {
        link.addEventListener('click', function () {
            this.classList.remove('orange-bg');
            this.closest('.chat-area').querySelector('.after-continue-chat').style.display = 'block';
        });
    });

    const sendChat = document.getElementById('send-chat');
    const queryInput = document.getElementById('answer');
    const chatEntryList = document.querySelector('.chat-entry-list');

    // Function to create a new chat message div element and append it to the chat entry list
    function createMessageDiv(text, type, classes = '') {
        const chatEntry = document.createElement('div');
        chatEntry.classList.add('chat-entry', type === 'user' ? 'sender-entry' : 'reciever-entry');
        const chatEntryInner = document.createElement('div');
        chatEntryInner.classList.add('chat-entry-inner');
        const chatEntryContent = document.createElement('div');
        chatEntryContent.classList.add('chat-entry-content');
        const messageOuter = document.createElement('div');
        messageOuter.classList.add('message-outer');
        if (type === 'bot') {
            const userIcon = document.createElement('em');
            userIcon.classList.add('user-icon');
            const userImage = document.createElement('img');
            userImage.src = 'static/images/Sunlex-icon.svg';
            userImage.alt = 'User icon';
            userIcon.appendChild(userImage);
            messageOuter.appendChild(userIcon);
        }
        const chatbotMain = document.createElement('div');
        chatbotMain.classList.add('chatbot-main');
        chatbotMain.id = 'chatbot-main';
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'chat-message', type === 'user' ? 'orange' : 'bot');
        if (classes) {
            messageDiv.classList.add(classes);
        }
        if (classes.includes('loading')) {
            const loadingImg = document.createElement('img');
            loadingImg.src = 'static/images/loading_dots.gif';
            loadingImg.alt = 'Loading gif';
            loadingImg.style.width = '25px';
            loadingImg.style.height = '20px';
            messageDiv.appendChild(loadingImg);
        } else {
            const formattedText = convertToClickableLinks(text);
            messageDiv.innerHTML = formattedText;
        }
        chatbotMain.appendChild(messageDiv);
        messageOuter.appendChild(chatbotMain);
        chatEntryContent.appendChild(messageOuter);
        chatEntryInner.appendChild(chatEntryContent);
        chatEntry.appendChild(chatEntryInner);
        chatEntryList.appendChild(chatEntry);
        scrollToBottom(true);
        return messageDiv;
    }

    // Function to convert text into clickable links and format special characters
    function convertToClickableLinks(text) {
        text = text.trim()
        text = text.replace(/\*\*(.*?)\*\*/g, '<b> $1 </b>');
        text = text.replace(/\n+/g, '<br>');
        text = text.replace(/^(<br>)+/, '');
        text = text.replace(/(<br>)+/gi, '<br>');
        text = text.replace(/<\/?h[1-6]>/gi, match => match.startsWith('</') ? '</b>' : '<b>');
        text = text.replace(/<http[^<>]*>/g, function (match) {
            match = match.replace(/<|>/g, '');
            match = match.replace(/="*$/g, '');
            match = match.replace(/\s+/g, '//');
            return match;
        });
        const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        text = text.replace(markdownLinkRegex, function (match, p1, p2) {
            if (p2.startsWith("mailto:")) {
                return '<a href="' + p2 + '" >' + p1 + '</a>';
            } else {
                return '<a href="' + p2 + '" target="_blank">' + p1 + '</a>';
            }
        });
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/g;
        text = text.replace(emailRegex, function (email) {
            if (text.includes('mailto:' + email)) {
                return email;
            }
            return '<a href="mailto:' + email + '">' + email + '</a>';
        });
        return text;
    }

    // Event listener for form submission handling in chat interface
    sendChat.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const answer = queryInput.value.trim();
        if (answer === '') return;
        queryInput.value = '';
        createMessageDiv(answer, 'user', 'orange'); // User's message in orange class
        const userOutputDiv = createMessageDiv('', 'bot', 'loading');
        const basePath = window.location.pathname.startsWith('/sunlexbuddy') ? '/sunlexbuddy/' : '/';
        fetch(basePath, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                userOutputDiv.classList.remove('loading');
                userOutputDiv.innerHTML = convertToClickableLinks(data.answer);
            })
            .catch(error => {
                userOutputDiv.classList.remove('loading');
                userOutputDiv.innerHTML = 'An error occurred. Please try again.';
            })
            .finally(() => {
                scrollToBottom(true);
            });
    });

    // Function to scroll to the bottom of the chat area
    function scrollToBottom(animate = false) {
        const chatArea = document.querySelector('.chat-area');
        if (animate) {
            chatArea.scroll({
                top: chatArea.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }

    // Populate form fields if user data is stored
    const storedData = localStorage.getItem('userData');
    if (storedData) {
        const userData = JSON.parse(atob(storedData));
        document.getElementById('name').value = userData.name;
        document.getElementById('email').value = userData.email;
        document.getElementById('location').value = userData.location;
    }

    // Add event listener to close button to hide the popup message
    const popupMessage = document.getElementById('popup-message');
    const popupClose = document.getElementById('popup-close');
    popupMessage.style.display = 'flex';
    popupClose.addEventListener('click', function () {
        popupMessage.style.display = 'none';
    });

    // Update chatbot message with user's name if available in local storage
    var chatMessageBot = document.querySelector('.message.chat-message.bot.opening-statement');
    if (chatMessageBot) {
        const storedData = localStorage.getItem('userData');
        if (storedData) {
            const userData = JSON.parse(atob(storedData));
            const user_name = userData.name;
            chatMessageBot.innerHTML = `Hello <strong>${user_name}</strong>! Welcome to <strong>Sunlex</strong>.<br> I’m your virtual assistant here to help with your queries and provide information about our services.<br> How can I assist you today?`;
        }
    }
});


jQuery(document).ready(function () {
    jQuery('.dark-toggle').click(function(){
        jQuery('body').addClass('dark-theme');
        jQuery(this).addClass('active');
        jQuery(this).siblings('.light-toggle').removeClass('active');
    })
    jQuery('.light-toggle').click(function(){
        jQuery('body').removeClass('dark-theme');
        jQuery(this).addClass('active');
        jQuery(this).siblings('.dark-toggle').removeClass('active');
    })
});

