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

function showProfile(profile) {
    let html = '<h2 class="name">' + profile.first_name + ' ' + profile.last_name + '</h2>'
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
    document.querySelector('.profile').innerHTML = html;
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
    document.querySelector('ul').innerHTML = html;
    document.querySelector('.button').innerHTML = '<button onclick="deleteRecords()">Удалить все записи</button>';
}

function deleteRecords() {
    for (let i = 0; i < ids_records.length; i++) {
        sendRequest('wall.delete', { owner_id: id_user, post_id: ids_records[i] }, function (data) {
            console.log(data);
        })
    }
    loadProfile();
}