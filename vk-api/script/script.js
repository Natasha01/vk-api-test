// $('#load').on('click', loadFriends);
// $('#load').on('click', loadFriends);
// document.querySelector('#load').addEventListener('click', loadFriends);
// console.log(document.querySelector('.load'));

function getURL(method, params) {
    if (!method) throw Error('Не указан метод!');
    params = params || {};
    params['access_token'] = '88f251dc132149be737a344da3803ef0c95840d67d0125e379dbed0721eac3d43597f05313121237031ed';
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
        console.log(data.response.items);
        drawGroups(data.response.items);
    })
}

function showProfile(profile) {
    let html = '';
    html += '<h2>' + profile.first_name + ' ' + profile.last_name + '</h2>'
        // + '<img src="' + f.photo_100 + '"/>'
        + '<div class="data">'
        + '<div>День рождения: ' + profile.bdate + '</div>'
        + '<div>Город, страна: ' + profile.city.title + ', ' + profile.country.title + '</div>'
        + '</div>';
        // + '<a target="_blank" href="https://vk.com/id' + f.id + '">'
        // + '</a>'
        // + '<div>' + online + '</div>'
        // + '<div>Написать сообщение</div>'
        
        // + '</li>';
    document.querySelector('ul').innerHTML = '';
    document.querySelector('.profile').innerHTML = html;
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
    // $('li').html = html;
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
    document.querySelector('ul').innerHTML = html;
    document.querySelector('.profile').innerHTML = '';
}