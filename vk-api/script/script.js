let id_user,
    ids_records = [];

function getURL(method, params) {
    if (!method) throw Error('Не указан метод!');
    params = params || {};
    params['access_token'] = 'a4f358febd83648f28a905697cd3d7f369b3f745f04b916bbc7b915e30658f4162d4750073b48cfcd3a5f';
    return 'https://api.vk.com/method/' + method + '?' + $.param(params) + '&v=5.52';
}


function sendRequest(method, params, func) {
    $.ajax({
        url: getURL(method, params),
        method: 'GET',
        dataType: 'JSONP',
        success: func
    })
}

function loadProfile() {
    sendRequest('account.getProfileInfo', {}, function (data) {
        console.log(data);
        showProfile(data.response);
    });
    sendRequest('wall.get', { count: 10 }, function (data) {
        console.log(data);
        showWall(data.response.items);
    })
}

function loadFriends() {
    sendRequest('friends.search', { count: 10, fields: 'photo_100,online' }, function (data) {
        console.log(data);
        drawFriends(data.response.items);
    });
}

function loadGroups() {
    sendRequest('groups.get', { extended: 1, count: 10, fields: 'name,screen_name,photo_100' }, function (data) {
        console.log(data);
        drawGroups(data.response.items);
    })
}

function showProfile(profile) {
    let html = '<h2>' + profile.first_name + ' ' + profile.last_name + '</h2>'
        + '<div class="data">'
        + '<div>День рождения: ' + profile.bdate + '</div>'
        + '<div>Город, страна: ' + profile.city.title + ', ' + profile.country.title + '</div>'
        + '</div>';
    document.querySelector('ul').innerHTML = '';
    document.querySelector('.profile').innerHTML = html;
}

function showWall(wall) {
    id_user = wall[0].owner_id;
    let html = '';
    let options = {
        // era: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        // weekday: 'long',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };
    for (let i = 0; i < wall.length; i++) {
        let w = wall[i];
        ids_records.push(w.id);
        let date = new Date(w.date * 1000);
        html += '<li>'
        + '<a target="_blank" href="https://vk.com/id' + w.owner_id + '?w=wall' + w.owner_id + '_' + w.id + '">'
        + date.toLocaleString("ru", options)
        + '</a>'
        + '</li>';
    }
    html += '<button onclick="deleteRecords()">Удалить все записи со стены</button>';
    document.querySelector('ul').innerHTML = html;
}

function deleteRecords(){
    for (let i = 0; i < ids_records.length; i++) {
        sendRequest('wall.delete', {owner_id: id_user, post_id: ids_records[i]}, function (data) {
            console.log(data);
        })
    }
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
            + '<div>Написать сообщение</div>'
            + '</div>'
            + '</li>';
    }
    document.querySelector('ul').innerHTML = html;
    document.querySelector('.profile').innerHTML = '';
}

function drawGroups(groups) {
    let html = '';
    for (let i = 0; i < groups.length; i++) {
        let g = groups[i];
        html += '<li>'
            + '<img src="' + g.photo_100 + '"/>'
            + '<div class="data">'
            + '<a target="_blank" href="https://vk.com/' + g.screen_name + '">'
            + '<h4>' + g.name + '</h4>'
            + '</a>'
            + '</div>'
            + '</li>';
    }
    document.querySelector('.profile').innerHTML = '';
    document.querySelector('ul').innerHTML = html;
}