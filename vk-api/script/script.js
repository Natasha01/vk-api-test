window.onLoad = loadProfile();

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