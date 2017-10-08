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