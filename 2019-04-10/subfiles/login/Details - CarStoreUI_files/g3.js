//! Calltracks Web Number Dynamics - 3rd generation - Copyright 2007 onwards, Calltracks, pd
//! This code is generated by the Calltracks system
function providePlugin(pluginName, pluginConstructor) {
  var gac = typeof(ga) == "function" ? ga : window[window['GoogleAnalyticsObject']];
  if (gac) gac('provide', pluginName, pluginConstructor);
}
var CTPlugin = function(tracker, config) {
  this.tracker = tracker;
  session_id = 59210908;
  sid_index = config.slotNum;
  this.tracker.set('dimension'+sid_index, session_id);
  if(config.cid_slotNum) {
    this.tracker.set('dimension'+config.cid_slotNum, tracker.get('clientId'));
  }
};
providePlugin('ctplugin', CTPlugin);

if (typeof(dataLayer) !== "undefined") {
  if (dataLayer) {
    dataLayer.push({ 'event': 'visitIdSet', 'visitId': '59210908' });
  }
}

var _ctq = _ctq || [];
var __ctg3 = (function(ctWindow){
  var unknownIdentifiers = {};

  var ua_client_id = '';
  var log_pingback = function(interval){
    var o=document.getElementById('ct_pingback');if(o){o.parentNode.removeChild(o)}
    var ua_params = '';

    function getClientIdFromCookie() {
      try {
        var cookie = document.cookie.match(new RegExp('_ga=([^;]+)'))[1].split('.');
        return cookie[2] + '.' + cookie[3];
      } catch (e) {
        return '';
      }
    }

    function pingbackAndSchedule(ua_params) {
      if (interval < 1800000) { interval = parseInt(interval * 1.1, 10); }
      var wnd_pv_scr = document.createElement('script');
      src_string = 'https://pendragon.calltracks.com:443/wnd/pingback.js?pid=325820285&int=' + interval + '&fk=' + encodeURIComponent(__ctwnd.rc('__utma')) + '&c=' + encodeURIComponent(__ctwnd.rc('__utmz')) + '&cv=' + encodeURIComponent(__ctwnd.rc('__utmv')) + ua_params  ;
      wnd_pv_scr.setAttribute('src', src_string);
      wnd_pv_scr.setAttribute('type', 'text/javascript');
      wnd_pv_scr.setAttribute('id', 'ct_pingback');
      document.getElementsByTagName('head')[0].appendChild(wnd_pv_scr);
      var to = ctWindow.setTimeout(function() { log_pingback(interval) }, interval);
    }

    var gac = window[window['GoogleAnalyticsObject'] || 'ga'];
    if(typeof(gac) == "function") {
      gac(function(tracker){
        if (!tracker) {
          tracker = gac.getAll()[0];
        }
        if (!tracker) {
          if (window.ga && window.ga.getAll && window.ga.getAll()) {
            tracker = window.ga.getAll()[0];
          }
        }

        if (tracker) {
          ua_client_id = tracker.get('clientId');
        }

        if (!ua_client_id) {
          ua_client_id = getClientIdFromCookie();
        }

        if (ua_client_id) {
          ua_params = ua_params + '&ua_client_id=' + ua_client_id;
        }

        pingbackAndSchedule(ua_params);
      });
    } else {
      pingbackAndSchedule(ua_params);
    }
  };

  return {
    unhide: false,
    run: function(){
      for (var i=0;i<_ctq.length;i++){var o=_ctq[i];if(o[0]==="_unhide"){__ctg3.unhide=o[1]}}
        // Using default numbers
        __ctwnd.sc(__ctwnd.infoCookieName(), 'kwid%3D%3Brefid%3D%3Bvid%3D59210908');
        var to = ctWindow.setTimeout(function() { log_pingback(20000) }, 3000);
      if (__ctwnd.needReInit){__ctwnd.needReInit=false;__ctwnd.reinit();}
      if (Object.keys && Object.keys(unknownIdentifiers).length > 0) {
        if(console) {
          console.log("Errors reported by Calltracks: Unknown identifiers on page (not set up in Calltracks, or currently disabled): " + Object.keys(unknownIdentifiers));
        }
      }


    },
    getPid: function(){
      return 325820285;
    }
  };
})(window);

__ctg3.run();