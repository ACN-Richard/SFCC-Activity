document.addEventListener("DOMContentLoaded", () => {
   /* <![CDATA[ (head-active_data.js) */
   var dw = (window.dw || {});
   dw.ac = {
      _analytics: null,
      _events: [],
      _category: "",
      _searchData: "",
      _anact: "",
      _anact_nohit_tag: "",
      _analytics_enabled: "false",
      _timeZone: "Etc/UTC",
      _capture: function(configs) {
         if (Object.prototype.toString.call(configs) === "[object Array]") {
            configs.forEach(captureObject);
            return;
         }
         dw.ac._events.push(configs);
      },
      capture: function() {
         dw.ac._capture(arguments);
         // send to CQ as well:
         if (window.CQuotient) {
            window.CQuotient.trackEventsFromAC(arguments);
         }
      },

      EV_PRD_SEARCHHIT: "searchhit",
      EV_PRD_DETAIL: "detail",
      EV_PRD_RECOMMENDATION: "recommendation",
      EV_PRD_SETPRODUCT: "setproduct",
      applyContext: function(context) {
         if (typeof context === "object" && context.hasOwnProperty("category")) {
            dw.ac._category = context.category;
         }
         if (typeof context === "object" && context.hasOwnProperty("searchData")) {
            dw.ac._searchData = context.searchData;
         }
      },
      setDWAnalytics: function(analytics) {
         dw.ac._analytics = analytics;
      },
      eventsIsEmpty: function() {
         return 0 == dw.ac._events.length;
      }
   };
   /* ]]> */ // -->
   console.log("Hello World!");


   /* <![CDATA[ (head-cquotient.js) */
   var CQuotient = window.CQuotient = {};
   CQuotient.clientId = 'zzrl-#';
   CQuotient.realm = 'ZZRL';
   CQuotient.siteId = '#';
   CQuotient.instanceType = 'sbx';
   CQuotient.locale = 'default';
   CQuotient.fbPixelId = '__UNKNOWN__';
   CQuotient.activities = [];
   CQuotient.cqcid = '';
   CQuotient.cquid = '';
   CQuotient.cqeid = '';
   CQuotient.cqlid = '';
   /* Turn this on to test against Staging Einstein */
   /* CQuotient.useTest= true; */
   CQuotient.initFromCookies = function() {
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
         var c = ca[i];
         while (c.charAt(0) == ' ') c = c.substring(1, c.length);
         if (c.indexOf('cqcid=') == 0) {
            CQuotient.cqcid = c.substring('cqcid='.length, c.length);
         } else if (c.indexOf('cquid=') == 0) {
            var value = c.substring('cquid='.length, c.length);
            if (value) {
               var split_value = value.split("|", 3);
               if (split_value.length > 0) {
                  CQuotient.cquid = split_value[0];
               }
               if (split_value.length > 1) {
                  CQuotient.cqeid = split_value[1];
               }
               if (split_value.length > 2) {
                  CQuotient.cqlid = split_value[2];
               }
            }
         }
      }
   }
   CQuotient.getCQCookieId = function() {
      if (window.CQuotient.cqcid == '')
         window.CQuotient.initFromCookies();
      return window.CQuotient.cqcid;
   };
   CQuotient.getCQUserId = function() {
      if (window.CQuotient.cquid == '')
         window.CQuotient.initFromCookies();
      return window.CQuotient.cquid;
   };
   CQuotient.getCQHashedEmail = function() {
      if (window.CQuotient.cqeid == '')
         window.CQuotient.initFromCookies();
      return window.CQuotient.cqeid;
   };
   CQuotient.getCQHashedLogin = function() {
      if (window.CQuotient.cqlid == '')
         window.CQuotient.initFromCookies();
      return window.CQuotient.cqlid;
   };
   CQuotient.trackEventsFromAC = function( /* Object or Array */ events) {
      try {
         if (Object.prototype.toString.call(events) === "[object Array]") {
            events.forEach(_trackASingleCQEvent);
         } else {
            CQuotient._trackASingleCQEvent(events);
         }
      } catch (err) {}
   };
   CQuotient._trackASingleCQEvent = function( /* Object */ event) {
      if (event && event.id) {
         if (event.type === dw.ac.EV_PRD_DETAIL) {
            CQuotient.trackViewProduct({
               id: '',
               alt_id: event.id,
               type: 'raw_sku'
            });
         }
         // not handling the other dw.ac.* events currently
      }
   };
   CQuotient.trackViewProduct = function( /* Object */ cqParamData) {
      var cq_params = {};
      cq_params.cookieId = CQuotient.getCQCookieId();
      cq_params.userId = CQuotient.getCQUserId();
      cq_params.emailId = CQuotient.getCQHashedEmail();
      cq_params.loginId = CQuotient.getCQHashedLogin();
      cq_params.product = cqParamData.product;
      cq_params.realm = cqParamData.realm;
      cq_params.siteId = cqParamData.siteId;
      cq_params.instanceType = cqParamData.instanceType;
      cq_params.locale = CQuotient.locale;
      if (CQuotient.sendActivity) {
         CQuotient.sendActivity(CQuotient.clientId, 'viewProduct', cq_params);
      } else {
         CQuotient.activities.push({
            activityType: 'viewProduct',
            parameters: cq_params
         });
      }
   };
   /* ]]> */ // -->
});