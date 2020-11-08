exports.typeSwitch = {
    'html': 'text/html',
    'css': 'text/css',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'json': 'text/json',
    'ico': 'text/html'
}

exports.parseUrl = (url)  =>{
    if(url == '/arqs/*'){
        return 'tabsite/index.html'
    }
    if(url.match(/\/arqs\/[0-9]+\/?/)){
        return 'tabsite/' + url.split('/')[2] + '.html';
    }
    if (url.match(/\/resources\/[a-zA-Z]+.[a-z]+/)){
        return'tabsite/resources/' + url.split('/')[2];
    }
    if (url.match(/\/css\/[a-zA-Z]*.css/)) {
        return 'tabsite/css/' + url.split('/')[2];
    }
    return 'tabsite/invalidUrl.html';
}