Установить jquery.
npm i jquery 

Откройте новую вкладку в браузере и введите в адресную строку такой запрос:
https://oauth.vk.com/authorize?client_id=6701683&display=page&redirect_uri=&scope=friends,wall,groups&response_type=token&v=5.52

Нажмите Enter. Откроется окно с запросом прав.
Нажмите «Разрешить». В адресной строке будет URL https://oauth.vk.com/blank.html, а после # Вы увидите дополнительные параметры — access_token, expires_in и user_id. Токен может выглядеть, например, так:
51eff86578a3bbbcb5c7043a122a69fd04dca057ac821dd7afd7c2d8e35b60172d45a26599c08034cc40a

Присвойте полученный в адресной сроке токен
params['access_token'] = '51eff86578a3bbbcb5c7043a122a69fd04dca057ac821dd7afd7c2d8e35b60172d45a26599c08034cc40a';

Откройте в браузере index.html

