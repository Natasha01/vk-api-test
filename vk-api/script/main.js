// window.onLoad = parseGET();
// window.onLoad = test();

// function test() {
//     $.ajax({
//         url: 'https://oauth.vk.com/authorize?client_id=6701683&display=page&redirect_uri=&scope=friends,wall,groups&response_type=token&v=5.52',
//         // method: 'GET',
//         // dataType: 'HTML',
//         success: function(){
//             console.log('ok');
//         }
//     }) 
// }

// function parseGET() {
//     window.location.assign('https://oauth.vk.com/authorize?client_id=6701683&display=page&redirect_uri=&scope=friends,wall,groups&response_type=token&v=5.52');
//     // Обработка GET-запросов
//     var tmp = new Array();    // два вспомогательных
//     var tmp2 = new Array();  // массива
//     get = new Array();
//     var url = location.search;    // строка GET запроса
//     if (url != '') {
//         tmp = (url.substr(1)).split('&');   // разделяем переменные
//         for (var i = 0; i < tmp.length; i++) {
//             tmp2 = tmp[i].split('=');     // массив param будет содержать
//             get[tmp2[0]] = tmp2[1];       // пары ключ(имя переменной)->значение
//         }
//     }
//     console.log(get);
// }



let id_user,
    ids_records = [],
    ids_groups = [];

function getURL(method, params) {
    if (!method) throw Error('Не указан метод!');
    params = params || {};
    params['access_token'] = 'e7b7c7824ea72c49d11a69a113f15e1c12d09ada0c04f894be0db7e76e3422af2e8a0ee70f0aef2b002e9';
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
    sendRequest('users.get', {fields: 'photo_400_orig'}, function (data) {
        console.log(data);
        showProfilePhoto(data.response[0]);
    })
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
    sendRequest('friends.search', {fields: 'photo_100,online' }, function (data) {
        console.log(data);
        drawFriends(data.response.items);
    });
}

function loadGroups() {
    sendRequest('groups.get', { extended: 1, fields: 'name,screen_name,photo_100' }, function (data) {
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
    document.querySelector('.profile').innerHTML += html;
}

function showProfilePhoto(photo) {
    let html = '';
    html += '<img src="' + photo.photo_400_orig + '">';
    document.querySelector('.profile').innerHTML += html;
}

function showWall(wall) {
    if (wall.length > 0) id_user = wall[0].owner_id;
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
    // html += '<button onclick="deleteRecords()">Удалить все записи со стены</button>';
    document.querySelector('ul').innerHTML = html;
    document.querySelector('.button').innerHTML = '<button onclick="deleteRecords()">Удалить все записи со стены</button>';
}

function deleteRecords() {
    for (let i = 0; i < ids_records.length; i++) {
        sendRequest('wall.delete', { owner_id: id_user, post_id: ids_records[i] }, function (data) {
            console.log(data);
        })
    }
    loadProfile();
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

function drawGroups(groups) {
    let html = '';
    for (let i = 0; i < groups.length; i++) {
        let g = groups[i];
        ids_groups.push(g.id);
        html += '<li>'
            + '<img src="' + g.photo_100 + '"/>'
            + '<div class="data">'
            + '<a target="_blank" href="https://vk.com/' + g.screen_name + '">'
            + '<h4>' + g.name + '</h4>'
            + '</a>'
            + '</div>'
            + '</li>';
    }
    // html += '<button onclick="leaveGroups()">Выйти из всех групп</button>';
    document.querySelector('.profile').innerHTML = '';
    document.querySelector('ul').innerHTML = html;
    document.querySelector('.button').innerHTML = '<button onclick="leaveGroups()">Выйти из всех групп</button>';
}

function leaveGroups() {
    for (let i = 0; i < ids_groups.length; i++) {
        sendRequest('groups.leave', {group_id: ids_groups[i] }, function (data) {
            console.log(data);
        })
    }
    loadGroups();
}