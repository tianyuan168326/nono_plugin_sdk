'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["nono_plugin_sdk"], factory);
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    // Node. Does not work with strict CommonJS, but only CommonJS-like environments
    // that support module.exports, like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    window.NONoPluginSDK = factory();
  }
})(undefined, function () {
  "use strict";

  /**
  * import this file in your editor
  */
  /**
  * generate uuid for every message
  * @returns {string}
  */

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
  }
  /**
  *
  * considering the standard es 6 not support static property
  * we work around by a global var
  */

  // export default

  var NONoPluginSDK = function () {
    function NONoPluginSDK() {
      _classCallCheck(this, NONoPluginSDK);
    }

    _createClass(NONoPluginSDK, null, [{
      key: 'inject',
      value: function inject(actionHandler) {
        window.addEventListener('message', function (e) {
          var data = e.data;
          var action = data.action;
          var entityData = data.data;
          switch (action) {
            case "getData":
              window.parent.postMessage({
                type: "noteData",
                data: actionHandler.getNoteData(),
                uuid: uuidv4()
              }, "*");
              break;
            case "setData":
              console.log(entityData);
              if (!actionHandler.setNoteData) {
                console.warn("prepare to set data to editor,missing action handler!");
              }
              actionHandler.setNoteData(entityData);
              console.log("get new note data from nonobiji.com ", entityData);
              break;
            case "renderData":
              console.log(entityData);
              if (!actionHandler.renderNoteData) {
                console.warn("prepare to render data to redner,missing action handler!");
              }
              actionHandler.renderNoteData(entityData);
              console.log("render new note data from nonobiji.com ", entityData);
              break;
            case "qiniuUploadToken":
              NONoEditorRuntime.qiniuToken_inner = entityData;
              break;
            case "setFullScreenState":
              actionHandler.onFullScreenModeChanged(entityData);
              break;
          }
        });

        window.parent.postMessage({
          type: "noteEditorInjectFinished",
          uuid: uuidv4()
        }, "*");
        $(document.body).on('keydown', function (event) {

          /**
          * Handle ESC Pressed
          */
          if (event.keyCode === 27) {
            event.preventDefault();
            window.parent.postMessage({
              type: "hotkeyProxy",
              data: {
                event: {
                  keyCode: event.keyCode,
                  ctrlKey: event.ctrlKey,
                  metaKey: event.metaKey,
                  which: event.which
                }
              }
            }, "*");
          }
          if (event.ctrlKey || event.metaKey) {
            switch (String.fromCharCode(event.which).toLowerCase()) {
              case 's':
                event.preventDefault();
                window.parent.postMessage({
                  type: "hotkeyProxy",
                  data: {
                    event: {
                      keyCode: event.keyCode,
                      ctrlKey: event.ctrlKey,
                      metaKey: event.metaKey,
                      which: event.which
                    }
                  }
                }, "*");
                break;
            }
          }
        });
        /**
        * parent will remove the "loading mask" after 5s automatically
        */
        //setTimeout(this.setEditorReady ,5000);
      }
    }, {
      key: 'pluginReady',

      /**
      *When this function is called ,parent remove the "loading mask" upon the editor instantly
      * if the function is not called,parent will remove the "loading mask" after 5s
      */
      value: function pluginReady() {
        console.log("nono plugin ready");
        if (!this.isPluginReady) {
          console.log("in child", "nono plugin readyt");
          window.parent.postMessage({
            type: "pluginReady",
            data: "miaowuwuuw",
            uuid: uuidv4()
          }, "*");
          this.isPluginReady = true;
        }
      }
    }, {
      key: 'QINIU_TOKEN',
      get: function get() {
        if (!NONoPluginSDK.qiniuToken_inner) {
          console.warn("qiniu token not ready!");
        }
        return NONoPluginSDK.qiniuToken_inner;
      }
    }]);

    return NONoPluginSDK;
  }();

  NONoPluginSDK.isPluginReady = false;
  NONoPluginSDK.qiniuToken_inner = null;

  var ActionHandler = function () {
    function ActionHandler() {
      _classCallCheck(this, ActionHandler);
    }

    _createClass(ActionHandler, [{
      key: 'getNoteData',

      /**
      * retrieve note data from editor
      * return {
      *  note_title,
      *  note_content,
      *  note_abstract
      * }
      */
      value: function getNoteData() {}

      /**
      * set content of note editor
      * noteData: {
      *  note_title,
      *  note_content,
      *  note_abstract
      * }
      */

    }, {
      key: 'setNoteData',
      value: function setNoteData(noteData) {}

      /**
      * render content of note editor
      * noteData: {
      *  note_title,
      *  note_content,
      *  note_abstract
      * }
      */

    }, {
      key: 'renderNoteData',
      value: function renderNoteData(noteData) {}

      /**
      * listen for some UI state
      * @param is_fullscreen
      */

    }, {
      key: 'onFullScreenModeChanged',
      value: function onFullScreenModeChanged(is_fullscreen) {}
    }]);

    return ActionHandler;
  }();

  return NONoPluginSDK;
});