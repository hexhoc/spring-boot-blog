/*
 * Editor.md
 *
 * @file        editormd.js 
 * @version     v1.5.0 
 * @description Open source online markdown editor.
 * @license     MIT License
 * @author      Pandao
 * {@link       https://github.com/pandao/editor.md}
 * @updateTime  2015-06-09
 */

;(function(factory) {
    "use strict";

// CommonJS/Node.js
    if (typeof require === "function" && typeof exports === "object" && typeof module === "object")
    {
        module.exports = factory;
    }
    else if (typeof define === "function") // AMD/CMD/Sea.js
    {
        if (define.amd) // for Require.js
        {
            /* Require.js define replace */
        }
        else
        {
            define(["jquery"], factory); // for Sea.js
        }
    }
    else
    {
        window.editormd = factory();
    }

}(function() {

    /* Require.js assignment replace */

    "use strict";

    var $ = (typeof (jQuery) !== "undefined")? jQuery: Zepto;

    if (typeof ($) === "undefined") {
        return;
    }

    /**
     * editormd
     *
     * @param {String} id editor ID
     * @param {Object} options configuration options Key/Value
     * @returns {Object} editormd returns editormd object
     */

    var editormd = function (id, options) {
        return new editormd.fn.init(id, options);
    };

    editormd.title = editormd.$name = "Editor.md";
    editormd.version = "1.5.0";
    editormd.homePage = "https://pandao.github.io/editor.md/";
    editormd.classPrefix = "editormd-";

    editormd.toolbarModes = {
        full: [
            "undo", "redo", "|",
            "bold", "del", "italic", "quote", "ucwords", "uppercase", "lowercase", "|",
            "h1", "h2", "h3", "h4", "h5", "h6", "|",
            "list-ul", "list-ol", "hr", "|",
            "link", "reference-link", "image", "code", "preformatted-text", "code-block", "table", "datetime", "emoji", "html-entities", "pagebreak ", "|",
            "goto-line", "watch", "preview", "fullscreen", "clear", "search", "|",
            "help", "info"
        ],
        simple: [
            "undo", "redo", "|",
            "bold", "del", "italic", "quote", "uppercase", "lowercase", "|",
            "h1", "h2", "h3", "h4", "h5", "h6", "|",
            "list-ul", "list-ol", "hr", "|",
            "watch", "preview", "fullscreen", "|",
            "help", "info"
        ],
        mini: [
            "undo", "redo", "|",
            "watch", "preview", "|",
            "help", "info"
        ]
    };

    editormd.defaults = {
        mode: "gfm", //gfm or markdown
        name: "", // Form element name
        value: "", // value for CodeMirror, if mode not gfm/markdown
        theme: "", // Editor.md self themes, before v1.5.0 is CodeMirror theme, default empty
        editorTheme: "default", // Editor area, this is CodeMirror theme at v1.5.0
        previewTheme: "", // Preview area theme, default empty
        markdown: "", // Markdown source code
        appendMarkdown: "", // if in init textarea value not empty, append markdown to textarea
        width: "100%",
        height: "100%",
        path: "./lib/", // Dependents module file directory
        pluginPath: "", // If this empty, default use settings.path + "../plugins/"
        delay: 300, // Delay parse markdown to html, Uint: ms
        autoLoadModules: true, // Automatic load dependent module files
        watch: true,
        placeholder: "Enjoy Markdown! coding now...",
        gotoLine: true,
        codeFold: false,
        autoHeight: false,
        autoFocus: true,
        autoCloseTags: true,
        searchReplace: true,
        syncScrolling: true, // true | false | "single", default true
        readOnly: false,
        tabSize: 4,
        indentUnit: 4,
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        showTrailingSpace: true,
        matchBrackets: true,
        indentWithTabs: true,
        styleSelectedText: true,
        matchWordHighlight: true, // options: true, false, "onselected"
        styleActiveLine: true, // Highlight the current line
        dialogLockScreen: true,
        dialogShowMask: true,
        dialogDraggable: true,
        dialogMaskBgColor: "#fff",
        dialogMaskOpacity: 0.1,
        fontSize: "13px",
        saveHTMLToTextarea: false,
        disabledKeyMaps: [],

        onload: function() {},
        onresize: function() {},
        onchange: function() {},
        onwatch: null,
        onunwatch: null,
        onpreviewing: function() {},
        onpreviewed: function() {},
        onfullscreen: function() {},
        onfullscreenExit: function() {},
        onscroll: function() {},
        onpreviewscroll: function() {},

        imageUpload: false,
        imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL: "",
        crossDomainUpload: false,
        uploadCallbackURL: "",

        toc: true, // Table of contents
        tocm: false, // Using [TOCM], auto create ToC dropdown menu
        tocTitle: "", // for ToC dropdown menu btn
        tocDropdown: false,
        tocContainer: "",
        tocStartLevel: 1, // Said from H1 to create ToC
        htmlDecode: false, // Open the HTML tag identification
        pageBreak: true, // Enable parse page break [========]
        atLink: true, // for @link
        emailLink: true, // for email address auto link
        taskList: false, // Enable Github Flavored Markdown task lists
        emoji: false, // :emoji:, Support Github emoji, Twitter Emoji (Twemoji);
        // Support FontAwesome icon emoji :fa-xxx:> Using fontAwesome icon web fonts;
        // Support Editor.md logo icon emoji :editormd-logo: :editormd-logo-1x:> 1~8x;
        tex: false, // TeX(LaTeX), based on KaTeX
        flowChart: false, // flowChart.js only support IE9+
        sequenceDiagram: false, // sequenceDiagram.js only support IE9+
        previewCodeHighlight: true,

        toolbar              : true,           // show/hide toolbar
        toolbarAutoFixed     : true,           // on window scroll auto fixed position
        toolbarIcons         : "full",
        toolbarTitles        : {},
        toolbarHandlers      : {
            ucwords : function() {
                return editormd.toolbarHandlers.ucwords;
            },
            lowercase : function() {
                return editormd.toolbarHandlers.lowercase;
            }
        },
        toolbarCustomIcons   : {               // using html tag create toolbar icon, unused default <a> tag.
            lowercase        : "<a href=\"javascript:;\" title=\"Lowercase\" unselectable=\"on\"><i class=\"fa\" name=\"lowercase\" style=\"font-size:24px;margin-top: -10px;\">a</i></a>",
            "ucwords"        : "<a href=\"javascript:;\" title=\"ucwords\" unselectable=\"on\"><i class=\"fa\" name=\"ucwords\" style=\"font-size:20px;margin-top: -3px;\">Aa</i></a>"
        },
        toolbarIconsClass    : {
            undo             : "fa-undo",
            redo             : "fa-repeat",
            bold             : "fa-bold",
            del              : "fa-strikethrough",
            italic           : "fa-italic",
            quote            : "fa-quote-left",
            uppercase        : "fa-font",
            h1               : editormd.classPrefix + "bold",
            h2               : editormd.classPrefix + "bold",
            h3               : editormd.classPrefix + "bold",
            h4               : editormd.classPrefix + "bold",
            h5               : editormd.classPrefix + "bold",
            h6               : editormd.classPrefix + "bold",
            "list-ul"        : "fa-list-ul",
            "list-ol"        : "fa-list-ol",
            hr               : "fa-minus",
            link             : "fa-link",
            "reference-link" : "fa-anchor",
            image            : "fa-picture-o",
            code             : "fa-code",
            "preformatted-text" : "fa-file-code-o",
            "code-block"     : "fa-file-code-o",
            table            : "fa-table",
            datetime         : "fa-clock-o",
            emoji            : "fa-smile-o",
            "html-entities"  : "fa-copyright",
            pagebreak        : "fa-newspaper-o",
            "goto-line"      : "fa-terminal", // fa-crosshairs
            watch            : "fa-eye-slash",
            unwatch          : "fa-eye",
            preview          : "fa-desktop",
            search           : "fa-search",
            fullscreen       : "fa-arrows-alt",
            clear            : "fa-eraser",
            help             : "fa-question-circle",
            info             : "fa-info-circle"
        },
        toolbarIconTexts     : {},

        lang: {
            name: "en-US",
            description: "Open source online Markdown editor<br/>Open source online Markdown editor.",
            tocTitle: "Catalogue",
            toolbar: {
                undo: "Undo (Ctrl+Z)",
                redo: "Redo (Ctrl+Y)",
                bold: "Bold",
                del: "Strikethrough",
                italic: "Italic",
                quote: "Quote",
                ucwords: "Convert the first letter of each word to uppercase",
                uppercase: "Convert selected to uppercase",
                lowercase: "Convert selected to lowercase",
                h1: "Title 1",
                h2: "Title 2",
                h3: "Title 3",
                h4: "Title 4",
                h5: "Title 5",
                h6: "Title 6",
                "list-ul": "Unordered List",
                "list-ol": "Ordered List",
                hr: "Horizontal Line",
                link: "Link",
                "reference-link": "reference link",
                image: "Add Picture",
                code: "inline code",
                "preformatted-text": "Preformatted text / code block (indented style)",
                "code-block": "Code block (multilingual style)",
                table: "Add Table",
                datetime: "Date Time",
                emoji: "Emoji expression",
                "html-entities": "HTML entity characters",
                pagebreak: "Insert a page break",
                "goto-line": "Go to line",
                watch: "Turn off real-time preview",
                unwatch: "Enable real-time preview",
                preview: "Preview HTML in full window (press Shift + ESC to restore)",
                fullscreen: "Full screen (press ESC to restore)",
                clear: "Clear",
                search: "Search",
                help: "Use Help",
                info: "About" + editormd.title
            },
            buttons: {
                enter: "OK",
                cancel: "Cancel",
                close: "Close"
            },
            dialog: {
                link: {
                    title: "Add link",
                    url: "Link address",
                    urlTitle: "Link Title",
                    urlEmpty: "Error: Please fill in the link address."
                },
                referenceLink: {
                    title: "Add reference link",
                    name: "Reference name",
                    url: "Link address",
                    urlId: "Link ID",
                    urlTitle: "Link Title",
                    nameEmpty: "Error: The name of the reference link cannot be empty.",
                    idEmpty: "Error: Please fill in the ID of the reference link.",
                    urlEmpty: "Error: Please fill in the URL address of the reference link."
                },
                image: {
                    title: "Add Picture",
                    url: "path",
                    link: "link",
                    alt: "comment",
                    uploadButton: "Upload",
                    imageURLEmpty: "Error: The image URL cannot be empty.",
                    uploadFileEmpty: "Error: The uploaded picture cannot be empty.",
                    formatNotAllowed: "Error: Only image files are allowed to be uploaded. The allowed image file formats are:"
                },
                preformattedText: {
                    title: "Add preformatted text or code block",
                    emptyAlert: "Error: Please fill in the content of the preformatted text or code."
                },
                codeBlock: {
                    title: "Add code block",
                    selectLabel: "Code language:",
                    selectDefaultText: "Please select the code language",
                    otherLanguage: "Other Languages",
                    unselectedLanguageAlert: "Error: Please select the language type of the code.",
                    codeEmptyAlert: "Error: Please fill in the code content."
                },
                htmlEntities: {
                    title: "HTML entity characters"
                },
                help: {
                    title: "Use Help"
                }
            }
        }
    };
    
    editormd.classNames  = {
        tex : editormd.classPrefix + "tex"
    };

    editormd.dialogZindex = 99999;
    
    editormd.$katex       = null;
    editormd.$marked      = null;
    editormd.$CodeMirror  = null;
    editormd.$prettyPrint = null;
    
    var timer, flowchartTimer;

    editormd.prototype    = editormd.fn = {
        state : {
            watching   : false,
            loaded     : false,
            preview    : false,
            fullscreen : false
        },

        /**
         * Constructor/instance initialization
         * Constructor / instance initialization
         *
         * @param {String} id editor ID
         * @param {Object} [options={}] Configuration option Key/Value
         * @returns {editormd} returns an instance object of editormd
         */

        init : function (id, options) {
            
            options              = options || {};
            
            if (typeof id === "object")
            {
                options = id;
            }
            
            var _this            = this;
            var classPrefix      = this.classPrefix  = editormd.classPrefix; 
            var settings         = this.settings     = $.extend(true, editormd.defaults, options);
            
            id                   = (typeof id === "object") ? settings.id : id;
            
            var editor           = this.editor       = $("#" + id);
            
            this.id              = id;
            this.lang            = settings.lang;
            
            var classNames       = this.classNames   = {
                textarea : {
                    html     : classPrefix + "html-textarea",
                    markdown : classPrefix + "markdown-textarea"
                }
            };
            
            settings.pluginPath = (settings.pluginPath === "") ? settings.path + "../plugins/" : settings.pluginPath; 
            
            this.state.watching = (settings.watch) ? true : false;
            
            if ( !editor.hasClass("editormd") ) {
                editor.addClass("editormd");
            }
            
            editor.css({
                width  : (typeof settings.width  === "number") ? settings.width  + "px" : settings.width,
                height : (typeof settings.height === "number") ? settings.height + "px" : settings.height
            });
            
            if (settings.autoHeight)
            {
                editor.css("height", "auto");
            }
                        
            var markdownTextarea = this.markdownTextarea = editor.children("textarea");
            
            if (markdownTextarea.length < 1)
            {
                editor.append("<textarea></textarea>");
                markdownTextarea = this.markdownTextarea = editor.children("textarea");
            }
            
            markdownTextarea.addClass(classNames.textarea.markdown).attr("placeholder", settings.placeholder);
            
            if (typeof markdownTextarea.attr("name") === "undefined" || markdownTextarea.attr("name") === "")
            {
                markdownTextarea.attr("name", (settings.name !== "") ? settings.name : id + "-markdown-doc");
            }
            
            var appendElements = [
                (!settings.readOnly) ? "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "preview-close-btn\"></a>" : "",
                ( (settings.saveHTMLToTextarea) ? "<textarea class=\"" + classNames.textarea.html + "\" name=\"" + id + "-html-code\"></textarea>" : "" ),
                "<div class=\"" + classPrefix + "preview\"><div class=\"markdown-body " + classPrefix + "preview-container\"></div></div>",
                "<div class=\"" + classPrefix + "container-mask\" style=\"display:block;\"></div>",
                "<div class=\"" + classPrefix + "mask\"></div>"
            ].join("\n");
            
            editor.append(appendElements).addClass(classPrefix + "vertical");
            
            if (settings.theme !== "") 
            {
                editor.addClass(classPrefix + "theme-" + settings.theme);
            }
            
            this.mask          = editor.children("." + classPrefix + "mask");    
            this.containerMask = editor.children("." + classPrefix  + "container-mask");
            
            if (settings.markdown !== "")
            {
                markdownTextarea.val(settings.markdown);
            }
            
            if (settings.appendMarkdown !== "")
            {
                markdownTextarea.val(markdownTextarea.val() + settings.appendMarkdown);
            }
            
            this.htmlTextarea     = editor.children("." + classNames.textarea.html);            
            this.preview          = editor.children("." + classPrefix + "preview");
            this.previewContainer = this.preview.children("." + classPrefix + "preview-container");
            
            if (settings.previewTheme !== "") 
            {
                this.preview.addClass(classPrefix + "preview-theme-" + settings.previewTheme);
            }
            
            if (typeof define === "function" && define.amd)
            {
                if (typeof katex !== "undefined") 
                {
                    editormd.$katex = katex;
                }
                
                if (settings.searchReplace && !settings.readOnly) 
                {
                    editormd.loadCSS(settings.path + "codemirror/addon/dialog/dialog");
                    editormd.loadCSS(settings.path + "codemirror/addon/search/matchesonscrollbar");
                }
            }
            
            if ((typeof define === "function" && define.amd) || !settings.autoLoadModules)
            {
                if (typeof CodeMirror !== "undefined") {
                    editormd.$CodeMirror = CodeMirror;
                }
                
                if (typeof marked     !== "undefined") {
                    editormd.$marked     = marked;
                }
                
                this.setCodeMirror().setToolbar().loadedDisplay();
            } 
            else 
            {
                this.loadQueues();
            }

            return this;
        },

        /**
         * Required component loading queue
         * Required components loading queue
         *
         * @returns {editormd} returns an instance object of editormd
         */

        loadQueues : function() {
            var _this        = this;
            var settings     = this.settings;
            var loadPath     = settings.path;
                                
            var loadFlowChartOrSequenceDiagram = function() {
                
                if (editormd.isIE8) 
                {
                    _this.loadedDisplay();
                    
                    return ;
                }

                if (settings.flowChart || settings.sequenceDiagram) 
                {
                    editormd.loadScript(loadPath + "raphael.min", function() {

                        editormd.loadScript(loadPath + "underscore.min", function() {  

                            if (!settings.flowChart && settings.sequenceDiagram) 
                            {
                                editormd.loadScript(loadPath + "sequence-diagram.min", function() {
                                    _this.loadedDisplay();
                                });
                            }
                            else if (settings.flowChart && !settings.sequenceDiagram) 
                            {      
                                editormd.loadScript(loadPath + "flowchart.min", function() {  
                                    editormd.loadScript(loadPath + "jquery.flowchart.min", function() {
                                        _this.loadedDisplay();
                                    });
                                });
                            }
                            else if (settings.flowChart && settings.sequenceDiagram) 
                            {  
                                editormd.loadScript(loadPath + "flowchart.min", function() {  
                                    editormd.loadScript(loadPath + "jquery.flowchart.min", function() {
                                        editormd.loadScript(loadPath + "sequence-diagram.min", function() {
                                            _this.loadedDisplay();
                                        });
                                    });
                                });
                            }
                        });

                    });
                } 
                else
                {
                    _this.loadedDisplay();
                }
            }; 

            editormd.loadCSS(loadPath + "codemirror/codemirror.min");
            
            if (settings.searchReplace && !settings.readOnly)
            {
                editormd.loadCSS(loadPath + "codemirror/addon/dialog/dialog");
                editormd.loadCSS(loadPath + "codemirror/addon/search/matchesonscrollbar");
            }
            
            if (settings.codeFold)
            {
                editormd.loadCSS(loadPath + "codemirror/addon/fold/foldgutter");            
            }
            
            editormd.loadScript(loadPath + "codemirror/codemirror.min", function() {
                editormd.$CodeMirror = CodeMirror;
                
                editormd.loadScript(loadPath + "codemirror/modes.min", function() {
                    
                    editormd.loadScript(loadPath + "codemirror/addons.min", function() {
                        
                        _this.setCodeMirror();
                        
                        if (settings.mode !== "gfm" && settings.mode !== "markdown") 
                        {
                            _this.loadedDisplay();
                            
                            return false;
                        }
                        
                        _this.setToolbar();

                        editormd.loadScript(loadPath + "marked.min", function() {

                            editormd.$marked = marked;
                                
                            if (settings.previewCodeHighlight) 
                            {
                                editormd.loadScript(loadPath + "prettify.min", function() {
                                    loadFlowChartOrSequenceDiagram();
                                });
                            } 
                            else
                            {                  
                                loadFlowChartOrSequenceDiagram();
                            }
                        });
                        
                    });
                    
                });
                
            });

            return this;
        },

        /**
         * Set the overall theme of Editor.md, mainly the toolbar
         * Setting Editor.md theme
         *
         * @returns {editormd} returns an instance object of editormd
         */

        setTheme : function(theme) {
            var editor      = this.editor;
            var oldTheme    = this.settings.theme;
            var themePrefix = this.classPrefix + "theme-";
            
            editor.removeClass(themePrefix + oldTheme).addClass(themePrefix + theme);
            
            this.settings.theme = theme;
            
            return this;
        },

        /**
         * Set the theme of CodeMirror (edit area)
         * Setting CodeMirror (Editor area) theme
         *
         * @returns {editormd} returns an instance object of editormd
         */

        setEditorTheme : function(theme) {  
            var settings   = this.settings;  
            settings.editorTheme = theme;  
            
            if (theme !== "default")
            {
                editormd.loadCSS(settings.path + "codemirror/theme/" + settings.editorTheme);
            }
            
            this.cm.setOption("theme", theme);
            
            return this;
        },

        /**
         * Alias of setEditorTheme()
         * setEditorTheme() alias
         *
         * @returns {editormd} returns an instance object of editormd
         */

        setCodeMirrorTheme : function (theme) {            
            this.setEditorTheme(theme);
            
            return this;
        },

        /**
         * Set the theme of Editor.md
         * Setting Editor.md theme
         *
         * @returns {editormd} returns an instance object of editormd
         */

        setPreviewTheme : function(theme) {  
            var preview     = this.preview;
            var oldTheme    = this.settings.previewTheme;
            var themePrefix = this.classPrefix + "preview-theme-";
            
            preview.removeClass(themePrefix + oldTheme).addClass(themePrefix + theme);
            
            this.settings.previewTheme = theme;
            
            return this;
        },

        /**
         * Configure and initialize CodeMirror components
         * CodeMirror initialization
         *
         * @returns {editormd} returns an instance object of editormd
         */

        setCodeMirror : function() { 
            var settings         = this.settings;
            var editor           = this.editor;
            
            if (settings.editorTheme !== "default")
            {
                editormd.loadCSS(settings.path + "codemirror/theme/" + settings.editorTheme);
            }
            
            var codeMirrorConfig = {
                mode                      : settings.mode,
                theme                     : settings.editorTheme,
                tabSize                   : settings.tabSize,
                dragDrop                  : false,
                autofocus                 : settings.autoFocus,
                autoCloseTags             : settings.autoCloseTags,
                readOnly                  : (settings.readOnly) ? "nocursor" : false,
                indentUnit                : settings.indentUnit,
                lineNumbers               : settings.lineNumbers,
                lineWrapping              : settings.lineWrapping,
                extraKeys                 : {
                                                "Ctrl-Q": function(cm) { 
                                                    cm.foldCode(cm.getCursor()); 
                                                }
                                            },
                foldGutter                : settings.codeFold,
                gutters                   : ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                matchBrackets             : settings.matchBrackets,
                indentWithTabs            : settings.indentWithTabs,
                styleActiveLine           : settings.styleActiveLine,
                styleSelectedText         : settings.styleSelectedText,
                autoCloseBrackets         : settings.autoCloseBrackets,
                showTrailingSpace         : settings.showTrailingSpace,
                highlightSelectionMatches : ( (!settings.matchWordHighlight) ? false : { showToken: (settings.matchWordHighlight === "onselected") ? false : /\w/ } )
            };
            
            this.codeEditor = this.cm        = editormd.$CodeMirror.fromTextArea(this.markdownTextarea[0], codeMirrorConfig);
            this.codeMirror = this.cmElement = editor.children(".CodeMirror");
            
            if (settings.value !== "")
            {
                this.cm.setValue(settings.value);
            }

            this.codeMirror.css({
                fontSize : settings.fontSize,
                width    : (!settings.watch) ? "100%" : "50%"
            });
            
            if (settings.autoHeight)
            {
                this.codeMirror.css("height", "auto");
                this.cm.setOption("viewportMargin", Infinity);
            }
            
            if (!settings.lineNumbers)
            {
                this.codeMirror.find(".CodeMirror-gutters").css("border-right", "none");
            }

            return this;
        },

        /**
         * Get the configuration options of CodeMirror
         * Get CodeMirror setting options
         *
         * @returns {Mixed} return CodeMirror setting option value
         */

        getCodeMirrorOption : function(key) {            
            return this.cm.getOption(key);
        },

        /**
         * Option to configure and reconfigure CodeMirror
         * CodeMirror setting options / resettings
         *
         * @returns {editormd} returns an instance object of editormd
         */

        setCodeMirrorOption : function(key, value) {
            
            this.cm.setOption(key, value);
            
            return this;
        },

        /**
         * Add CodeMirror keyboard shortcuts
         * Add CodeMirror keyboard shortcuts key map
         *
         * @returns {editormd} returns an instance object of editormd
         */

        addKeyMap : function(map, bottom) {
            this.cm.addKeyMap(map, bottom);
            
            return this;
        },

        /**
         * Remove CodeMirror keyboard shortcut
         * Remove CodeMirror keyboard shortcuts key map
         *
         * @returns {editormd} returns an instance object of editormd
         */

        removeKeyMap : function(map) {
            this.cm.removeKeyMap(map);
            
            return this;
        },

        /**
         * Jump to the specified line
         * Goto CodeMirror line
         *
         * @param {String|Intiger} line line number or "first"|"last"
         * @returns {editormd} returns an instance object of editormd
         */

        gotoLine : function (line) {
            
            var settings = this.settings;
            
            if (!settings.gotoLine)
            {
                return this;
            }
            
            var cm       = this.cm;
            var editor   = this.editor;
            var count    = cm.lineCount();
            var preview  = this.preview;
            
            if (typeof line === "string")
            {
                if(line === "last")
                {
                    line = count;
                }
            
                if (line === "first")
                {
                    line = 1;
                }
            }
            
            if (typeof line !== "number") 
            {  
                alert("Error: The line number must be an integer.");
                return this;
            }
            
            line  = parseInt(line) - 1;
            
            if (line > count)
            {
                alert("Error: The line number range 1-" + count);
                
                return this;
            }
            
            cm.setCursor( {line : line, ch : 0} );
            
            var scrollInfo   = cm.getScrollInfo();
            var clientHeight = scrollInfo.clientHeight; 
            var coords       = cm.charCoords({line : line, ch : 0}, "local");
            
            cm.scrollTo(null, (coords.top + coords.bottom - clientHeight) / 2);
            
            if (settings.watch)
            {            
                var cmScroll  = this.codeMirror.find(".CodeMirror-scroll")[0];
                var height    = $(cmScroll).height(); 
                var scrollTop = cmScroll.scrollTop;         
                var percent   = (scrollTop / cmScroll.scrollHeight);

                if (scrollTop === 0)
                {
                    preview.scrollTop(0);
                } 
                else if (scrollTop + height >= cmScroll.scrollHeight - 16)
                { 
                    preview.scrollTop(preview[0].scrollHeight);                    
                } 
                else
                {                    
                    preview.scrollTop(preview[0].scrollHeight * percent);
                }
            }

            cm.focus();
            
            return this;
        },

        /**
         * Extend the current instance object, you can set multiple or only one at the same time
         * Extend editormd instance object, can mutil setting.
         *
         * @returns {editormd} this(editormd instance object.)
         */

        extend : function() {
            if (typeof arguments[1] !== "undefined")
            {
                if (typeof arguments[1] === "function")
                {
                    arguments[1] = $.proxy(arguments[1], this);
                }

                this[arguments[0]] = arguments[1];
            }
            
            if (typeof arguments[0] === "object" && typeof arguments[0].length === "undefined")
            {
                $.extend(true, this, arguments[0]);
            }

            return this;
        },

        /**
         * Set or extend the current instance object, single setting
         * Extend editormd instance object, one by one
         *
         * @param {String|Object} key option key
         * @param {String|Object} value option value
         * @returns {editormd} this(editormd instance object.)
         */

        set : function (key, value) {
            
            if (typeof value !== "undefined" && typeof value === "function")
            {
                value = $.proxy(value, this);
            }
            
            this[key] = value;

            return this;
        },

        /**
         * Reconfiguration
         * Resetting editor options
         *
         * @param {String|Object} key option key
         * @param {String|Object} value option value
         * @returns {editormd} this(editormd instance object.)
         */

        config : function(key, value) {
            var settings = this.settings;
            
            if (typeof key === "object")
            {
                settings = $.extend(true, settings, key);
            }
            
            if (typeof key === "string")
            {
                settings[key] = value;
            }
            
            this.settings = settings;
            this.recreate();
            
            return this;
        },

        /**
         * Register event handling method
         * Bind editor event handle
         *
         * @param {String} eventType event type
         * @param {Function} callback callback function
         * @returns {editormd} this(editormd instance object.)
         */

        on : function(eventType, callback) {
            var settings = this.settings;
            
            if (typeof settings["on" + eventType] !== "undefined") 
            {                
                settings["on" + eventType] = $.proxy(callback, this);      
            }

            return this;
        },

        /**
         * Dismiss event handling method
         * Unbind editor event handle
         *
         * @param {String} eventType event type
         * @returns {editormd} this(editormd instance object.)
         */

        off : function(eventType) {
            var settings = this.settings;
            
            if (typeof settings["on" + eventType] !== "undefined") 
            {
                settings["on" + eventType] = function(){};
            }
            
            return this;
        },

        /**
         * Show toolbar
         * Display toolbar
         *
         * @param {Function} [callback=function(){}] callback function
         * @returns {editormd} returns an instance object of editormd
         */

        showToolbar : function(callback) {
            var settings = this.settings;
            
            if(settings.readOnly) {
                return this;
            }
            
            if (settings.toolbar && (this.toolbar.length < 1 || this.toolbar.find("." + this.classPrefix + "menu").html() === "") )
            {
                this.setToolbar();
            }
            
            settings.toolbar = true; 
            
            this.toolbar.show();
            this.resize();
            
            $.proxy(callback || function(){}, this)();

            return this;
        },

        /**
         * Hide toolbar
         * Hide toolbar
         *
         * @param {Function} [callback=function(){}] callback function
         * @returns {editormd} this(editormd instance object.)
         */

        hideToolbar : function(callback) { 
            var settings = this.settings;
            
            settings.toolbar = false;  
            this.toolbar.hide();
            this.resize();
            
            $.proxy(callback || function(){}, this)();

            return this;
        },

        /**
         * Fixed positioning of the toolbar when the page scrolls
         * Set toolbar in window scroll auto fixed position
         *
         * @returns {editormd} returns an instance object of editormd
         */

        setToolbarAutoFixed : function(fixed) {
            
            var state    = this.state;
            var editor   = this.editor;
            var toolbar  = this.toolbar;
            var settings = this.settings;
            
            if (typeof fixed !== "undefined")
            {
                settings.toolbarAutoFixed = fixed;
            }
            
            var autoFixedHandle = function(){
                var $window = $(window);
                var top     = $window.scrollTop();
                
                if (!settings.toolbarAutoFixed)
                {
                    return false;
                }

                if (top - editor.offset().top > 10 && top < editor.height())
                {
                    toolbar.css({
                        position : "fixed",
                        width    : editor.width() + "px",
                        left     : ($window.width() - editor.width()) / 2 + "px"
                    });
                }
                else
                {
                    toolbar.css({
                        position : "absolute",
                        width    : "100%",
                        left     : 0
                    });
                }
            };
            
            if (!state.fullscreen && !state.preview && settings.toolbar && settings.toolbarAutoFixed)
            {
                $(window).bind("scroll", autoFixedHandle);
            }

            return this;
        },

        /**
         * Configure and initialize the toolbar
         * Set toolbar and Initialization
         *
         * @returns {editormd} returns an instance object of editormd
         */

        setToolbar : function() {
            var settings    = this.settings;  
            
            if(settings.readOnly) {
                return this;
            }
            
            var editor      = this.editor;
            var preview     = this.preview;
            var classPrefix = this.classPrefix;
            
            var toolbar     = this.toolbar = editor.children("." + classPrefix + "toolbar");
            
            if (settings.toolbar && toolbar.length < 1)
            {            
                var toolbarHTML = "<div class=\"" + classPrefix + "toolbar\"><div class=\"" + classPrefix + "toolbar-container\"><ul class=\"" + classPrefix + "menu\"></ul></div></div>";
                
                editor.append(toolbarHTML);
                toolbar = this.toolbar = editor.children("." + classPrefix + "toolbar");
            }
            
            if (!settings.toolbar) 
            {
                toolbar.hide();
                
                return this;
            }
            
            toolbar.show();
            
            var icons       = (typeof settings.toolbarIcons === "function") ? settings.toolbarIcons() 
                            : ((typeof settings.toolbarIcons === "string")  ? editormd.toolbarModes[settings.toolbarIcons] : settings.toolbarIcons);
            
            var toolbarMenu = toolbar.find("." + this.classPrefix + "menu"), menu = "";
            var pullRight   = false;
            
            for (var i = 0, len = icons.length; i < len; i++)
            {
                var name = icons[i];

                if (name === "||") 
                { 
                    pullRight = true;
                } 
                else if (name === "|")
                {
                    menu += "<li class=\"divider\" unselectable=\"on\">|</li>";
                }
                else
                {
                    var isHeader = (/h(\d)/.test(name));
                    var index    = name;
                    
                    if (name === "watch" && !settings.watch) {
                        index = "unwatch";
                    }
                    
                    var title     = settings.lang.toolbar[index];
                    var iconTexts = settings.toolbarIconTexts[index];
                    var iconClass = settings.toolbarIconsClass[index];
                    
                    title     = (typeof title     === "undefined") ? "" : title;
                    iconTexts = (typeof iconTexts === "undefined") ? "" : iconTexts;
                    iconClass = (typeof iconClass === "undefined") ? "" : iconClass;

                    var menuItem = pullRight ? "<li class=\"pull-right\">" : "<li>";
                    
                    if (typeof settings.toolbarCustomIcons[name] !== "undefined" && typeof settings.toolbarCustomIcons[name] !== "function")
                    {
                        menuItem += settings.toolbarCustomIcons[name];
                    }
                    else 
                    {
                        menuItem += "<a href=\"javascript:;\" title=\"" + title + "\" unselectable=\"on\">";
                        menuItem += "<i class=\"fa " + iconClass + "\" name=\""+name+"\" unselectable=\"on\">"+((isHeader) ? name.toUpperCase() : ( (iconClass === "") ? iconTexts : "") ) + "</i>";
                        menuItem += "</a>";
                    }

                    menuItem += "</li>";

                    menu = pullRight ? menuItem + menu : menu + menuItem;
                }
            }

            toolbarMenu.html(menu);
            
            toolbarMenu.find("[title=\"Lowercase\"]").attr("title", settings.lang.toolbar.lowercase);
            toolbarMenu.find("[title=\"ucwords\"]").attr("title", settings.lang.toolbar.ucwords);
            
            this.setToolbarHandler();
            this.setToolbarAutoFixed();

            return this;
        },

        /**
         * Toolbar icon event processing object sequence
         * Get toolbar icons event handlers
         *
         * @param {Object} cm CodeMirror instance object
         * @param {String} name The name of the event handler to be obtained
         * @returns {Object} returns the sequence of processing objects
         */

        dialogLockScreen : function() {
            $.proxy(editormd.dialogLockScreen, this)();
            
            return this;
        },

        dialogShowMask : function(dialog) {
            $.proxy(editormd.dialogShowMask, this)(dialog);
            
            return this;
        },
        
        getToolbarHandles : function(name) {  
            var toolbarHandlers = this.toolbarHandlers = editormd.toolbarHandlers;
            
            return (name && typeof toolbarIconHandlers[name] !== "undefined") ? toolbarHandlers[name] : toolbarHandlers;
        },

        /**
         * Toolbar icon event handler
         * Bind toolbar icons event handle
         *
         * @returns {editormd} returns an instance object of editormd
         */

        setToolbarHandler : function() {
            var _this               = this;
            var settings            = this.settings;
            
            if (!settings.toolbar || settings.readOnly) {
                return this;
            }
            
            var toolbar             = this.toolbar;
            var cm                  = this.cm;
            var classPrefix         = this.classPrefix;           
            var toolbarIcons        = this.toolbarIcons = toolbar.find("." + classPrefix + "menu > li > a");  
            var toolbarIconHandlers = this.getToolbarHandles();  
                
            toolbarIcons.bind(editormd.mouseOrTouch("click", "touchend"), function(event) {

                var icon                = $(this).children(".fa");
                var name                = icon.attr("name");
                var cursor              = cm.getCursor();
                var selection           = cm.getSelection();

                if (name === "") {
                    return ;
                }
                
                _this.activeIcon = icon;

                if (typeof toolbarIconHandlers[name] !== "undefined") 
                {
                    $.proxy(toolbarIconHandlers[name], _this)(cm);
                }
                else 
                {
                    if (typeof settings.toolbarHandlers[name] !== "undefined") 
                    {
                        $.proxy(settings.toolbarHandlers[name], _this)(cm, icon, cursor, selection);
                    }
                }
                
                if (name !== "link" && name !== "reference-link" && name !== "image" && name !== "code-block" && 
                    name !== "preformatted-text" && name !== "watch" && name !== "preview" && name !== "search" && name !== "fullscreen" && name !== "info") 
                {
                    cm.focus();
                }

                return false;

            });

            return this;
        },

        /**
         * Dynamically create dialog
         * Creating custom dialogs
         *
         * @param {Object} options configuration item key-value pair Key/Value
         * @returns {dialog} returns the jQuery instance object of the created dialog
         */

        createDialog : function(options) {            
            return $.proxy(editormd.createDialog, this)(options);
        },

        /**
         * Create a dialog about Editor.md
         * Create about Editor.md dialog
         *
         * @returns {editormd} returns an instance object of editormd
         */

        createInfoDialog : function() {
            var _this        = this;
			var editor       = this.editor;
            var classPrefix  = this.classPrefix;  
            
            var infoDialogHTML = [
                "<div class=\"" + classPrefix + "dialog " + classPrefix + "dialog-info\" style=\"\">",
                "<div class=\"" + classPrefix + "dialog-container\">",
                "<h1><i class=\"editormd-logo editormd-logo-lg editormd-logo-color\"></i> " + editormd.title + "<small>v" + editormd.version + "</small></h1>",
                "<p>" + this.lang.description + "</p>",
                "<p style=\"margin: 10px 0 20px 0;\"><a href=\"" + editormd.homePage + "\" target=\"_blank\">" + editormd.homePage + " <i class=\"fa fa-external-link\"></i></a></p>",
                "<p style=\"font-size: 0.85em;\">Copyright &copy; 2015 <a href=\"https://github.com/pandao\" target=\"_blank\" class=\"hover-link\">Pandao</a>, The <a href=\"https://github.com/pandao/editor.md/blob/master/LICENSE\" target=\"_blank\" class=\"hover-link\">MIT</a> License.</p>",
                "</div>",
                "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "dialog-close\"></a>",
                "</div>"
            ].join("\n");

            editor.append(infoDialogHTML);
            
            var infoDialog  = this.infoDialog = editor.children("." + classPrefix + "dialog-info");

            infoDialog.find("." + classPrefix + "dialog-close").bind(editormd.mouseOrTouch("click", "touchend"), function() {
                _this.hideInfoDialog();
            });
            
            infoDialog.css("border", (editormd.isIE8) ? "1px solid #ddd" : "").css("z-index", editormd.dialogZindex).show();
            
            this.infoDialogPosition();

            return this;
        },

        /**
         * About Editor.md dialogue center positioning
         * Editor.md dialog position handle
         *
         * @returns {editormd} returns an instance object of editormd
         */

        infoDialogPosition : function() {
            var infoDialog = this.infoDialog;
            
			var _infoDialogPosition = function() {
				infoDialog.css({
					top  : ($(window).height() - infoDialog.height()) / 2 + "px",
					left : ($(window).width()  - infoDialog.width()) / 2  + "px"
				});
			};

			_infoDialogPosition();

			$(window).resize(_infoDialogPosition);
            
            return this;
        },

        /**
         * Show about Editor.md
         * Display about Editor.md dialog
         *
         * @returns {editormd} returns an instance object of editormd
         */

        showInfoDialog : function() {

            $("html,body").css("overflow-x", "hidden");
            
            var _this       = this;
			var editor      = this.editor;
            var settings    = this.settings;         
			var infoDialog  = this.infoDialog = editor.children("." + this.classPrefix + "dialog-info");
            
            if (infoDialog.length < 1)
            {
                this.createInfoDialog();
            }
            
            this.lockScreen(true);
            
            this.mask.css({
						opacity         : settings.dialogMaskOpacity,
						backgroundColor : settings.dialogMaskBgColor
					}).show();

			infoDialog.css("z-index", editormd.dialogZindex).show();

			this.infoDialogPosition();

            return this;
        },

        /**
         * Hide about Editor.md
         * Hide about Editor.md dialog
         *
         * @returns {editormd} returns an instance object of editormd
         */

        hideInfoDialog : function() {            
            $("html,body").css("overflow-x", "");
            this.infoDialog.hide();
            this.mask.hide();
            this.lockScreen(false);

            return this;
        },

        /**
         * Lock screen
         * lock screen
         *
         * @param {Boolean} lock Boolean Boolean value, whether to lock the screen
         * @returns {editormd} returns an instance object of editormd
         */

        lockScreen : function(lock) {
            editormd.lockScreen(lock);
            this.resize();

            return this;
        },

        /**
         * The editor interface is rebuilt for dynamic language packs or module loading, etc.
         * Recreate editor
         *
         * @returns {editormd} returns an instance object of editormd
         */

        recreate: function() {
            var _this = this;
            var editor = this.editor;
            var settings = this.settings;

            this.codeMirror.remove();

            this.setCodeMirror();

            if (!settings.readOnly)
            {
                if (editor.find(".editormd-dialog").length> 0) {
                    editor.find(".editormd-dialog").remove();
                }

                if (settings.toolbar)
                {
                    this.getToolbarHandles();
                    this.setToolbar();
                }
            }

            this.loadedDisplay(true);

            return this;
        },

        /**
         * Highlight and preview the pre code part of HTML
         * highlight of preview codes
         *
         * @returns {editormd} returns an instance object of editormd
         */

        previewCodeHighlight: function() {
            var settings = this.settings;
            var previewContainer = this.previewContainer;

            if (settings.previewCodeHighlight)
            {
                previewContainer.find("pre").addClass("prettyprint linenums");

                if (typeof prettyPrint !== "undefined")
                {
                    prettyPrint();
                }
            }

            return this;
        },

        /**
         * Analyze TeX (KaTeX) scientific formula
         * TeX(KaTeX) Renderer
         *
         * @returns {editormd} returns an instance object of editormd
         */

        katexRender: function() {

            if (timer === null)
            {
                return this;
            }

            this.previewContainer.find("." + editormd.classNames.tex).each(function(){
                var tex = $(this);
                editormd.$katex.render(tex.text(), tex[0]);

                tex.find(".katex").css("font-size", "1.6em");
            });

            return this;
        },

        /**
         * Analyze and render flowcharts and timing diagrams
         * FlowChart and SequenceDiagram Renderer
         *
         * @returns {editormd} returns an instance object of editormd
         */

        flowChartAndSequenceDiagramRender: function() {
            var $this = this;
            var settings = this.settings;
            var previewContainer = this.previewContainer;

            if (editormd.isIE8) {
                return this;
            }

            if (settings.flowChart) {
                if (flowchartTimer === null) {
                    return this;
                }

                previewContainer.find(".flowchart").flowChart();
            }

            if (settings.sequenceDiagram) {
                previewContainer.find(".sequence-diagram").sequenceDiagram({theme: "simple"});
            }

            var preview = $this.preview;
            var codeMirror = $this.codeMirror;
            var codeView = codeMirror.find(".CodeMirror-scroll");

            var height = codeView.height();
            var scrollTop = codeView.scrollTop();
            var percent = (scrollTop / codeView[0].scrollHeight);
            var tocHeight = 0;

            preview.find(".markdown-toc-list").each(function(){
                tocHeight += $(this).height();
            });

            var tocMenuHeight = preview.find(".editormd-toc-menu").height();
            tocMenuHeight = (!tocMenuHeight)? 0: tocMenuHeight;

            if (scrollTop === 0)
            {
                preview.scrollTop(0);
            }
            else if (scrollTop + height >= codeView[0].scrollHeight-16)
            {
                preview.scrollTop(preview[0].scrollHeight);
            }
            else
            {
                preview.scrollTop((preview[0].scrollHeight + tocHeight + tocMenuHeight) * percent);
            }

            return this;
        },

        /**
         * Register keyboard shortcut processing
         * Register CodeMirror keyMaps (keyboard shortcuts).
         *
         * @param {Object} keyMap KeyMap key/value {"(Ctrl/Shift/Alt)-Key": function(){}}
         * @returns {editormd} return this
         */

        registerKeyMaps : function(keyMap) {
            
            var _this           = this;
            var cm              = this.cm;
            var settings        = this.settings;
            var toolbarHandlers = editormd.toolbarHandlers;
            var disabledKeyMaps = settings.disabledKeyMaps;
            
            keyMap              = keyMap || null;
            
            if (keyMap)
            {
                for (var i in keyMap)
                {
                    if ($.inArray(i, disabledKeyMaps) < 0)
                    {
                        var map = {};
                        map[i]  = keyMap[i];

                        cm.addKeyMap(keyMap);
                    }
                }
            }
            else
            {
                for (var k in editormd.keyMaps)
                {
                    var _keyMap = editormd.keyMaps[k];
                    var handle = (typeof _keyMap === "string") ? $.proxy(toolbarHandlers[_keyMap], _this) : $.proxy(_keyMap, _this);
                    
                    if ($.inArray(k, ["F9", "F10", "F11"]) < 0 && $.inArray(k, disabledKeyMaps) < 0)
                    {
                        var _map = {};
                        _map[k] = handle;

                        cm.addKeyMap(_map);
                    }
                }
                
                $(window).keydown(function(event) {
                    
                    var keymaps = {
                        "120" : "F9",
                        "121" : "F10",
                        "122" : "F11"
                    };
                    
                    if ( $.inArray(keymaps[event.keyCode], disabledKeyMaps) < 0 )
                    {
                        switch (event.keyCode)
                        {
                            case 120:
                                    $.proxy(toolbarHandlers["watch"], _this)();
                                    return false;
                                break;
                                
                            case 121:
                                    $.proxy(toolbarHandlers["preview"], _this)();
                                    return false;
                                break;
                                
                            case 122:
                                    $.proxy(toolbarHandlers["fullscreen"], _this)();                        
                                    return false;
                                break;
                                
                            default:
                                break;
                        }
                    }
                });
            }

            return this;
        },

        /**
         * Bind synchronous scrolling
         *
         * @returns {editormd} return this
         */

        bindScrollEvent : function() {
            
            var _this            = this;
            var preview          = this.preview;
            var settings         = this.settings;
            var codeMirror       = this.codeMirror;
            var mouseOrTouch     = editormd.mouseOrTouch;
            
            if (!settings.syncScrolling) {
                return this;
            }
                
            var cmBindScroll = function() {    
                codeMirror.find(".CodeMirror-scroll").bind(mouseOrTouch("scroll", "touchmove"), function(event) {
                    var height    = $(this).height();
                    var scrollTop = $(this).scrollTop();                    
                    var percent   = (scrollTop / $(this)[0].scrollHeight);
                    
                    var tocHeight = 0;
                    
                    preview.find(".markdown-toc-list").each(function(){
                        tocHeight += $(this).height();
                    });
                    
                    var tocMenuHeight = preview.find(".editormd-toc-menu").height();
                    tocMenuHeight = (!tocMenuHeight) ? 0 : tocMenuHeight;

                    if (scrollTop === 0) 
                    {
                        preview.scrollTop(0);
                    } 
                    else if (scrollTop + height >= $(this)[0].scrollHeight - 16)
                    { 
                        preview.scrollTop(preview[0].scrollHeight);                        
                    } 
                    else
                    {
                        preview.scrollTop((preview[0].scrollHeight  + tocHeight + tocMenuHeight) * percent);
                    }
                    
                    $.proxy(settings.onscroll, _this)(event);
                });
            };

            var cmUnbindScroll = function() {
                codeMirror.find(".CodeMirror-scroll").unbind(mouseOrTouch("scroll", "touchmove"));
            };

            var previewBindScroll = function() {
                
                preview.bind(mouseOrTouch("scroll", "touchmove"), function(event) {
                    var height    = $(this).height();
                    var scrollTop = $(this).scrollTop();         
                    var percent   = (scrollTop / $(this)[0].scrollHeight);
                    var codeView  = codeMirror.find(".CodeMirror-scroll");

                    if(scrollTop === 0) 
                    {
                        codeView.scrollTop(0);
                    }
                    else if (scrollTop + height >= $(this)[0].scrollHeight)
                    {
                        codeView.scrollTop(codeView[0].scrollHeight);                        
                    }
                    else 
                    {
                        codeView.scrollTop(codeView[0].scrollHeight * percent);
                    }
                    
                    $.proxy(settings.onpreviewscroll, _this)(event);
                });

            };

            var previewUnbindScroll = function() {
                preview.unbind(mouseOrTouch("scroll", "touchmove"));
            }; 

			codeMirror.bind({
				mouseover  : cmBindScroll,
				mouseout   : cmUnbindScroll,
				touchstart : cmBindScroll,
				touchend   : cmUnbindScroll
			});
            
            if (settings.syncScrolling === "single") {
                return this;
            }
            
			preview.bind({
				mouseover  : previewBindScroll,
				mouseout   : previewUnbindScroll,
				touchstart : previewBindScroll,
				touchend   : previewUnbindScroll
			});

            return this;
        },
        
        bindChangeEvent : function() {
            
            var _this            = this;
            var cm               = this.cm;
            var settings         = this.settings;
            
            if (!settings.syncScrolling) {
                return this;
            }
            
            cm.on("change", function(_cm, changeObj) {
                
                if (settings.watch)
                {
                    _this.previewContainer.css("padding", settings.autoHeight ? "20px 20px 50px 40px" : "20px");
                }
                
                timer = setTimeout(function() {
                    clearTimeout(timer);
                    _this.save();
                    timer = null;
                }, settings.delay);
            });

            return this;
        },

        /**
         * Display processing after the loading queue is completed
         * Display handle of the module queues loaded after.
         *
         * @param {Boolean} Whether recreate is a rebuild editor
         * @returns {editormd} returns an instance object of editormd
         */

        loadedDisplay: function(recreate) {

            recreate = recreate || false;

            var _this = this;
            var editor = this.editor;
            var preview = this.preview;
            var settings = this.settings;

            this.containerMask.hide();

            this.save();

            if (settings.watch) {
                preview.show();
            }

            editor.data("oldWidth", editor.width()).data("oldHeight", editor.height()); // For compatibility with Zepto

            this.resize();
            this.registerKeyMaps();

            $(window).resize(function(){
                _this.resize();
            });

            this.bindScrollEvent().bindChangeEvent();

            if (!recreate)
            {
                $.proxy(settings.onload, this)();
            }

            this.state.loaded = true;

            return this;
        },

        /**
         * Set the width of the editor
         * Set editor width
         *
         * @param {Number|String} width editor width value
         * @returns {editormd} returns an instance object of editormd
         */

        width: function(width) {

            this.editor.css("width", (typeof width === "number")? width + "px": width);
            this.resize();

            return this;
        },

        /**
         * Set the height of the editor
         * Set editor height
         *
         * @param {Number|String} height Editor height value
         * @returns {editormd} returns an instance object of editormd
         */

        height: function(height) {

            this.editor.css("height", (typeof height === "number")? height + "px": height);
            this.resize();

            return this;
        },

        /**
         * Adjust the size and layout of the editor
         * Resize editor layout
         *
         * @param {Number|String} [width=null] Editor width value
         * @param {Number|String} [height=null] Editor height value
         * @returns {editormd} returns an instance object of editormd
         */

        resize : function(width, height) {
            
            width  = width  || null;
            height = height || null;
            
            var state      = this.state;
            var editor     = this.editor;
            var preview    = this.preview;
            var toolbar    = this.toolbar;
            var settings   = this.settings;
            var codeMirror = this.codeMirror;
            
            if (width)
            {
                editor.css("width", (typeof width  === "number") ? width  + "px" : width);
            }
            
            if (settings.autoHeight && !state.fullscreen && !state.preview)
            {
                editor.css("height", "auto");
                codeMirror.css("height", "auto");
            } 
            else 
            {
                if (height) 
                {
                    editor.css("height", (typeof height === "number") ? height + "px" : height);
                }
                
                if (state.fullscreen)
                {
                    editor.height($(window).height());
                }

                if (settings.toolbar && !settings.readOnly) 
                {
                    codeMirror.css("margin-top", toolbar.height() + 1).height(editor.height() - toolbar.height());
                } 
                else
                {
                    codeMirror.css("margin-top", 0).height(editor.height());
                }
            }
            
            if(settings.watch) 
            {
                codeMirror.width(editor.width() / 2);
                preview.width((!state.preview) ? editor.width() / 2 : editor.width());
                
                this.previewContainer.css("padding", settings.autoHeight ? "20px 20px 50px 40px" : "20px");
                
                if (settings.toolbar && !settings.readOnly) 
                {
                    preview.css("top", toolbar.height() + 1);
                } 
                else 
                {
                    preview.css("top", 0);
                }
                
                if (settings.autoHeight && !state.fullscreen && !state.preview)
                {
                    preview.height("");
                }
                else
                {                
                    var previewHeight = (settings.toolbar && !settings.readOnly) ? editor.height() - toolbar.height() : editor.height();
                    
                    preview.height(previewHeight);
                }
            } 
            else 
            {
                codeMirror.width(editor.width());
                preview.hide();
            }
            
            if (state.loaded) 
            {
                $.proxy(settings.onresize, this)();
            }

            return this;
        },

        /**
         * Parse and save Markdown code
         * Parse & Saving Markdown source code
         *
         * @returns {editormd} returns an instance object of editormd
         */

        save : function() {
            
            var _this            = this;
            var state            = this.state;
            var settings         = this.settings;

            if (timer === null && !(!settings.watch && state.preview))
            {
                return this;
            }
            
            var cm               = this.cm;            
            var cmValue          = cm.getValue();
            var previewContainer = this.previewContainer;

            if (settings.mode !== "gfm" && settings.mode !== "markdown") 
            {
                this.markdownTextarea.val(cmValue);
                
                return this;
            }
            
            var marked          = editormd.$marked;
            var markdownToC     = this.markdownToC = [];            
            var rendererOptions = this.markedRendererOptions = {  
                toc                  : settings.toc,
                tocm                 : settings.tocm,
                tocStartLevel        : settings.tocStartLevel,
                pageBreak            : settings.pageBreak,
                taskList             : settings.taskList,
                emoji                : settings.emoji,
                tex                  : settings.tex,
                atLink               : settings.atLink,           // for @link
                emailLink            : settings.emailLink,        // for mail address auto link
                flowChart            : settings.flowChart,
                sequenceDiagram      : settings.sequenceDiagram,
                previewCodeHighlight : settings.previewCodeHighlight,
            };
            
            var markedOptions = this.markedOptions = {
                renderer    : editormd.markedRenderer(markdownToC, rendererOptions),
                gfm         : true,
                tables      : true,
                breaks      : true,
                pedantic    : false,
                sanitize    : (settings.htmlDecode) ? false : true,  // 关闭忽略HTML标签，即开启识别HTML标签，默认为false
                smartLists  : true,
                smartypants : true
            };
            
            marked.setOptions(markedOptions);
                    
            var newMarkdownDoc = editormd.$marked(cmValue, markedOptions);
            
            //console.info("cmValue", cmValue, newMarkdownDoc);
            
            newMarkdownDoc = editormd.filterHTMLTags(newMarkdownDoc, settings.htmlDecode);
            
            //console.error("cmValue", cmValue, newMarkdownDoc);
            
            this.markdownTextarea.text(cmValue);
            
            cm.save();
            
            if (settings.saveHTMLToTextarea) 
            {
                this.htmlTextarea.text(newMarkdownDoc);
            }
            
            if(settings.watch || (!settings.watch && state.preview))
            {
                previewContainer.html(newMarkdownDoc);

                this.previewCodeHighlight();
                
                if (settings.toc) 
                {
                    var tocContainer = (settings.tocContainer === "") ? previewContainer : $(settings.tocContainer);
                    var tocMenu      = tocContainer.find("." + this.classPrefix + "toc-menu");
                    
                    tocContainer.attr("previewContainer", (settings.tocContainer === "") ? "true" : "false");
                    
                    if (settings.tocContainer !== "" && tocMenu.length > 0)
                    {
                        tocMenu.remove();
                    }
                    
                    editormd.markdownToCRenderer(markdownToC, tocContainer, settings.tocDropdown, settings.tocStartLevel);
            
                    if (settings.tocDropdown || tocContainer.find("." + this.classPrefix + "toc-menu").length > 0)
                    {
                        editormd.tocDropdownMenu(tocContainer, (settings.tocTitle !== "") ? settings.tocTitle : this.lang.tocTitle);
                    }
            
                    if (settings.tocContainer !== "")
                    {
                        previewContainer.find(".markdown-toc").css("border", "none");
                    }
                }
                
                if (settings.tex)
                {
                    if (!editormd.kaTeXLoaded && settings.autoLoadModules) 
                    {
                        editormd.loadKaTeX(function() {
                            editormd.$katex = katex;
                            editormd.kaTeXLoaded = true;
                            _this.katexRender();
                        });
                    } 
                    else 
                    {
                        editormd.$katex = katex;
                        this.katexRender();
                    }
                }                
                
                if (settings.flowChart || settings.sequenceDiagram)
                {
                    flowchartTimer = setTimeout(function(){
                        clearTimeout(flowchartTimer);
                        _this.flowChartAndSequenceDiagramRender();
                        flowchartTimer = null;
                    }, 10);
                }

                if (state.loaded) 
                {
                    $.proxy(settings.onchange, this)();
                }
            }

            return this;
        },
        
        /**
         * 聚焦光标位置
         * Focusing the cursor position
         * 
         * @returns {editormd}         返回editormd的实例对象
         */
        focus: function() {
            this.cm.focus();

            return this;
        },

        /**
         * Set the position of the cursor
         * Set cursor position
         *
         * @param {Object} cursor The key value object of the cursor position to be set, for example: {line:1, ch:0}
         * @returns {editormd} returns an instance object of editormd
         */

        setCursor: function(cursor) {
            this.cm.setCursor(cursor);

            return this;
        },

        /**
         * Get the current cursor position
         * Get the current position of the cursor
         *
         * @returns {Cursor} returns a cursor Cursor object
         */

        getCursor: function() {
            return this.cm.getCursor();
        },

        /**
         * Set the range selected by the cursor
         * Set cursor selected ranges
         *
         * @param {Object} The cursor key value object at the starting position of from, for example: {line:1, ch:0}
         * @param {Object} to the cursor key value object at the end position, for example: {line:1, ch:0}
         * @returns {editormd} returns an instance object of editormd
         */

        setSelection: function(from, to) {

            this.cm.setSelection(from, to);

            return this;
        },

        /**
         * Get the text selected by the cursor
         * Get the texts from cursor selected
         *
         * @returns {String} returns the string form of the selected text
         */

        getSelection: function() {
            return this.cm.getSelection();
        },

        /**
         * Set the text range selected by the cursor
         * Set the cursor selection ranges
         *
         * @param {Array} ranges cursor selection ranges array
         * @returns {Array} return this
         */

        setSelections: function(ranges) {
            this.cm.setSelections(ranges);

            return this;
        },

        /**
         * Get the text range selected by the cursor
         * Get the cursor selection ranges
         *
         * @returns {Array} return selection ranges array
         */

        getSelections: function() {
            return this.cm.getSelections();
        },

        /**
         * Replace the text selected by the current cursor or insert a new character at the current cursor
         * Replace the text at the current cursor selected or insert a new character at the current cursor position
         *
         * @param {String} value The character value to be inserted
         * @returns {editormd} returns an instance object of editormd
         */

        replaceSelection: function(value) {
            this.cm.replaceSelection(value);

            return this;
        },

        /**
         * Insert a new character at the current cursor
         * Insert a new character at the current cursor position
         *
         * Same as replaceSelection() method
         * With the replaceSelection() method
         *
         * @param {String} value The character value to be inserted
         * @returns {editormd} returns an instance object of editormd
         */

        insertValue: function(value) {
            this.replaceSelection(value);

            return this;
        },

        /**
         * Add markdown
         * append Markdown to editor
         *
         * @param {String} md markdown source document to be appended
         * @returns {editormd} returns an instance object of editormd
         */

        appendMarkdown: function(md) {
            var settings = this.settings;
            var cm = this.cm;

            cm.setValue(cm.getValue() + md);

            return this;
        },

        /**
         * Set and import the markdown source document of the editor
         * Set Markdown source document
         *
         * @param {String} md the markdown source document to be passed in
         * @returns {editormd} returns an instance object of editormd
         */

        setMarkdown: function(md) {
            this.cm.setValue(md || this.settings.markdown);

            return this;
        },

        /**
         * Get the markdown source document of the editor
         * Set Editor.md markdown/CodeMirror value
         *
         * @returns {editormd} returns an instance object of editormd
         */

        getMarkdown: function() {
            return this.cm.getValue();
        },

        /**
         * Get the source document of the editor
         * Get CodeMirror value
         *
         * @returns {editormd} returns an instance object of editormd
         */

        getValue: function() {
            return this.cm.getValue();
        },

        /**
         * Set the source document of the editor
         * Set CodeMirror value
         *
         * @param {String} value set code/value/string/text
         * @returns {editormd} returns an instance object of editormd
         */

        setValue: function(value) {
            this.cm.setValue(value);

            return this;
        },

        /**
         * Clear the editor
         * Empty CodeMirror editor container
         *
         * @returns {editormd} returns an instance object of editormd
         */

        clear : function() {
            this.cm.setValue("");
            
            return this;
        },

        /**
         * Get the HTML source code stored in Textarea after parsing
         * Get parsed html code from Textarea
         *
         * @returns {String} returns HTML source code
         */

        getHTML: function() {
            if (!this.settings.saveHTMLToTextarea)
            {
                alert("Error: settings.saveHTMLToTextarea == false");

                return false;
            }

            return this.htmlTextarea.val();
        },

        /**
         * Alias ​​of getHTML()
         * getHTML (alias)
         *
         * @returns {String} Return html code Return HTML source code
         */

        getTextareaSavedHTML: function() {
            return this.getHTML();
        },

        /**
         * Get the HTML source code of the preview window
         * Get html from preview container
         *
         * @returns {editormd} returns an instance object of editormd
         */

        getPreviewedHTML: function() {
            if (!this.settings.watch)
            {
                alert("Error: settings.watch == false");

                return false;
            }

            return this.previewContainer.html();
        },

        /**
         * Turn on real-time preview
         * Enable real-time watching
         *
         * @returns {editormd} returns an instance object of editormd
         */

        watch: function(callback) {
            var settings = this.settings;

            if ($.inArray(settings.mode, ["gfm", "markdown"]) <0)
            {
                return this;
            }

            this.state.watching = settings.watch = true;
            this.preview.show();

            if (this.toolbar)
            {
                var watchIcon = settings.toolbarIconsClass.watch;
                var unWatchIcon = settings.toolbarIconsClass.unwatch;

                var icon = this.toolbar.find(".fa[name=watch]");
                icon.parent().attr("title", settings.lang.toolbar.watch);
                icon.removeClass(unWatchIcon).addClass(watchIcon);
            }

            this.codeMirror.css("border-right", "1px solid #ddd").width(this.editor.width() / 2);

            timer = 0;

            this.save().resize();

            if (!settings.onwatch)
            {
                settings.onwatch = callback || function() {};
            }

            $.proxy(settings.onwatch, this)();

            return this;
        },

        /**
         * Turn off live preview
         * Disable real-time watching
         *
         * @returns {editormd} returns an instance object of editormd
         */

        unwatch : function(callback) {
            var settings        = this.settings;
            this.state.watching = settings.watch = false;
            this.preview.hide();
            
            if (this.toolbar) 
            {
                var watchIcon   = settings.toolbarIconsClass.watch;
                var unWatchIcon = settings.toolbarIconsClass.unwatch;
                
                var icon    = this.toolbar.find(".fa[name=watch]");
                icon.parent().attr("title", settings.lang.toolbar.unwatch);
                icon.removeClass(watchIcon).addClass(unWatchIcon);
            }
            
            this.codeMirror.css("border-right", "none").width(this.editor.width());
            
            this.resize();
            
            if (!settings.onunwatch)
            {
                settings.onunwatch = callback || function() {};
            }
            
            $.proxy(settings.onunwatch, this)();
            
            return this;
        },

        /**
         * Show editor
         * Show editor
         *
         * @param {Function} [callback=function()] callback function
         * @returns {editormd} returns an instance object of editormd
         */

        show: function(callback) {
            callback = callback || function() {};

            var _this = this;
            this.editor.show(0, function() {
                $.proxy(callback, _this)();
            });

            return this;
        },

        /**
         * Hide editor
         * Hide editor
         *
         * @param {Function} [callback=function()] callback function
         * @returns {editormd} returns an instance object of editormd
         */

        hide: function(callback) {
            callback = callback || function() {};

            var _this = this;
            this.editor.hide(0, function() {
                $.proxy(callback, _this)();
            });

            return this;
        },

        /**
         * Hide the editor part, only preview HTML
         * Enter preview html state
         *
         * @returns {editormd} returns an instance object of editormd
         */

        previewing: function() {

            var _this = this;
            var editor = this.editor;
            var preview = this.preview;
            var toolbar = this.toolbar;
            var settings = this.settings;
            var codeMirror = this.codeMirror;
            var previewContainer = this.previewContainer;

            if ($.inArray(settings.mode, ["gfm", "markdown"]) <0) {
                return this;
            }

            if (settings.toolbar && toolbar) {
                toolbar.toggle();
                toolbar.find(".fa[name=preview]").toggleClass("active");
            }

            codeMirror.toggle();

            var escHandle = function(event) {
                if (event.shiftKey && event.keyCode === 27) {
                    _this.previewed();
                }
            };

            if (codeMirror.css("display") === "none") // To be compatible with Zepto, do not use codeMirror.is(":hidden")
            {
                this.state.preview = true;

                if (this.state.fullscreen) {
                    preview.css("background", "#fff");
                }

                editor.find("." + this.classPrefix + "preview-close-btn").show().bind(editormd.mouseOrTouch("click", "touchend"), function(){
                    _this.previewed();
                });

                if (!settings.watch)
                {
                    this.save();
                }
                else
                {
                    previewContainer.css("padding", "");
                }

                previewContainer.addClass(this.classPrefix + "preview-active");

                preview.show().css({
                    position: "",
                    top: 0,
                    width: editor.width(),
                    height: (settings.autoHeight && !this.state.fullscreen)? "auto": editor.height()
                });

                if (this.state.loaded)
                {
                    $.proxy(settings.onpreviewing, this)();
                }

                $(window).bind("keyup", escHandle);
            }
            else
            {
                $(window).unbind("keyup", escHandle);
                this.previewed();
            }
        },

        /**
         * Show editor part, exit only preview HTML
         * Exit preview html state
         *
         * @returns {editormd} returns an instance object of editormd
         */

        previewed : function() {
            
            var editor           = this.editor;
            var preview          = this.preview;
            var toolbar          = this.toolbar;
            var settings         = this.settings;
            var previewContainer = this.previewContainer;
            var previewCloseBtn  = editor.find("." + this.classPrefix + "preview-close-btn");

            this.state.preview   = false;
            
            this.codeMirror.show();
            
            if (settings.toolbar) {
                toolbar.show();
            }
            
            preview[(settings.watch) ? "show" : "hide"]();
            
            previewCloseBtn.hide().unbind(editormd.mouseOrTouch("click", "touchend"));
                
            previewContainer.removeClass(this.classPrefix + "preview-active");
                
            if (settings.watch)
            {
                previewContainer.css("padding", "20px");
            }
            
            preview.css({ 
                background : null,
                position   : "absolute",
                width      : editor.width() / 2,
                height     : (settings.autoHeight && !this.state.fullscreen) ? "auto" : editor.height() - toolbar.height(),
                top        : (settings.toolbar)    ? toolbar.height() : 0
            });

            if (this.state.loaded)
            {
                $.proxy(settings.onpreviewed, this)();
            }
            
            return this;
        },

        /**
         * Editor full screen display
         * Fullscreen show
         *
         * @returns {editormd} returns an instance object of editormd
         */

        fullscreen: function() {

            var _this = this;
            var state = this.state;
            var editor = this.editor;
            var preview = this.preview;
            var toolbar = this.toolbar;
            var settings = this.settings;
            var fullscreenClass = this.classPrefix + "fullscreen";

            if (toolbar) {
                toolbar.find(".fa[name=fullscreen]").parent().toggleClass("active");
            }

            var escHandle = function(event) {
                if (!event.shiftKey && event.keyCode === 27)
                {
                    if (state.fullscreen)
                    {
                        _this.fullscreenExit();
                    }
                }
            };

            if (!editor.hasClass(fullscreenClass))
            {
                state.fullscreen = true;

                $("html,body").css("overflow", "hidden");

                editor.css({
                    width: $(window).width(),
                    height: $(window).height()
                }).addClass(fullscreenClass);

                this.resize();

                $.proxy(settings.onfullscreen, this)();

                $(window).bind("keyup", escHandle);
            }
            else
            {
                $(window).unbind("keyup", escHandle);
                this.fullscreenExit();
            }

            return this;
        },

        /**
         * The editor exits the full screen display
         * Exit fullscreen state
         *
         * @returns {editormd} returns an instance object of editormd
         */

        fullscreenExit: function() {

            var editor = this.editor;
            var settings = this.settings;
            var toolbar = this.toolbar;
            var fullscreenClass = this.classPrefix + "fullscreen";

            this.state.fullscreen = false;

            if (toolbar) {
                toolbar.find(".fa[name=fullscreen]").parent().removeClass("active");
            }

            $("html,body").css("overflow", "");

            editor.css({
                width: editor.data("oldWidth"),
                height: editor.data("oldHeight")
            }).removeClass(fullscreenClass);

            this.resize();

            $.proxy(settings.onfullscreenExit, this)();

            return this;
        },

        /**
         * Load and execute the plugin
         * Load and execute the plugin
         *
         * @param {String} name plugin name / function name
         * @param {String} path plugin load path
         * @returns {editormd} returns an instance object of editormd
         */

        executePlugin : function(name, path) {
            
            var _this    = this;
            var cm       = this.cm;
            var settings = this.settings;
            
            path = settings.pluginPath + path;
            
            if (typeof define === "function") 
            {            
                if (typeof this[name] === "undefined")
                {
                    alert("Error: " + name + " plugin is not found, you are not load this plugin.");
                    
                    return this;
                }
                
                this[name](cm);
                
                return this;
            }
            
            if ($.inArray(path, editormd.loadFiles.plugin) < 0)
            {
                editormd.loadPlugin(path, function() {
                    editormd.loadPlugins[name] = _this[name];
                    _this[name](cm);
                });
            }
            else
            {
                $.proxy(editormd.loadPlugins[name], this)(cm);
            }
            
            return this;
        },

        /**
         * Search and replace
         * Search & replace
         *
         * @param {String} command CodeMirror serach commands, "find, fintNext, fintPrev, clearSearch, replace, replaceAll"
         * @returns {editormd} return this
         */

        search : function(command) {
            var settings = this.settings;
            
            if (!settings.searchReplace)
            {
                alert("Error: settings.searchReplace == false");
                return this;
            }
            
            if (!settings.readOnly)
            {
                this.cm.execCommand(command || "find");
            }
            
            return this;
        },
        
        searchReplace : function() {            
            this.search("replace");
            
            return this;
        },
        
        searchReplaceAll : function() {          
            this.search("replaceAll");
            
            return this;
        }
    };
    
    editormd.fn.init.prototype = editormd.fn;

    /**
     * Lock screen
     * lock screen when dialog opening
     *
     * @returns {void}
     */

    editormd.dialogLockScreen = function() {
        var settings = this.settings || {dialogLockScreen: true};

        if (settings.dialogLockScreen)
        {
            $("html,body").css("overflow", "hidden");
            this.resize();
        }
    };

    /**
     * Show transparent background layer
     * Display mask layer when dialog opening
     *
     * @param {Object} dialog dialog jQuery object
     * @returns {void}
     */

    editormd.dialogShowMask = function(dialog) {
        var editor = this.editor;
        var settings = this.settings || {dialogShowMask: true};

        dialog.css({
            top: ($(window).height()-dialog.height()) / 2 + "px",
            left: ($(window).width()-dialog.width()) / 2 + "px"
        });

        if (settings.dialogShowMask) {
            editor.children("." + this.classPrefix + "mask").css("z-index", parseInt(dialog.css("z-index"))-1).show();
        }
    };

    editormd.toolbarHandlers = {
        undo : function() {
            this.cm.undo();
        },
        
        redo : function() {
            this.cm.redo();
        },
        
        bold : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection("**" + selection + "**");

            if(selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 2);
            }
        },
        
        del : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection("~~" + selection + "~~");

            if(selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 2);
            }
        },

        italic : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection("*" + selection + "*");

            if(selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },

        quote : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("> " + selection);
                cm.setCursor(cursor.line, cursor.ch + 2);
            }
            else
            {
                cm.replaceSelection("> " + selection);
            }

            //cm.replaceSelection("> " + selection);
            //cm.setCursor(cursor.line, (selection === "") ? cursor.ch + 2 : cursor.ch + selection.length + 2);
        },
        
        ucfirst : function() {
            var cm         = this.cm;
            var selection  = cm.getSelection();
            var selections = cm.listSelections();

            cm.replaceSelection(editormd.firstUpperCase(selection));
            cm.setSelections(selections);
        },
        
        ucwords : function() {
            var cm         = this.cm;
            var selection  = cm.getSelection();
            var selections = cm.listSelections();

            cm.replaceSelection(editormd.wordsFirstUpperCase(selection));
            cm.setSelections(selections);
        },
        
        uppercase : function() {
            var cm         = this.cm;
            var selection  = cm.getSelection();
            var selections = cm.listSelections();

            cm.replaceSelection(selection.toUpperCase());
            cm.setSelections(selections);
        },
        
        lowercase : function() {
            var cm         = this.cm;
            var cursor     = cm.getCursor();
            var selection  = cm.getSelection();
            var selections = cm.listSelections();
            
            cm.replaceSelection(selection.toLowerCase());
            cm.setSelections(selections);
        },

        h1 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("# " + selection);
                cm.setCursor(cursor.line, cursor.ch + 2);
            }
            else
            {
                cm.replaceSelection("# " + selection);
            }
        },

        h2 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("## " + selection);
                cm.setCursor(cursor.line, cursor.ch + 3);
            }
            else
            {
                cm.replaceSelection("## " + selection);
            }
        },

        h3 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("### " + selection);
                cm.setCursor(cursor.line, cursor.ch + 4);
            }
            else
            {
                cm.replaceSelection("### " + selection);
            }
        },

        h4 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("#### " + selection);
                cm.setCursor(cursor.line, cursor.ch + 5);
            }
            else
            {
                cm.replaceSelection("#### " + selection);
            }
        },

        h5 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("##### " + selection);
                cm.setCursor(cursor.line, cursor.ch + 6);
            }
            else
            {
                cm.replaceSelection("##### " + selection);
            }
        },

        h6 : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (cursor.ch !== 0)
            {
                cm.setCursor(cursor.line, 0);
                cm.replaceSelection("###### " + selection);
                cm.setCursor(cursor.line, cursor.ch + 7);
            }
            else
            {
                cm.replaceSelection("###### " + selection);
            }
        },

        "list-ul" : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if (selection === "") 
            {
                cm.replaceSelection("- " + selection);
            } 
            else 
            {
                var selectionText = selection.split("\n");

                for (var i = 0, len = selectionText.length; i < len; i++) 
                {
                    selectionText[i] = (selectionText[i] === "") ? "" : "- " + selectionText[i];
                }

                cm.replaceSelection(selectionText.join("\n"));
            }
        },

        "list-ol" : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            if(selection === "") 
            {
                cm.replaceSelection("1. " + selection);
            }
            else
            {
                var selectionText = selection.split("\n");

                for (var i = 0, len = selectionText.length; i < len; i++) 
                {
                    selectionText[i] = (selectionText[i] === "") ? "" : (i+1) + ". " + selectionText[i];
                }

                cm.replaceSelection(selectionText.join("\n"));
            }
        },

        hr : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection(((cursor.ch !== 0) ? "\n\n" : "\n") + "------------\n\n");
        },

        tex : function() {
            if (!this.settings.tex)
            {
                alert("settings.tex === false");
                return this;
            }
            
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection("$$" + selection + "$$");

            if(selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 2);
            }
        },

        link : function() {
            this.executePlugin("linkDialog", "link-dialog/link-dialog");
        },

        "reference-link" : function() {
            this.executePlugin("referenceLinkDialog", "reference-link-dialog/reference-link-dialog");
        },

        pagebreak : function() {
            if (!this.settings.pageBreak)
            {
                alert("settings.pageBreak === false");
                return this;
            }
            
            var cm        = this.cm;
            var selection = cm.getSelection();

            cm.replaceSelection("\r\n[========]\r\n");
        },

        image : function() {
            this.executePlugin("imageDialog", "image-dialog/image-dialog");
        },
        
        code : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();

            cm.replaceSelection("`" + selection + "`");

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },

        "code-block" : function() {
            this.executePlugin("codeBlockDialog", "code-block-dialog/code-block-dialog");            
        },

        "preformatted-text" : function() {
            this.executePlugin("preformattedTextDialog", "preformatted-text-dialog/preformatted-text-dialog");
        },
        
        table : function() {
            this.executePlugin("tableDialog", "table-dialog/table-dialog");         
        },
        
        datetime : function() {
            var cm        = this.cm;
            var selection = cm.getSelection();
            var date      = new Date();
            var langName  = this.settings.lang.name;
            var datefmt   = editormd.dateFormat() + " " + editormd.dateFormat("week-day");

            cm.replaceSelection(datefmt);
        },
        
        emoji : function() {
            this.executePlugin("emojiDialog", "emoji-dialog/emoji-dialog");
        },
                
        "html-entities" : function() {
            this.executePlugin("htmlEntitiesDialog", "html-entities-dialog/html-entities-dialog");
        },
                
        "goto-line" : function() {
            this.executePlugin("gotoLineDialog", "goto-line-dialog/goto-line-dialog");
        },

        watch : function() {    
            this[this.settings.watch ? "unwatch" : "watch"]();
        },

        preview : function() {
            this.previewing();
        },

        fullscreen : function() {
            this.fullscreen();
        },

        clear : function() {
            this.clear();
        },
        
        search : function() {
            this.search();
        },

        help : function() {
            this.executePlugin("helpDialog", "help-dialog/help-dialog");
        },

        info : function() {
            this.showInfoDialog();
        }
    };
    
    editormd.keyMaps = {
        "Ctrl-1"       : "h1",
        "Ctrl-2"       : "h2",
        "Ctrl-3"       : "h3",
        "Ctrl-4"       : "h4",
        "Ctrl-5"       : "h5",
        "Ctrl-6"       : "h6",
        "Ctrl-B"       : "bold",  // if this is string ==  editormd.toolbarHandlers.xxxx
        "Ctrl-D"       : "datetime",
        
        "Ctrl-E"       : function() { // emoji
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();
            
            if (!this.settings.emoji)
            {
                alert("Error: settings.emoji == false");
                return ;
            }

            cm.replaceSelection(":" + selection + ":");

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },
        "Ctrl-Alt-G"   : "goto-line",
        "Ctrl-H"       : "hr",
        "Ctrl-I"       : "italic",
        "Ctrl-K"       : "code",
        
        "Ctrl-L"        : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();
            
            var title = (selection === "") ? "" : " \""+selection+"\"";

            cm.replaceSelection("[" + selection + "]("+title+")");

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },
        "Ctrl-U"         : "list-ul",
        
        "Shift-Ctrl-A"   : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();
            
            if (!this.settings.atLink)
            {
                alert("Error: settings.atLink == false");
                return ;
            }

            cm.replaceSelection("@" + selection);

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 1);
            }
        },
        
        "Shift-Ctrl-C"     : "code",
        "Shift-Ctrl-Q"     : "quote",
        "Shift-Ctrl-S"     : "del",
        "Shift-Ctrl-K"     : "tex",  // KaTeX
        
        "Shift-Alt-C"      : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();
            
            cm.replaceSelection(["```", selection, "```"].join("\n"));

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 3);
            } 
        },
        
        "Shift-Ctrl-Alt-C" : "code-block",
        "Shift-Ctrl-H"     : "html-entities",
        "Shift-Alt-H"      : "help",
        "Shift-Ctrl-E"     : "emoji",
        "Shift-Ctrl-U"     : "uppercase",
        "Shift-Alt-U"      : "ucwords",
        "Shift-Ctrl-Alt-U" : "ucfirst",
        "Shift-Alt-L"      : "lowercase",
        
        "Shift-Ctrl-I"     : function() {
            var cm        = this.cm;
            var cursor    = cm.getCursor();
            var selection = cm.getSelection();
            
            var title = (selection === "") ? "" : " \""+selection+"\"";

            cm.replaceSelection("![" + selection + "]("+title+")");

            if (selection === "") {
                cm.setCursor(cursor.line, cursor.ch + 4);
            }
        },
        
        "Shift-Ctrl-Alt-I" : "image",
        "Shift-Ctrl-L"     : "link",
        "Shift-Ctrl-O"     : "list-ol",
        "Shift-Ctrl-P"     : "preformatted-text",
        "Shift-Ctrl-T"     : "table",
        "Shift-Alt-P"      : "pagebreak",
        "F9"               : "watch",
        "F10"              : "preview",
        "F11"              : "fullscreen",
    };

    /**
     * Clear the spaces on both sides of the string
     * Clear the space of strings both sides.
     *
     * @param {String} str string
     * @returns {String} trimed string
     */

    var trim = function(str) {
        return (!String.prototype.trim)? str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""): str.trim();
    };

    editormd.trim = trim;

    /**
     * Capitalize the first letter of all words
     * Words first to uppercase
     *
     * @param {String} str string
     * @returns {String} string
     */

    var ucwords = function (str) {
        return str.toLowerCase().replace(/\b(\w)|\s(\w)/g, function($1) {
            return $1.toUpperCase();
        });
    };

    editormd.ucwords = editormd.wordsFirstUpperCase = ucwords;

    /**
     * Capitalize the first letter of the string
     * Only string first char to uppercase
     *
     * @param {String} str string
     * @returns {String} string
     */

    var firstUpperCase = function(str) {
        return str.toLowerCase().replace(/\b(\w)/, function($1){
            return $1.toUpperCase();
        });
    };

    var ucfirst = firstUpperCase;

    editormd.firstUpperCase = editormd.ucfirst = firstUpperCase;

    editormd.urls = {
        atLinkBase: "https://github.com/"
    };

    editormd.regexs = {
        atLink: /@(\w+)/g,
        email: /(\w+)@(\w+)\.(\w+)\.?(\w+)?/g,
        emailLink: /(mailto:)?([\w\.\_]+)@(\w+)\.(\w+)\.?(\w+)?/g,
        emoji: /:([\w\+-]+):/g,
        emojiDatetime: /(\d{2}:\d{2}:\d{2})/g,
        twemoji: /:(tw-([\w]+)-?(\w+)?):/g,
        fontAwesome: /:(fa-([\w]+)(-(\w+)){0,}):/g,
        editormdLogo: /:(editormd-logo-?(\w+)?):/g,
        pageBreak: /^\[[=]{8,}\]$/
    };

    // Emoji graphics files url path
    editormd.emoji = {
        path: "http://www.emoji-cheat-sheet.com/graphics/emojis/",
        ext: ".png"
    };

    // Twitter Emoji (Twemoji) graphics files url path
    editormd.twemoji = {
        path: "http://twemoji.maxcdn.com/36x36/",
        ext: ".png"
    };

    /**
     * Custom marked parser
     * Custom Marked renderer rules
     *
     * @param {Array} markdownToC passes in the array used to receive TOC
     * @returns {Renderer} markedRenderer returns the marked Renderer custom object
     */

    editormd.markedRenderer = function(markdownToC, options) {
        var defaults = {
            toc                  : true,           // Table of contents
            tocm                 : false,
            tocStartLevel        : 1,              // Said from H1 to create ToC  
            pageBreak            : true,
            atLink               : true,           // for @link
            emailLink            : true,           // for mail address auto link
            taskList             : false,          // Enable Github Flavored Markdown task lists
            emoji                : false,          // :emoji: , Support Twemoji, fontAwesome, Editor.md logo emojis.
            tex                  : false,          // TeX(LaTeX), based on KaTeX
            flowChart            : false,          // flowChart.js only support IE9+
            sequenceDiagram      : false,          // sequenceDiagram.js only support IE9+
        };
        
        var settings        = $.extend(defaults, options || {});    
        var marked          = editormd.$marked;
        var markedRenderer  = new marked.Renderer();
        markdownToC         = markdownToC || [];        
            
        var regexs          = editormd.regexs;
        var atLinkReg       = regexs.atLink;
        var emojiReg        = regexs.emoji;
        var emailReg        = regexs.email;
        var emailLinkReg    = regexs.emailLink;
        var twemojiReg      = regexs.twemoji;
        var faIconReg       = regexs.fontAwesome;
        var editormdLogoReg = regexs.editormdLogo;
        var pageBreakReg    = regexs.pageBreak;

        markedRenderer.emoji = function(text) {
            
            text = text.replace(editormd.regexs.emojiDatetime, function($1) {           
                return $1.replace(/:/g, "&#58;");
            });
            
            var matchs = text.match(emojiReg);

            if (!matchs || !settings.emoji) {
                return text;
            }

            for (var i = 0, len = matchs.length; i < len; i++)
            {            
                if (matchs[i] === ":+1:") {
                    matchs[i] = ":\\+1:";
                }

                text = text.replace(new RegExp(matchs[i]), function($1, $2){
                    var faMatchs = $1.match(faIconReg);
                    var name     = $1.replace(/:/g, "");

                    if (faMatchs)
                    {                        
                        for (var fa = 0, len1 = faMatchs.length; fa < len1; fa++)
                        {
                            var faName = faMatchs[fa].replace(/:/g, "");
                            
                            return "<i class=\"fa " + faName + " fa-emoji\" title=\"" + faName.replace("fa-", "") + "\"></i>";
                        }
                    }
                    else
                    {
                        var emdlogoMathcs = $1.match(editormdLogoReg);
                        var twemojiMatchs = $1.match(twemojiReg);

                        if (emdlogoMathcs)                                        
                        {                            
                            for (var x = 0, len2 = emdlogoMathcs.length; x < len2; x++)
                            {
                                var logoName = emdlogoMathcs[x].replace(/:/g, "");
                                return "<i class=\"" + logoName + "\" title=\"Editor.md logo (" + logoName + ")\"></i>";
                            }
                        }
                        else if (twemojiMatchs) 
                        {
                            for (var t = 0, len3 = twemojiMatchs.length; t < len3; t++)
                            {
                                var twe = twemojiMatchs[t].replace(/:/g, "").replace("tw-", "");
                                return "<img src=\"" + editormd.twemoji.path + twe + editormd.twemoji.ext + "\" title=\"twemoji-" + twe + "\" alt=\"twemoji-" + twe + "\" class=\"emoji twemoji\" />";
                            }
                        }
                        else
                        {
                            var src = (name === "+1") ? "plus1" : name;
                            src     = (src === "black_large_square") ? "black_square" : src;
                            src     = (src === "moon") ? "waxing_gibbous_moon" : src;

                            return "<img src=\"" + editormd.emoji.path + src + editormd.emoji.ext + "\" class=\"emoji\" title=\"&#58;" + name + "&#58;\" alt=\"&#58;" + name + "&#58;\" />";
                        }
                    }
                });
            }

            return text;
        };

        markedRenderer.atLink = function(text) {

            if (atLinkReg.test(text))
            { 
                if (settings.atLink) 
                {
                    text = text.replace(emailReg, function($1, $2, $3, $4) {
                        return $1.replace(/@/g, "_#_&#64;_#_");
                    });

                    text = text.replace(atLinkReg, function($1, $2) {
                        return "<a href=\"" + editormd.urls.atLinkBase + "" + $2 + "\" title=\"&#64;" + $2 + "\" class=\"at-link\">" + $1 + "</a>";
                    }).replace(/_#_&#64;_#_/g, "@");
                }
                
                if (settings.emailLink)
                {
                    text = text.replace(emailLinkReg, function($1, $2, $3, $4, $5) {
                        return (!$2 && $.inArray($5, "jpg|jpeg|png|gif|webp|ico|icon|pdf".split("|")) < 0) ? "<a href=\"mailto:" + $1 + "\">"+$1+"</a>" : $1;
                    });
                }

                return text;
            }

            return text;
        };
                
        markedRenderer.link = function (href, title, text) {

            if (this.options.sanitize) {
                try {
                    var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase();
                } catch(e) {
                    return "";
                }

                if (prot.indexOf("javascript:") === 0) {
                    return "";
                }
            }

            var out = "<a href=\"" + href + "\"";
            
            if (atLinkReg.test(title) || atLinkReg.test(text))
            {
                if (title)
                {
                    out += " title=\"" + title.replace(/@/g, "&#64;");
                }
                
                return out + "\">" + text.replace(/@/g, "&#64;") + "</a>";
            }

            if (title) {
                out += " title=\"" + title + "\"";
            }

            out += ">" + text + "</a>";

            return out;
        };
        
        markedRenderer.heading = function(text, level, raw) {
                    
            var linkText       = text;
            var hasLinkReg     = /\s*\<a\s*href\=\"(.*)\"\s*([^\>]*)\>(.*)\<\/a\>\s*/;
            var getLinkTextReg = /\s*\<a\s*([^\>]+)\>([^\>]*)\<\/a\>\s*/g;

            if (hasLinkReg.test(text)) 
            {
                var tempText = [];
                text         = text.split(/\<a\s*([^\>]+)\>([^\>]*)\<\/a\>/);

                for (var i = 0, len = text.length; i < len; i++)
                {
                    tempText.push(text[i].replace(/\s*href\=\"(.*)\"\s*/g, ""));
                }

                text = tempText.join(" ");
            }
            
            text = trim(text);
            
            var escapedText    = text.toLowerCase().replace(/[^\w]+/g, "-");
            var toc = {
                text  : text,
                level : level,
                slug  : escapedText
            };
            
            var isChinese = /^[\u4e00-\u9fa5]+$/.test(text);
            var id        = (isChinese) ? escape(text).replace(/\%/g, "") : text.toLowerCase().replace(/[^\w]+/g, "-");

            markdownToC.push(toc);
            
            var headingHTML = "<h" + level + " id=\"h"+ level + "-" + this.options.headerPrefix + id +"\">";
            
            headingHTML    += "<a name=\"" + text + "\" class=\"reference-link\"></a>";
            headingHTML    += "<span class=\"header-link octicon octicon-link\"></span>";
            headingHTML    += (hasLinkReg) ? this.atLink(this.emoji(linkText)) : this.atLink(this.emoji(text));
            headingHTML    += "</h" + level + ">";

            return headingHTML;
        };
        
        markedRenderer.pageBreak = function(text) {
            if (pageBreakReg.test(text) && settings.pageBreak)
            {
                text = "<hr style=\"page-break-after:always;\" class=\"page-break editormd-page-break\" />";
            }
            
            return text;
        };

        markedRenderer.paragraph = function(text) {
            var isTeXInline     = /\$\$(.*)\$\$/g.test(text);
            var isTeXLine       = /^\$\$(.*)\$\$$/.test(text);
            var isTeXAddClass   = (isTeXLine)     ? " class=\"" + editormd.classNames.tex + "\"" : "";
            var isToC           = (settings.tocm) ? /^(\[TOC\]|\[TOCM\])$/.test(text) : /^\[TOC\]$/.test(text);
            var isToCMenu       = /^\[TOCM\]$/.test(text);
            
            if (!isTeXLine && isTeXInline) 
            {
                text = text.replace(/(\$\$([^\$]*)\$\$)+/g, function($1, $2) {
                    return "<span class=\"" + editormd.classNames.tex + "\">" + $2.replace(/\$/g, "") + "</span>";
                });
            } 
            else 
            {
                text = (isTeXLine) ? text.replace(/\$/g, "") : text;
            }
            
            var tocHTML = "<div class=\"markdown-toc editormd-markdown-toc\">" + text + "</div>";
            
            return (isToC) ? ( (isToCMenu) ? "<div class=\"editormd-toc-menu\">" + tocHTML + "</div><br/>" : tocHTML )
                           : ( (pageBreakReg.test(text)) ? this.pageBreak(text) : "<p" + isTeXAddClass + ">" + this.atLink(this.emoji(text)) + "</p>\n" );
        };

        markedRenderer.code = function (code, lang, escaped) { 

            if (lang === "seq" || lang === "sequence")
            {
                return "<div class=\"sequence-diagram\">" + code + "</div>";
            } 
            else if ( lang === "flow")
            {
                return "<div class=\"flowchart\">" + code + "</div>";
            } 
            else if ( lang === "math" || lang === "latex" || lang === "katex")
            {
                return "<p class=\"" + editormd.classNames.tex + "\">" + code + "</p>";
            } 
            else 
            {

                return marked.Renderer.prototype.code.apply(this, arguments);
            }
        };

        markedRenderer.tablecell = function(content, flags) {
            var type = (flags.header) ? "th" : "td";
            var tag  = (flags.align)  ? "<" + type +" style=\"text-align:" + flags.align + "\">" : "<" + type + ">";
            
            return tag + this.atLink(this.emoji(content)) + "</" + type + ">\n";
        };

        markedRenderer.listitem = function(text) {
            if (settings.taskList && /^\s*\[[x\s]\]\s*/.test(text)) 
            {
                text = text.replace(/^\s*\[\s\]\s*/, "<input type=\"checkbox\" class=\"task-list-item-checkbox\" /> ")
                           .replace(/^\s*\[x\]\s*/,  "<input type=\"checkbox\" class=\"task-list-item-checkbox\" checked disabled /> ");

                return "<li style=\"list-style: none;\">" + this.atLink(this.emoji(text)) + "</li>";
            }
            else 
            {
                return "<li>" + this.atLink(this.emoji(text)) + "</li>";
            }
        };
        
        return markedRenderer;
    };

    /**
     *
     * Generate TOC (Table of Contents)
     * Creating ToC (Table of Contents)
     *
     * @param {Array} toc TOC array list obtained from marked
     * @param {Element} container Insert the container element of the TOC
     * @param {Integer} startLevel Hx start level
     * @returns {Object} tocContainer returns the jQuery object element of the container layer of the ToC list
     */

    editormd.markdownToCRenderer = function(toc, container, tocDropdown, startLevel) {
        
        var html        = "";    
        var lastLevel   = 0;
        var classPrefix = this.classPrefix;
        
        startLevel      = startLevel  || 1;
        
        for (var i = 0, len = toc.length; i < len; i++) 
        {
            var text  = toc[i].text;
            var level = toc[i].level;
            
            if (level < startLevel) {
                continue;
            }
            
            if (level > lastLevel) 
            {
                html += "";
            }
            else if (level < lastLevel) 
            {
                html += (new Array(lastLevel - level + 2)).join("</ul></li>");
            } 
            else 
            {
                html += "</ul></li>";
            }

            html += "<li><a class=\"toc-level-" + level + "\" href=\"#" + text + "\" level=\"" + level + "\">" + text + "</a><ul>";
            lastLevel = level;
        }
        
        var tocContainer = container.find(".markdown-toc");
        
        if ((tocContainer.length < 1 && container.attr("previewContainer") === "false"))
        {
            var tocHTML = "<div class=\"markdown-toc " + classPrefix + "markdown-toc\"></div>";
            
            tocHTML = (tocDropdown) ? "<div class=\"" + classPrefix + "toc-menu\">" + tocHTML + "</div>" : tocHTML;
            
            container.html(tocHTML);
            
            tocContainer = container.find(".markdown-toc");
        }
        
        if (tocDropdown)
        {
            tocContainer.wrap("<div class=\"" + classPrefix + "toc-menu\"></div><br/>");
        }
        
        tocContainer.html("<ul class=\"markdown-toc-list\"></ul>").children(".markdown-toc-list").html(html.replace(/\r?\n?\<ul\>\<\/ul\>/g, ""));
        
        return tocContainer;
    };

    /**
     *
     * Generate TOC drop-down menu
     * Creating ToC dropdown menu
     *
     * @param {Object} container The container jQuery object element that inserts the TOC
     * @param {String} tocTitle ToC title
     * @returns {Object} return toc-menu object
     */

    editormd.tocDropdownMenu = function(container, tocTitle) {

        tocTitle = tocTitle || "Table of Contents";

        var zindex = 400;
        var tocMenus = container.find("." + this.classPrefix + "toc-menu");

        tocMenus.each(function() {
            var $this = $(this);
            var toc = $this.children(".markdown-toc");
            var icon = "<i class=\"fa fa-angle-down\"></i>";
            var btn = "<a href=\"javascript:;\" class=\"toc-menu-btn\">" + icon + tocTitle + "</a>";
            var menu = toc.children("ul");
            var list = menu.find("li");

            toc.append(btn);

            list.first().before("<li><h1>" + tocTitle + "" + icon + "</h1></li>");

            $this.mouseover(function(){
                menu.show();

                list.each(function(){
                    var li = $(this);
                    var ul = li.children("ul");

                    if (ul.html() === "")
                    {
                        ul.remove();
                    }

                    if (ul.length> 0 && ul.html() !== "")
                    {
                        var firstA = li.children("a").first();

                        if (firstA.children(".fa").length <1)
                        {
                            firstA.append( $(icon).css({ float:"right", paddingTop:"4px" }) );
                        }
                    }

                    li.mouseover(function(){
                        ul.css("z-index", zindex).show();
                        zindex += 1;
                    }).mouseleave(function(){
                        ul.hide();
                    });
                });
            }).mouseleave(function(){
                menu.hide();
            });
        });

        return tocMenus;
    };

    /**
     * Simply filter the specified HTML tags
     * Filter custom html tags
     *
     * @param {String} html to filter HTML
     * @param {String} filters The tag to be filtered
     * @returns {String} html return filtered HTML
     */

    editormd.filterHTMLTags = function(html, filters) {
        
        if (typeof html !== "string") {
            html = new String(html);
        }
            
        if (typeof filters !== "string") {
            return html;
        }

        var expression = filters.split("|");
        var filterTags = expression[0].split(",");
        var attrs      = expression[1];

        for (var i = 0, len = filterTags.length; i < len; i++)
        {
            var tag = filterTags[i];

            html = html.replace(new RegExp("\<\s*" + tag + "\s*([^\>]*)\>([^\>]*)\<\s*\/" + tag + "\s*\>", "igm"), "");
        }
        
        //return html;

        if (typeof attrs !== "undefined")
        {
            var htmlTagRegex = /\<(\w+)\s*([^\>]*)\>([^\>]*)\<\/(\w+)\>/ig;

            if (attrs === "*")
            {
                html = html.replace(htmlTagRegex, function($1, $2, $3, $4, $5) {
                    return "<" + $2 + ">" + $4 + "</" + $5 + ">";
                });         
            }
            else if (attrs === "on*")
            {
                html = html.replace(htmlTagRegex, function($1, $2, $3, $4, $5) {
                    var el = $("<" + $2 + ">" + $4 + "</" + $5 + ">");
                    var _attrs = $($1)[0].attributes;
                    var $attrs = {};
                    
                    $.each(_attrs, function(i, e) {
                        if (e.nodeName !== '"') $attrs[e.nodeName] = e.nodeValue;
                    });
                    
                    $.each($attrs, function(i) {                        
                        if (i.indexOf("on") === 0) {
                            delete $attrs[i];
                        }
                    });
                    
                    el.attr($attrs);
                    
                    var text = (typeof el[1] !== "undefined") ? $(el[1]).text() : "";

                    return el[0].outerHTML + text;
                });
            }
            else
            {
                html = html.replace(htmlTagRegex, function($1, $2, $3, $4) {
                    var filterAttrs = attrs.split(",");
                    var el = $($1);
                    el.html($4);

                    $.each(filterAttrs, function(i) {
                        el.attr(filterAttrs[i], null);
                    });

                    return el[0].outerHTML;
                });
            }
        }
        
        return html;
    };

    /**
     * Parse Markdown documents into HTML for front-end display
     * Parse Markdown to HTML for Font-end preview.
     *
     * @param {String} id The object ID used to display HTML
     * @param {Object} [options={}] configuration options, optional
     * @returns {Object} div returns the jQuery object element
     */

    editormd.markdownToHTML = function(id, options) {
        var defaults = {
            gfm: true,
            toc: true,
            tocm: false,
            tocStartLevel: 1,
            tocTitle: "Catalogue",
            tocDropdown: false,
            tocContainer: "",
            markdown: "",
            markdownSourceCode: false,
            htmlDecode: false,
            autoLoadKaTeX: true,
            pageBreak: true,
            atLink: true, // for @link
            emailLink: true, // for mail address auto link
            tex: false,
            taskList: false, // Github Flavored Markdown task lists
            emoji: false,
            flowChart: false,
            sequenceDiagram: false,
            previewCodeHighlight: true
        };

        editormd.$marked = marked;

        var div = $("#" + id);
        var settings = div.settings = $.extend(true, defaults, options || {});
        var saveTo = div.find("textarea");

        if (saveTo.length <1)
        {
            div.append("<textarea></textarea>");
            saveTo = div.find("textarea");
        }

        var markdownDoc = (settings.markdown === "")? saveTo.val(): settings.markdown;
        var markdownToC = [];

        var rendererOptions = {
            toc: settings.toc,
            tocm: settings.tocm,
            tocStartLevel: settings.tocStartLevel,
            taskList: settings.taskList,
            emoji: settings.emoji,
            tex: settings.tex,
            pageBreak: settings.pageBreak,
            atLink: settings.atLink, // for @link
            emailLink: settings.emailLink, // for mail address auto link
            flowChart: settings.flowChart,
            sequenceDiagram: settings.sequenceDiagram,
            previewCodeHighlight: settings.previewCodeHighlight,
        };

        var markedOptions = {
            renderer: editormd.markedRenderer(markdownToC, rendererOptions),
            gfm: settings.gfm,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: (settings.htmlDecode)? false: true, // Whether to ignore HTML tags, that is, whether to enable HTML tag parsing, for security, it is not enabled by default
            smartLists: true,
            smartypants: true
        };

		markdownDoc = new String(markdownDoc);
        
        var markdownParsed = marked(markdownDoc, markedOptions);
        
        markdownParsed = editormd.filterHTMLTags(markdownParsed, settings.htmlDecode);
        
        if (settings.markdownSourceCode) {
            saveTo.text(markdownDoc);
        } else {
            saveTo.remove();
        }
        
        div.addClass("markdown-body " + this.classPrefix + "html-preview").append(markdownParsed);
        
        var tocContainer = (settings.tocContainer !== "") ? $(settings.tocContainer) : div;
        
        if (settings.tocContainer !== "")
        {
            tocContainer.attr("previewContainer", false);
        }
         
        if (settings.toc) 
        {
            div.tocContainer = this.markdownToCRenderer(markdownToC, tocContainer, settings.tocDropdown, settings.tocStartLevel);
            
            if (settings.tocDropdown || div.find("." + this.classPrefix + "toc-menu").length > 0)
            {
                this.tocDropdownMenu(div, settings.tocTitle);
            }
            
            if (settings.tocContainer !== "")
            {
                div.find(".editormd-toc-menu, .editormd-markdown-toc").remove();
            }
        }
            
        if (settings.previewCodeHighlight) 
        {
            div.find("pre").addClass("prettyprint linenums");
            prettyPrint();
        }
        
        if (!editormd.isIE8) 
        {
            if (settings.flowChart) {
                div.find(".flowchart").flowChart(); 
            }

            if (settings.sequenceDiagram) {
                div.find(".sequence-diagram").sequenceDiagram({theme: "simple"});
            }
        }

        if (settings.tex)
        {
            var katexHandle = function() {
                div.find("." + editormd.classNames.tex).each(function(){
                    var tex  = $(this);                    
                    katex.render(tex.html().replace(/&lt;/g, "<").replace(/&gt;/g, ">"), tex[0]);                    
                    tex.find(".katex").css("font-size", "1.6em");
                });
            };
            
            if (settings.autoLoadKaTeX && !editormd.$katex && !editormd.kaTeXLoaded)
            {
                this.loadKaTeX(function() {
                    editormd.$katex      = katex;
                    editormd.kaTeXLoaded = true;
                    katexHandle();
                });
            }
            else
            {
                katexHandle();
            }
        }
        
        div.getMarkdown = function() {            
            return saveTo.val();
        };
        
        return div;
    };

// Editor.md themes, change toolbar themes etc.
    // added @1.5.0
    editormd.themes = ["default", "dark"];

    // Preview area themes
    // added @1.5.0
    editormd.previewThemes = ["default", "dark"];

    // CodeMirror / editor area themes
    // @1.5.0 rename -> editorThemes, old version -> themes
    editormd.editorThemes = [
        "default", "3024-day", "3024-night",
        "ambiance", "ambiance-mobile",
        "base16-dark", "base16-light", "blackboard",
        "cobalt",
        "eclipse", "elegant", "erlang-dark",
        "lesser-dark",
        "mbo", "mdn-like", "midnight", "monokai",
        "neat", "neo", "night",
        "paraiso-dark", "paraiso-light", "pastel-on-dark",
        "rubyblue",
        "solarized",
        "the-matrix", "tomorrow-night-eighties", "twilight",
        "vibrant-ink",
        "xq-dark", "xq-light"
    ];

    editormd.loadPlugins = {};

    editormd.loadFiles = {
        js: [],
        css: [],
        plugin: []
    };

    /**
     * The Editor.md plug-in is dynamically loaded, but not executed immediately
     * Load editor.md plugins
     *
     * @param {String} fileName plug-in file path
     * @param {Function} [callback=function()] The callback function executed after loading successfully
     * @param {String} [into="head"] where to embed the page
     */

    editormd.loadPlugin = function(fileName, callback, into) {
        callback = callback || function() {};

        this.loadScript(fileName, function() {
            editormd.loadFiles.plugin.push(fileName);
            callback();
        }, into);
    };

    /**
     * Method of dynamically loading CSS files
     * Load css file method
     *
     * @param {String} fileName CSS file name
     * @param {Function} [callback=function()] The callback function executed after loading successfully
     * @param {String} [into="head"] where to embed the page
     */

    editormd.loadCSS = function(fileName, callback, into) {
        into = into || "head";
        callback = callback || function() {};

        var css = document.createElement("link");
        css.type = "text/css";
        css.rel = "stylesheet";
        css.onload = css.onreadystatechange = function() {
            editormd.loadFiles.css.push(fileName);
            callback();
        };

        css.href = fileName + ".css";

        if(into === "head") {
            document.getElementsByTagName("head")[0].appendChild(css);
        } else {
            document.body.appendChild(css);
        }
    };

    editormd.isIE    = (navigator.appName == "Microsoft Internet Explorer");
    editormd.isIE8   = (editormd.isIE && navigator.appVersion.match(/8./i) == "8.");

    /**
     * Method of dynamically loading JS files
     * Load javascript file method
     *
     * @param {String} fileName JS file name
     * @param {Function} [callback=function()] The callback function executed after loading successfully
     * @param {String} [into="head"] where to embed the page
     */

    editormd.loadScript = function(fileName, callback, into) {

        into = into || "head";
        callback = callback || function() {};

        var script = null;
        script = document.createElement("script");
        script.id = fileName.replace(/[\./]+/g, "-");
        script.type = "text/javascript";
        script.src = fileName + ".js";

        if (editormd.isIE8)
        {
            script.onreadystatechange = function() {
                if(script.readyState)
                {
                    if (script.readyState === "loaded" || script.readyState === "complete")
                    {
                        script.onreadystatechange = null;
                        editormd.loadFiles.js.push(fileName);
                        callback();
                    }
                }
            };
        }
        else
        {
            script.onload = function() {
                editormd.loadFiles.js.push(fileName);
                callback();
            };
        }

        if (into === "head") {
            document.getElementsByTagName("head")[0].appendChild(script);
        } else {
            document.body.appendChild(script);
        }
    };

    // When using a foreign CDN, the loading speed is sometimes very slow, or a custom URL
    // You can custom KaTeX load url.
    editormd.katexURL = {
        css: "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min",
        js: "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min"
    };

    editormd.kaTeXLoaded = false;

    /**
     * Load KaTeX file
     * load KaTeX files
     *
     * @param {Function} [callback=function()] Callback function executed after loading successfully
     */

    editormd.loadKaTeX = function (callback) {
        editormd.loadCSS(editormd.katexURL.css, function(){
            editormd.loadScript(editormd.katexURL.js, callback || function(){});
        });
    };

    /**
     * Lock screen
     * lock screen
     *
     * @param {Boolean} lock Boolean Boolean value, whether to lock the screen
     * @returns {void}
     */

    editormd.lockScreen = function(lock) {
        $("html,body").css("overflow", (lock)? "hidden": "");
    };

    /**
     * Dynamically create dialogs
     * Creating custom dialogs
     *
     * @param {Object} options configuration item key-value pair Key/Value
     * @returns {dialog} returns the jQuery instance object of the created dialog
     */

    editormd.createDialog = function(options) {
        var defaults = {
            name : "",
            width : 420,
            height: 240,
            title : "",
            drag  : true,
            closed : true,
            content : "",
            mask : true,
            maskStyle : {
                backgroundColor : "#fff",
                opacity : 0.1
            },
            lockScreen : true,
            footer : true,
            buttons : false
        };

        options          = $.extend(true, defaults, options);
        
        var $this        = this;
        var editor       = this.editor;
        var classPrefix  = editormd.classPrefix;
        var guid         = (new Date()).getTime();
        var dialogName   = ( (options.name === "") ? classPrefix + "dialog-" + guid : options.name);
        var mouseOrTouch = editormd.mouseOrTouch;

        var html         = "<div class=\"" + classPrefix + "dialog " + dialogName + "\">";

        if (options.title !== "")
        {
            html += "<div class=\"" + classPrefix + "dialog-header\"" + ( (options.drag) ? " style=\"cursor: move;\"" : "" ) + ">";
            html += "<strong class=\"" + classPrefix + "dialog-title\">" + options.title + "</strong>";
            html += "</div>";
        }

        if (options.closed)
        {
            html += "<a href=\"javascript:;\" class=\"fa fa-close " + classPrefix + "dialog-close\"></a>";
        }

        html += "<div class=\"" + classPrefix + "dialog-container\">" + options.content;                    

        if (options.footer || typeof options.footer === "string") 
        {
            html += "<div class=\"" + classPrefix + "dialog-footer\">" + ( (typeof options.footer === "boolean") ? "" : options.footer) + "</div>";
        }

        html += "</div>";

        html += "<div class=\"" + classPrefix + "dialog-mask " + classPrefix + "dialog-mask-bg\"></div>";
        html += "<div class=\"" + classPrefix + "dialog-mask " + classPrefix + "dialog-mask-con\"></div>";
        html += "</div>";

        editor.append(html);

        var dialog = editor.find("." + dialogName);

        dialog.lockScreen = function(lock) {
            if (options.lockScreen)
            {                
                $("html,body").css("overflow", (lock) ? "hidden" : "");
                $this.resize();
            }

            return dialog;
        };

        dialog.showMask = function() {
            if (options.mask)
            {
                editor.find("." + classPrefix + "mask").css(options.maskStyle).css("z-index", editormd.dialogZindex - 1).show();
            }
            return dialog;
        };

        dialog.hideMask = function() {
            if (options.mask)
            {
                editor.find("." + classPrefix + "mask").hide();
            }

            return dialog;
        };

        dialog.loading = function(show) {                        
            var loading = dialog.find("." + classPrefix + "dialog-mask");
            loading[(show) ? "show" : "hide"]();

            return dialog;
        };

        dialog.lockScreen(true).showMask();

        dialog.show().css({
            zIndex : editormd.dialogZindex,
            border : (editormd.isIE8) ? "1px solid #ddd" : "",
            width  : (typeof options.width  === "number") ? options.width + "px"  : options.width,
            height : (typeof options.height === "number") ? options.height + "px" : options.height
        });

        var dialogPosition = function(){
            dialog.css({
                top    : ($(window).height() - dialog.height()) / 2 + "px",
                left   : ($(window).width() - dialog.width()) / 2 + "px"
            });
        };

        dialogPosition();

        $(window).resize(dialogPosition);

        dialog.children("." + classPrefix + "dialog-close").bind(mouseOrTouch("click", "touchend"), function() {
            dialog.hide().lockScreen(false).hideMask();
        });

        if (typeof options.buttons === "object")
        {
            var footer = dialog.footer = dialog.find("." + classPrefix + "dialog-footer");

            for (var key in options.buttons)
            {
                var btn = options.buttons[key];
                var btnClassName = classPrefix + key + "-btn";

                footer.append("<button class=\"" + classPrefix + "btn " + btnClassName + "\">" + btn[0] + "</button>");
                btn[1] = $.proxy(btn[1], dialog);
                footer.children("." + btnClassName).bind(mouseOrTouch("click", "touchend"), btn[1]);
            }
        }

        if (options.title !== "" && options.drag)
        {                        
            var posX, posY;
            var dialogHeader = dialog.children("." + classPrefix + "dialog-header");

            if (!options.mask) {
                dialogHeader.bind(mouseOrTouch("click", "touchend"), function(){
                    editormd.dialogZindex += 2;
                    dialog.css("z-index", editormd.dialogZindex);
                });
            }

            dialogHeader.mousedown(function(e) {
                e = e || window.event;  //IE
                posX = e.clientX - parseInt(dialog[0].style.left);
                posY = e.clientY - parseInt(dialog[0].style.top);

                document.onmousemove = moveAction;                   
            });

            var userCanSelect = function (obj) {
                obj.removeClass(classPrefix + "user-unselect").off("selectstart");
            };

            var userUnselect = function (obj) {
                obj.addClass(classPrefix + "user-unselect").on("selectstart", function(event) { // selectstart for IE                        
                    return false;
                });
            };

            var moveAction = function (e) {
                e = e || window.event;  //IE

                var left, top, nowLeft = parseInt(dialog[0].style.left), nowTop = parseInt(dialog[0].style.top);

                if( nowLeft >= 0 ) {
                    if( nowLeft + dialog.width() <= $(window).width()) {
                        left = e.clientX - posX;
                    } else {	
                        left = $(window).width() - dialog.width();
                        document.onmousemove = null;
                    }
                } else {
                    left = 0;
                    document.onmousemove = null;
                }

                if( nowTop >= 0 ) {
                    top = e.clientY - posY;
                } else {
                    top = 0;
                    document.onmousemove = null;
                }


                document.onselectstart = function() {
                    return false;
                };

                userUnselect($("body"));
                userUnselect(dialog);
                dialog[0].style.left = left + "px";
                dialog[0].style.top  = top + "px";
            };

            document.onmouseup = function() {                            
                userCanSelect($("body"));
                userCanSelect(dialog);

                document.onselectstart = null;         
                document.onmousemove = null;
            };

            dialogHeader.touchDraggable = function() {
                var offset = null;
                var start  = function(e) {
                    var orig = e.originalEvent; 
                    var pos  = $(this).parent().position();

                    offset = {
                        x : orig.changedTouches[0].pageX - pos.left,
                        y : orig.changedTouches[0].pageY - pos.top
                    };
                };

                var move = function(e) {
                    e.preventDefault();
                    var orig = e.originalEvent;

                    $(this).parent().css({
                        top  : orig.changedTouches[0].pageY - offset.y,
                        left : orig.changedTouches[0].pageX - offset.x
                    });
                };

                this.bind("touchstart", start).bind("touchmove", move);
            };

            dialogHeader.touchDraggable();
        }

        editormd.dialogZindex += 2;

        return dialog;
    };

    /**
     * Judgment/selection method of mouse and touch events
     * MouseEvent or TouchEvent type switch
     *
     * @param {String} [mouseEventType="click"] Mouse events for selection
     * @param {String} [touchEventType="touchend"] Touch event for selection
     * @returns {String} EventType returns the name of the event type
     */

    editormd.mouseOrTouch = function(mouseEventType, touchEventType) {
        mouseEventType = mouseEventType || "click";
        touchEventType = touchEventType || "touchend";

        var eventType = mouseEventType;

        try {
            document.createEvent("TouchEvent");
            eventType = touchEventType;
        } catch(e) {}

        return eventType;
    };

    /**
     * Formatting method of date and time
     * Datetime format method
     *
     * @param {String} [format=""] Date and time format, similar to PHP format
     * @returns {String} datefmt returns the formatted date and time string
     */

    editormd.dateFormat = function(format) {
        format = format || "";

        var addZero = function(d) {
            return (d <10)? "0" + d: d;
        };

        var date = new Date();
        var year = date.getFullYear();
        var year2 = year.toString().slice(2, 4);
        var month = addZero(date.getMonth() + 1);
        var day = addZero(date.getDate());
        var weekDay = date.getDay();
        var hour = addZero(date.getHours());
        var min = addZero(date.getMinutes());
        var second = addZero(date.getSeconds());
        var ms = addZero(date.getMilliseconds());
        var datefmt = "";

        var ymd = year2 + "-" + month + "-" + day;
        var fymd = year + "-" + month + "-" + day;
        var hms = hour + ":" + min + ":" + second;

        switch (format)
        {
            case "UNIX Time":
                datefmt = date.getTime();
                break;

            case "UTC":
                datefmt = date.toUTCString();
                break;

            case "yy":
                datefmt = year2;
                break;

            case "year":
            case "yyyy":
                datefmt = year;
                break;

            case "month":
            case "mm":
                datefmt = month;
                break;

            case "cn-week-day":
            case "cn-wd":
                var cnWeekDays = ["日", "one", "two", "three", "four", "five", "six"];
                datefmt = "week" + cnWeekDays[weekDay];
                break;

            case "week-day":
            case "wd":
                var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                datefmt = weekDays[weekDay];
                break;

            case "day":
            case "dd":
                datefmt = day;
                break;

            case "hour":
            case "hh":
                datefmt = hour;
                break;

            case "min":
            case "ii":
                datefmt = min;
                break;

            case "second":
            case "ss":
                datefmt = second;
                break;

            case "ms":
                datefmt = ms;
                break;

            case "yy-mm-dd":
                datefmt = ymd;
                break;

            case "yyyy-mm-dd":
                datefmt = fymd;
                break;

            case "yyyy-mm-dd h:i:s ms":
            case "full + ms":
                datefmt = fymd + "" + hms + "" + ms;
                break;

            case "full":
            case "yyyy-mm-dd h:i:s":
            default:
                datefmt = fymd + "" + hms;
                break;
        }

        return datefmt;
    };

    return editormd;

}));
