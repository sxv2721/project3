"use strict";

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
    var today = new Date();
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
            "Name: "
        ),
        React.createElement("input", { id: "noteName", type: "text", name: "name", placeholder: "Note Title" }),
        React.createElement("br", null),
        React.createElement(
            "label",
            { htmlFor: "reveal" },
            " Reveal Date: "
        ),
        React.createElement("input", { id: "reveal", type: "date", name: "reveal" }),
        " ",
        React.createElement("br", null),
        React.createElement(
            "label",
            { htmlFor: "note" },
            " Note: "
        ),
        " ",
        React.createElement("br", null),
        React.createElement("textarea", { id: "note", type: "text", name: "note", placeholder: "Note", rows: "10", cols: "50" }),
        " ",
        React.createElement("br", null),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeNoteSubmit", type: "submit", value: "Make Note" })
    );
};

var NoteList = function NoteList(props) {
    if (props.notes !== 'undefined' && props.notes.length === 0) {
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
        console.dir(notes);
        return React.createElement(
            "div",
            { key: note._id, className: "note" },
            React.createElement(
                "h2",
                { className: "noteName" },
                notes.name
            ),
            React.createElement(
                "h2",
                { className: "noteReveal" },
                " Reveal: ",
                React.createElement(
                    "h3",
                    null,
                    notes.reveal
                ),
                " "
            ),
            React.createElement(
                "h2",
                { className: "note" },
                notes.note
            )
        );
    });

    return React.createElement(
        "div",
        { className: "noteList" },
        noteNodes
    );
};

var loadNotesFromServer = function loadNotesFromServer() {
    sendAjax('GET', '/getNotes', null, function (data) {
        ReactDOM.render(React.createElement(NoteList, { notes: data.notes }), document.querySelector("#notes"));
    });
}; /**/

var setup = function setup(csrf) {

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
