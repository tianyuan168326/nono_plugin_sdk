import tokenManager from "./TokenManager"
export default class InteractBridge {
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
                data: actionHandler.getNoteData()
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
          case "setFullScreenState":
            actionHandler.onFullScreenModeChanged(entityData)
            break;
        }
      });
  
      window
        .parent
        .postMessage({
          type: "noteEditorInjectFinished"
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
      return tokenManager.getQiniuToken();
      if (!tokenManager.getQiniuToken()) {
        console.warn("qiniu token not ready!")
      }
    }
    static saveNote() {
      window
        .parent
        .postMessage({
          type: "saveNote"
        }, "*")
    }
    /**
     *When this function is called ,parent remove the "loading mask" upon the editor instantly
     * if the function is not called,parent will remove the "loading mask" after 5s
     */
    static pluginReady() {
      /**
       * NONo笔记SDK内部处理的一些消息，并且不允许用户hook
       */
      window.addEventListener('message', (e) => {
        let data = e.data;
        let action = data.action;
        let entityData = data.data;
        switch (action) {
          case "qiniuUploadToken":
            console.log("qiniu token received"+entityData)
            tokenManager.setQiniuToken(entityData)
            break;
        }
      });
      console.log("nono plugin ready")
      if (!this.isPluginReady) {
        console.log("in child", "nono plugin readyt");
        window
          .parent
          .postMessage({
            type: "pluginReady"
          }, "*")
        this.isPluginReady = true;
      }
    }
  }