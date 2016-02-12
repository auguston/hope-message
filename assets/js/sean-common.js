// 頁面讀取中
window.onload = function() {
    setTimeout(function() {
        $('.js-loading-mask').addClass('fadeOutUp').css('z-index', '-1');
    }, 1500);
};

// 螢幕滑動時，大標題增加陰影
$(function() {
    $('.left-list').scroll(function() {
        var scroll = $('.left-list').scrollTop();
        var header = $('.left-list .top-header');

        if (scroll >= 1) {
            header.addClass('-shadow');
        } else {
            header.removeClass('-shadow');
        }
    });
});

//- 點擊 .js-upright 出現 .right-write
$(function() {
    icon();
});

$('.js-upright').click(function(e) {
    e.preventDefault();
    $('.right-write').toggleClass('show');
    icon();
});

function icon() {
    if ($('.right-write').hasClass('show')) {
        $('.js-upright > .material-icons').text('clear');
    } else {
        $('.js-upright > .material-icons').text('add');
    }
}

// 清空表單
$('.send-btngroup > .cancel').click(function(e) {
    e.preventDefault();
    $('#nameInput, #nicknameInput, #messageInput').val('');
});

//- 引用firebase的資料庫檔案
var myDataRef = new Firebase('https://vivid-heat-4779.firebaseio.com/');

//送出資料
$('#message').submit(function(e) {
    e.preventDefault();
    var name = $('#nameInput').val();
    var nick = $('#nicknameInput').val();
    var text = $('#messageInput').val();

    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var time = d.getFullYear() + '/' + (('' + month).length < 2 ? '0' : '') + month + '/' + (('' + day).length < 2 ? '0' : '') + day + '  ' + (('' + hours).length < 2 ? '0' : '') + hours + ':' + (('' + minutes).length < 2 ? '0' : '') + minutes;

    // 欄位有空白就跳出提示窗
    if ($('#nameInput, #nicknameInput, #messageInput').val() == "") {
        alert('欄位皆為必填喔！');
        return false;
    }

    // 填寫欄位則寫進資料庫
    else {
        $('.refresh-wrap').addClass('-show');
        setTimeout(function() {
            $('.refresh-wrap').removeClass('-show');
            myDataRef.push({
                name: name,
                nick: nick,
                text: text,
                time: time
            });
            $('#nameInput, #nicknameInput, #messageInput').val('');
        }, 2000);
    }
});

//通知資料新增
myDataRef.on('child_added', function(snapshot) {
    var message = snapshot.val();
    displayChatMessage(message.name, message.nick, message.text, message.time);
});

//貼上資料到目標地
function displayChatMessage(name, nick, text, time) {
    if(text.indexOf('script') >= 0) {
    }
    else {
    var main = $('#messagesDiv')
        .prepend('<div class="msg-card">' +
            '<div class="title">' +
            '<div class="pic"></div>' +
            '<h3 class="name">' + name + '<small>' + nick + '</small></h3>' +
            '</div>' +
            '<div class="content">' +
            '<p>' + text + '</p>' +
            '</div>' +
            '<div class="time">' +
            '<time>' + time + '</time>' +
            '</div>' +
            '</div>');
    }
    $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;

    // 卡片漸出
    var card = $('.msg-card');

    function show(i) {
        setTimeout(function() {
            $('.msg-card:nth-child(' + i + ')').addClass('fadeInUp');
        }, i * 300);
    }

    for (var i = 0; i <= card.length; i++) {
        show(i);
    }
}
