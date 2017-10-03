(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(["nono_plugin_sdk"], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but only CommonJS-like environments
    // that support module.exports, like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    window.NONoPluginSDK = factory();
  }
}(this, function () {
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
          v = c == 'x'
            ? r
            : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    /**
 *
 * considering the standard es 6 not support static property
 * we work around by a global var
 */

    // export default
    class NONoPluginSDK {
      static inject(actionHandler) {
        window.addEventListener('message', (e) => {
          let data = e.data;
          let action = data.action;
          let entityData = data.data;
          switch (action) {
            case "getData":
              window
                .parent
                .postMessage({
                  type: "noteData",
                  data: actionHandler.getNoteData(),
                  uuid: uuidv4()
                }, "*")
                break;
            case "setData":
              console.log(entityData)
              if (!actionHandler.setNoteData) {
                console.warn("prepare to set data to editor,missing action handler!");
              }
              actionHandler.setNoteData(entityData)
              console.log("get new note data from nonobiji.com ", entityData);
              break;
            case "renderData":
              console.log(entityData)
              if (!actionHandler.renderNoteData) {
                console.warn("prepare to render data to redner,missing action handler!");
              }
              actionHandler.renderNoteData(entityData)
              console.log("render new note data from nonobiji.com ", entityData);
              break;
            case "qiniuUploadToken":
              NONoEditorRuntime.qiniuToken_inner = entityData;
              break;
            case "setFullScreenState":
              actionHandler.onFullScreenModeChanged(entityData)
              break;
          }
        });

        window
          .parent
          .postMessage({
            type: "noteEditorInjectFinished",
            uuid: uuidv4()
          }, "*");
        $(document.body).on('keydown', (event) => {

          /**
       * Handle ESC Pressed
       */
          if (event.keyCode === 27) {
            event.preventDefault()
            window
              .parent
              .postMessage({
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
                event.preventDefault()
                window
                  .parent
                  .postMessage({
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
      static get QINIU_TOKEN() {
        if (!NONoPluginSDK.qiniuToken_inner) {
          console.warn("qiniu token not ready!")
        }
        return NONoPluginSDK.qiniuToken_inner
      }
      /**
   *When this function is called ,parent remove the "loading mask" upon the editor instantly
   * if the function is not called,parent will remove the "loading mask" after 5s
   */
      static pluginReady() {
        console.log("nono plugin ready")
        if (!this.isPluginReady) {
          console.log("in child", "nono plugin readyt");
          window
            .parent
            .postMessage({
              type: "pluginReady",
              data: "miaowuwuuw",
              uuid: uuidv4()
            }, "*")
          this.isPluginReady = true;
        }
      }
    }
    NONoPluginSDK.isPluginReady = false;
    NONoPluginSDK.qiniuToken_inner = null;
    class ActionHandler {
      /**
   * retrieve note data from editor
   * return {
   *  note_title,
   *  note_content,
   *  note_abstract
   * }
   */
      getNoteData() {}

      /**
   * set content of note editor
   * noteData: {
   *  note_title,
   *  note_content,
   *  note_abstract
   * }
   */
      setNoteData(noteData) {}

      /**
   * render content of note editor
   * noteData: {
   *  note_title,
   *  note_content,
   *  note_abstract
   * }
   */
      renderNoteData(noteData) {}

      /**
   * listen for some UI state
   * @param is_fullscreen
   */
      onFullScreenModeChanged(is_fullscreen) {}

    }

    return NONoPluginSDK;

}));