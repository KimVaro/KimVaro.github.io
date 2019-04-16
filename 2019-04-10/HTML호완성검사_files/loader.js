//! Calltracks Web Number Dynamics - 3rd generation - Copyright 2007 onwards, Calltracks
//! This code is generated, and MUST be loaded from Calltracks. Do not simply copy and paste the code into your web site or tag manager.

var class_names = ["contact-tile__phone","contact-pane__button","dealer-header__contact-list-item--phone"];

var classNamesMatch = "exact";

// fix for ie 8
  if (!document.getElementsByClassName) {
    document.getElementsByClassName = function(search) {
      var d = document, elements, pattern, i, results = [];
      if (d.querySelectorAll) { // IE8
        return d.querySelectorAll("." + search);
      }
      if (d.evaluate) { // IE6, IE7
        pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
        elements = d.evaluate(pattern, d, null, 0, null);
        while ((i = elements.iterateNext())) {
          results.push(i);
        }
      } else {
        elements = d.getElementsByTagName("*");
        pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
        for (i = 0; i < elements.length; i++) {
          if ( pattern.test(elements[i].className) ) {
            results.push(elements[i]);
          }
        }
      }
      return results;
    }
  }
// Source: Eli Grey @ https://eligrey.com/blog/post/textcontent-in-ie8
if (Object.defineProperty
  && Object.getOwnPropertyDescriptor
  && Object.getOwnPropertyDescriptor(Element.prototype, "textContent")
  && !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) {
  (function() {
    var innerText = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
    Object.defineProperty(Element.prototype, "textContent",
     // Passing innerText or innerText.get directly does not work,
     // wrapper function is required.
     {
       get: function() {
         return innerText.get.call(this);
       },
       set: function(s) {
         return innerText.set.call(this, s);
       }
     }
   );
  })();
}
// end fix for ie 8
if (document.createElement && document.childNodes){
  if (typeof(__ctwnd) == "object") {
    if(__ctwnd.isInitialised){__ctwnd.reinit()}
  }
  else{
    function setCalltracksClassFromTextContent(elements) {
      for(var i = 0; i<elements.length; i++){
        var el = elements[i];
        var newClassName = ' calltracks_' + el.textContent.replace(/\s/g, '');
        if (el.className.indexOf(newClassName) == -1) {
          el.className += newClassName;
        }
      }
    }

    function elementContainsClassNameStartingWith(el, str) {
      var classNames = el.className.split(" ");
      for(var i = 0; i < classNames.length; i++) {
        var className = classNames[i];
        if (className.indexOf(str) == 0) {
          return true;
        }
      }

      return false;
    }

      for(var i = 0; i < class_names.length; i++) {
        var className = class_names[i];
        var elements = [];
        if (classNamesMatch == 'startsWith') {
          if (document.querySelectorAll) {
            foundElements = document.querySelectorAll("[class*=" + className + "]");
            for(var j = 0; j < foundElements.length; j++) {
              var el = foundElements[j];
              if (elementContainsClassNameStartingWith(el, className)) {
                elements.push(el);
              }
            }
          }
        } else {
          elements = document.getElementsByClassName(className);
        }
        setCalltracksClassFromTextContent(elements);
      };

    var __ctwnd = (function(ctWindow){
        var reInitG3 = false;  
        var numberIdentifiers = [];
        var previousIdentifiers = [];
        var generate_guid = function() {
             function rch() { return Math.floor((1 + Math.random()) * 0x10000) .toString(16) .substring(1); }
             return rch() + rch() + rch() + rch() + rch() + rch() + rch() + rch();
        };

        function isCalltracksDisabledCookieSet() {
          if (__ctwnd.rc("calltracksDisabled")) {
            return true;
          } else {
            return false;
          }
        }

        function setCalltracksDisabledCookie(set) {
          if(!__ctwnd.isGdprActive()) {
            if (set) {
              __ctwnd.sc("calltracksDisabled", 1);
            } else {
              __ctwnd.dc("calltracksDisabled");
            }
          }
        }

        var checkIfCookiesAllowed = function() {

          if(!__ctwnd.isGdprActive()) {
            return !isCalltracksDisabledCookieSet();
          } else {
            __ctwnd.dc('calltracksGuid');
            __ctwnd.dc('calltracksData');
            __ctwnd.dc("calltracksDisabled");

            var guid = __ctwnd.rc(__ctwnd.uidCookieName());
            if(guid == null) {

              if (window.calltracksCookiesAllowed == true || __ctwnd.forceTracking) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          }
        };

        var getNumberIdentifiers = function(){
          var newNumberIdentifiers = [];
          var spanElements = [];
          if (document.querySelectorAll) {
            var elementsWithCtprefixClass = document.querySelectorAll("[class*=" + 'calltracks_' + "]");
            spanElements = Array.prototype.slice.call(elementsWithCtprefixClass);
          }

          for (var i=0; i<spanElements.length; i++){
            var span = spanElements[i];
            var spanIdentifiers = [];
            if (span.className.indexOf('calltracks_')===-1){continue}
            var elementClasses=span.className.split(' ');
            for (var j=0; j<elementClasses.length; j++){
              if (elementClasses[j].toLowerCase().indexOf('calltracks_')!=0){continue}
              var identifierName = elementClasses[j].toLowerCase().replace('calltracks_', ''), add=true;
              spanIdentifiers.push(identifierName);
            }
            if (spanIdentifiers.length == 0) {
              add=false; continue;
            }

            var allids=newNumberIdentifiers.concat(previousIdentifiers);
            var delimiterForOriginalContent = encodeURIComponent("|");
            var lowercasedDelimiterForOriginalContent = delimiterForOriginalContent.toLowerCase();
            for(var k=0;k<allids.length;k++){
              var curr=allids[k].toLowerCase();
              for (var l = 0; l < spanIdentifiers.length; l++) {
                var identifierName = spanIdentifiers[l];
                if(curr==identifierName||curr.indexOf(identifierName+lowercasedDelimiterForOriginalContent)===0){
                  spanIdentifiers.splice(l, 1);
                }
              }
            }
            if (spanIdentifiers.length == 0) {
              add=false; continue;
            }

            if (!__ctwnd.isInitialised && span.attributes['data-replace-delayed'] && span.attributes['data-replace-delayed'].value==='true'){add=false;break;}
            if(add){
              reInitG3 = __ctwnd.isInitialised && true; 
              var extra_info= delimiterForOriginalContent + "original-content=" + encodeURIComponent(encodeURIComponent(span.textContent)); 
              var without_attr_data = [];
              for( var l=0; l<span.attributes.length; l++){
                var lowerCaseAttribute = span.attributes[l].name.toLowerCase();
                if(lowerCaseAttribute.indexOf("data-")===0){
                  var lowerCaseAttributeNoData = lowerCaseAttribute.substr('data-'.length);
                  if ((without_attr_data.length != 0) && (without_attr_data.indexOf(lowerCaseAttributeNoData) != -1)){
                    // skip
                    extra_info += "";
                  }else{
                    extra_info += delimiterForOriginalContent +
                    lowerCaseAttribute.replace("data-","") +
                    "=" +
                    encodeURIComponent(span.attributes[l].value);
                  }
                }
              }

              for (var l = 0; l < spanIdentifiers.length; l++) {
                var identifierName = spanIdentifiers[l];
                newNumberIdentifiers.push(identifierName+extra_info);
              }
            }
          }
          return newNumberIdentifiers;
        };
        return{
           init: function(){
             __ctwnd.pollCookieStatus();

             var requestForIdentifiers = []
             if (__ctwnd.isInitialised){reInitG3=false;previousIdentifiers=numberIdentifiers.slice();}
               requestForIdentifiers = getNumberIdentifiers();
             numberIdentifiers=previousIdentifiers.concat(requestForIdentifiers);

             var calltracksData = __ctwnd.rc(__ctwnd.infoCookieName());
             var calltracksGuid = __ctwnd.rc(__ctwnd.uidCookieName());

             __ctwnd.cookies_allowed = checkIfCookiesAllowed();

             if(__ctwnd.cookies_allowed == true) {
               if (calltracksGuid == null) {
                 var newGuid = generate_guid();
                 calltracksGuid = newGuid;
                 __ctwnd.sc(__ctwnd.uidCookieName(), newGuid);
               } else {
                 __ctwnd.sc(__ctwnd.uidCookieName(), calltracksGuid);
               }
             } else {
               if (__ctwnd.isTestMode) {
                var element = document.createElement('span');
                element.id = 'calltracksDisabledTestMode';
                element.textContent = 'calltracksDisabledTestMode';
                document.body.appendChild(element);
               }
               return;
             }

             if (__ctwnd.isInitialised && reInitG3 == false){
               if(typeof(__ctg3)==="object"){__ctg3.run()}
               else{__ctwnd.needReInit=true}
             }
             else{
               var ctuapsid = new Date().getTime()+'.'+Math.random().toString(36).substring(5);
               __ctwnd.ctuapsid = ctuapsid;

               var ctG3    = document.createElement('script');
               var ctG3Uri = '//pendragon.calltracks.com:443/wnd/g3.js?class_names=' + "'contact-tile__phone','contact-pane__button','dealer-header__contact-list-item--phone'" + '&cr=' + encodeURIComponent(document.referrer) + '&cp=' + encodeURIComponent(window.location.href) + '&ctd=' + calltracksData + '&ctguid=' + calltracksGuid + '&t=' + ctWindow.escape(ctWindow.escape(document.title)) + '&fk=' + encodeURIComponent(__ctwnd.rc('__utma')) + '&c=' + encodeURIComponent(__ctwnd.rc('__utmz')) + '&cv=' + encodeURIComponent(__ctwnd.rc('__utmv')) + '&ids=' + (requestForIdentifiers.length===0 ? null : requestForIdentifiers) + '&ctuapsid=' + ctuapsid;
               if (typeof(__ctg3) == 'object'){ctG3Uri += '&pid=' + __ctg3.getPid();}
               else if(__ctwnd.isInitialised){__ctwnd.needReInit=true;numberIdentifiers=previousIdentifiers;return}
               ctG3Uri = ctG3Uri + '&ts=' + new Date().getTime();
               ctG3.setAttribute('src', ctG3Uri);
               ctG3.setAttribute('type', 'text/javascript');
               ctG3.setAttribute('async', true);
               __ctwnd.isInitialised=true;
               document.getElementsByTagName('head')[0].appendChild(ctG3);
             }
           },
           reinit: function(){
             __ctwnd.init();
           },
           getNewGuid: function() {
             return generate_guid();
           },
           sc: function(name,value){
             var date  = new Date();
               date.setTime(date.getTime() + 2592000000);
               var expires = ' expires=' + date.toGMTString() + ';';
             var c = name + '=' + value + '; path=/;' + expires;
             document.cookie = c;
           },
           dc: function(name) {
             var c = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
             document.cookie = c;
           },
           rc: function(name) {
             var nameEQ = name + "=";
             var ca = document.cookie.split(';');
             for (var i=0; i<ca.length; i++) {
               var c = ca[i];
               while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
               if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
             }
             return null;
           },
           disableCookies: function() {
             __ctwnd.cookies_allowed = false;
             window.calltracksCookiesAllowed = false;

             setCalltracksDisabledCookie(true);

             __ctwnd.dc(__ctwnd.uidCookieName());
             __ctwnd.dc(__ctwnd.infoCookieName());
           },

           enableCookies: function() {
             __ctwnd.cookies_allowed = true;
             window.calltracksCookiesAllowed = true;

             setCalltracksDisabledCookie(false);

             if (!__ctwnd.rc(__ctwnd.uidCookieName())) {
              var newGuid = __ctwnd.getNewGuid();
              __ctwnd.sc(__ctwnd.uidCookieName(), newGuid);
             }
             __ctwnd.reinit();
           },

           pollCookieStatus: function() {
             if(window.calltracksCookiesAllowed != undefined && window.calltracksCookiesAllowed != __ctwnd.cookies_allowed) {
               if(window.calltracksCookiesAllowed == true) {
                 __ctwnd.enableCookies();
               } else {
                 __ctwnd.disableCookies();
               }
               __ctwnd.cookies_allowed = window.calltracksCookiesAllowed;
             }
             setTimeout(__ctwnd.pollCookieStatus, 500);
           },

           get_guid: function(){
             return __ctwnd.rc(__ctwnd.uidCookieName());
           },
           isInitialised: false,
           isTestMode: false,
           forceTracking: true,
           isGdprActive: function() {
             var calltracksGdprActive = __ctwnd.rc('calltracksGdprActive');
             if (calltracksGdprActive != null) {
               return (calltracksGdprActive == '1') ? true : false;
             }
             var todaysDate = new Date();
             var cutoffDate = new Date(2018, 7, 13, 0, 0, 0, 0);

             return todaysDate.getTime() >= cutoffDate.getTime();
           },
           infoCookieName: function() {
             if (__ctwnd.isGdprActive()) {
               return 'calltracksINFO';
             } else {
               return 'calltracksData';
             }
           },
           uidCookieName: function() {
             if (__ctwnd.isGdprActive()) {
               return 'calltracksUID';
             } else {
               return 'calltracksGuid';
             }
           }
        };
    })(window);
    window.setTimeout(function(){__ctwnd.init()},10);

    CalltracksClickToReveal = function() {
  this.displayDefaultNumberAfter = 1000; // miliseconds
  this.defaultNumberDataAttributeName = 'data-default-number';
  this.calltracksClassDataAttributeName = 'data-calltracks-class';

  this.loaderReady = false;
}

CalltracksClickToReveal.prototype.onClick = function(el, f) {
  if (el.addEventListener) {
    el.addEventListener('click', f, false);
  } else if (el.attachEvent)  {
    el.attachEvent('onclick', f);
  }
}

CalltracksClickToReveal.prototype.start = function() {
  var that = this;
  var spanElements = document.getElementsByTagName('span');
  for(var i = 0; i < spanElements.length; i++) {
    var span = spanElements[i];
    if (span.getAttribute(this.calltracksClassDataAttributeName)) {
      this.onClick(span, function(event) {
        var element = event.target || event.srcElement;

        var href = element.parentNode.getAttribute('href');
        if (href && href.match(/\s*tel:\+?[\d-]+/i)) {
          return true;
        }

        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        that.handleClick(element);
        if (!that.loaderReady) {
          that.clickEventBeforeInitialize = true;
        }
      });
    }
  }
  this.waitForLoader();
}

CalltracksClickToReveal.prototype.waitForLoader = function() {
  var that = this;
  function checkLoader() {
    if (window['__ctwnd'] && window.__ctwnd.isInitialised) {
      that.loaderReady = true;
      if (that.clickEventBeforeInitialize) {
        __ctwnd.reinit();
      }
    } else {
      setTimeout(checkLoader, 100);
    }
  }

  checkLoader();
}

CalltracksClickToReveal.prototype.handleClick = function(element) {
  var that = this;
  var parentIsLink = false;
  if (element.parentNode.tagName == 'A') {
    parentIsLink = true;
    element.parentNode.setAttribute('href', 'tel:');
  }
  element.className += ' ' + element.getAttribute(this.calltracksClassDataAttributeName);

  setTimeout(function() {
    if (!element.getAttribute('data-calltracks-replaced-at')) {
      var defaultNumber = element.getAttribute(that.defaultNumberDataAttributeName);
      if (defaultNumber) {
        element.innerHTML = defaultNumber;
        if (parentIsLink) {
          element.parentNode.setAttribute('href', 'tel:' + defaultNumber.replace(/[^+\d]/g, ''));
        }
      }
    }
  }, this.displayDefaultNumberAfter);

  if (this.loaderReady) {
    __ctwnd.reinit();
  }
}

new CalltracksClickToReveal().start();

  }
}
