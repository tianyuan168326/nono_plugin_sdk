在此文档中，将渲染/编辑插件称为`分离插件`，将渲染编辑一体插件称为`一体插件`。
# InteractBridge
## `static inject (actionHandler)`

actionHandler的schema为：
```js
{
    action1:function(paramFromNONoFrameWork),
    action2:function(paramFromNONoFrameWork),
    action3:function(paramFromNONoFrameWork),
    ...
}

```
这个函数是NONo笔记SDK的核心函数，插件可以通过注册一些action的handler函数来响应NONo主进程的一些特定action:

Action列表
> 以下使用`(param1,param2...)->returntype`的形式对Handler fucntion进行描述

* getNoteData
    
    NONo笔记主进程通过此Handler来获得插件中编辑的内容

    分离插件之editor | 分离插件之render | 一体插件
    ---- | --- | ---
    可注入 | 不可注入 | 可注入
    
    对应的Handler function为`()->{note_title,note_content,note_abstract}`

* setNoteData

    NONo笔记通过此Handler向插件(仅编辑器)设置待编辑的笔记数据

    分离插件之editor | 分离插件之render | 一体插件
    ---- | --- | ---
    可注入 | 不可注入 | 不可注入

    对应的Handler function为`({note_title,note_content,note_abstract})->null`

* renderNoteData

    NONo笔记通过此Handler向插件设置待渲染的笔记数据

    分离插件之editor | 分离插件之render | 一体插件
    ---- | --- | ---
    不可注入 | 可注入 | 可注入

    对应的Handler function为`({note_title,note_content,note_abstract})->null`
    
* onFullScreenModeChanged

    NONo笔记通过此Handler向插件通知插件所在区域是否处于全屏状态，插件内部可以对此action进行响应式处理

    分离插件之editor | 分离插件之render | 一体插件
    ---- | --- | ---
    可注入 | 可注入 | 可注入

    对应的Handler function为`(bool)->null`
## `static saveNote()`
通知NONo笔记主进程对笔记进行保存。
分离插件之editor | 分离插件之render | 一体插件
    ---- | --- | ---
    不可调用 | 可调用 | 可调用

一体插件可以在需要保存笔记内容的时机调用此函数。

## `static pluginReady()`
通知NONo笔记主进程，插件已经就绪。
分离插件之editor | 分离插件之render | 一体插件
    ---- | --- | ---
    一定要调用 | 一定要调用 | 一定要调用
    
插件一切准备就绪后（`建议在调用过InteractBridge.inject之后`），调用一次此函数。

# Utils

`static uploadFile(file)`

`return`

`Promise,resolve({filefileUrl:url}),reject({message:errormessage})`

上传文件的工具类，文件大小不要超过1MB，否则会上传失败。
file类型为[File ](https://developer.mozilla.org/en-US/docs/Web/API/File)。