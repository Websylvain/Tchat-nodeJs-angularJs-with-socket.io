app.factory('settings', function ($q) {
  var current_user = {};
  var list_user = [];
  return {
    setUSER: function(info){
      current_user = info;
    },
    getUSER: function(){
      return current_user;
    }
  }
});
