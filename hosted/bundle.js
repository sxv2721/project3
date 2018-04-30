"use strict";

var globalCSRF = null;
var handleDomo = function handleDomo(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#noteName").val() == '' || $("#note").val() == '') {
        handleError("RAWR~ All fields are required");
        return false;
    }

    //console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function () {
        loadNotesFromServer();
    });

    return false;
};

var NoteForm = function NoteForm(props) {
    //const today = new Date();
    return React.createElement(
        "form",
        { id: "noteForm",
            onSubmit: handleDomo,
            name: "noteForm",
            action: "/maker",
            method: "POST",
            className: "noteForm" },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Title: "
        ),
        React.createElement("input", { id: "noteName", type: "text", name: "name", placeholder: "Note Title" }),
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement(
            "label",
            { htmlFor: "note" },
            " Note: "
        ),
        " ",
        React.createElement("br", null),
        React.createElement("textarea", { id: "note", type: "text", name: "note", placeholder: "Write a note to your future self!", rows: "10", cols: "50" }),
        " ",
        React.createElement("br", null),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeNoteSubmit", type: "submit", value: "Make Note" })
    );
};

var NoteList = function NoteList(props) {
    if (props.notes.length === 0) {
        return React.createElement(
            "div",
            { className: "noteList" },
            React.createElement(
                "h2",
                { className: "emptynote" },
                "No Notes yet"
            )
        );
    }

    var noteNodes = props.notes.map(function (notes) {
        return React.createElement(
            "div",
            { id: notes._id + "_list", className: "noteList" },
            React.createElement(
                "h2",
                { className: "noteName" },
                notes.name
            ),
            React.createElement(
                "h2",
                { className: "note",
                    id: notes._id },
                notes.note
            ),
            React.createElement(
                "div",
                { className: "reveal", id: notes._id + "_reveal" },
                React.createElement("input", { type: "submit", value: "Show Note",
                    className: "reveal", onClick: function onClick(e) {
                        return showNote(notes._id);
                    } })
            ),
            React.createElement("div", { className: "reveal", id: notes._id + "_hide" }),
            React.createElement(
                "form",
                { id: notes._id + "_remove",
                    className: "remove",
                    onSubmit: function onSubmit(e) {
                        return removeNote(e, notes._id);
                    },
                    action: "/removeNote",
                    method: "post" },
                React.createElement("input", { type: "submit", value: "Remove Note" })
            )
        );
    });

    return React.createElement(
        "div",
        null,
        noteNodes
    );
};

var showNote = function showNote(props) {
    // takes the id of the note, and reveals the text while removing the reveal button
    document.getElementById(props).style.display = "block";
    document.getElementById(props + "_reveal").style.display = "none";
    document.getElementById(props + "_hide").style.display = "inline";
    ReactDOM.render(React.createElement(HideButton, { _id: props }), document.getElementById(props + "_hide"));
    //console.log(props);
    //console.dir(document.getElementById(props));
};
var hideNote = function hideNote(props) {
    // takes the id of the note, and reveals the text while removing the reveal button
    document.getElementById(props).style.display = "none";
    document.getElementById(props + "_hide").style.display = "none";
    document.getElementById(props + "_reveal").style.display = "inline";
    ReactDOM.render(React.createElement(ShowButton, { _id: props }), document.getElementById(props + "_reveal"));
    //console.log(props);
    //console.dir(document.getElementById(props));
};
var HideButton = function HideButton(props) {
    return React.createElement("input", { type: "submit", value: "Hide Note",
        className: "reveal", onClick: function onClick(e) {
            return hideNote(props._id);
        } });
};
var ShowButton = function ShowButton(props) {
    return React.createElement("input", { type: "submit", value: "Show Note",
        className: "reveal", onClick: function onClick(e) {
            return showNote(props._id);
        } });
};
var removeNote = function removeNote(e, props) {
    e.preventDefault();
    //console.log(props);
    sendAjax('DELETE', '/removeNote', "id=" + props + "&_csrf=" + globalCSRF, function () {

        ReactDOM.render(React.createElement(RemoveMessage, null), document.getElementById(props + "_list"));
        //document.getElementById(props+"_list").style.transition = "display 0.8s ease";
        //document.getElementById(props+"_list").style.display = "none";

        //loadNotesFromServer();
    });
    //console.log(props);
    //console.log(globalCSRF);
    //console.dir(document.getElementById(props+"_remove"));

    console.log("removed");
    return false;
};
var RemoveMessage = function RemoveMessage() {
    return React.createElement(
        "div",
        { id: "removeMessage" },
        React.createElement(
            "h2",
            null,
            "Note Removed"
        )
    );
};

var loadNotesFromServer = function loadNotesFromServer() {
    sendAjax('GET', '/getNotes', null, function (data) {
        //console.log(data.notes);
        data.notes.sort(function (a, b) {
            // a compare function. Compares the date it was created in order to output the most recent notes first
            if (a.revealDate > b.revealDate) return -1;else return 1;
        });
        //console.log(data.notes);
        ReactDOM.render(React.createElement(NoteList, { notes: data.notes }), document.querySelector("#notes"));
    });
}; /**/
var setup = function setup(csrf) {
    globalCSRF = csrf;
    ReactDOM.render(React.createElement(NoteForm, { csrf: csrf }), document.querySelector("#makeNote"));

    ReactDOM.render(React.createElement(NoteList, { notes: [] }), document.querySelector("#notes"));

    loadNotesFromServer(); /**/
};
var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
