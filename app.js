$(document).ready(function () {

  var shown = [];

  function insertPrompt(script) {

    if (shown.indexOf(script.index) != -1) {
      return;
    }

    var prompt = $('.prompt');
    prompt.removeData();

    $('.typed-cursor').text('');

    new Typed('.prompt', {
      strings: script.value.strings,
      typeSpeed: 15,
      startDelay: script.value.delay,
      onComplete: function() {
        var history = $('.history').html();
        history = history ? [history] : [];
        setTimeout(function() {
          history.push(script.value.author + ':~ $ ' + prompt.text());
          prompt.html('');
          $('.history').html(history.join('<br>'));
        }, 500);
        $('section.terminal').scrollTop($('section.terminal').height());
      }
    });
  }

  // Function to get Sync token from Twilio Function

  function getSyncToken(callback) {
    $.getJSON('https://iot-rube-4359.twil.io/sync_token')
    .then(function (data) {
      callback(data.token);
    });
  }

  function startSync(token) {
    var syncClient = new Twilio.Sync.Client(token);

    syncClient.on('tokenAboutToExpire', function() {
      var token = getSyncToken(function(token) {
        syncClient.updateToken(token);
      });
    }); 
      
    syncClient.list('iot_terminal').then(function(list) {
      list.on('itemAdded', function(result) {
        console.log(result);
        insertPrompt(result.item.data);
      });
    });
  }

  getSyncToken(function(token) {
    startSync(token);
    insertPrompt({
      index: 1,
      value: {
        delay: 0,
        author: 'root',
        strings: ["Initialize Cupcakery..."]
      }
    })
  });

});