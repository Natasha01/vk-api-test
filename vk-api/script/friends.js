function loadFriends() {
    sendRequest('friends.search', {fields: 'photo_100,online' }, function (data) {
        console.log(data);
        drawFriends(data.response.items);
    });
}

function drawFriends(friends) {
    let html = '';
    for (let i = 0; i < friends.length; i++) {
        let f = friends[i];
        let online = (f.online) ? 'Online' : '';
        html += '<li>'
            + '<img src="' + f.photo_100 + '"/>'
            + '<div class="data">'
            + '<a target="_blank" href="https://vk.com/id' + f.id + '">'
            + '<h4>' + f.first_name + ' ' + f.last_name + '</h4>'
            + '</a>'
            + '<div>' + online + '</div>'
            // + '<div>Написать сообщение</div>'
            + '</div>'
            + '</li>';
    }
    document.querySelector('.button').innerHTML = '';
    document.querySelector('.profile').innerHTML = '';
    document.querySelector('ul').innerHTML = html;
}