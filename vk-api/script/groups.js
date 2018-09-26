function loadGroups() {
    sendRequest('groups.get', { extended: 1, fields: 'name,screen_name,photo_100' }, function (data) {
        console.log(data);
        drawGroups(data.response.items);
    })
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