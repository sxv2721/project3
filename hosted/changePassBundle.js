"use strict";

var handlePass = function handlePass(e) {
    e.preventDefault();
    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#pass").val() == '') {
        handleError("password 1 is empty");
        return false;
    }
    if ($("#pass2").val() == '') {
        handleError("please retype password");
        return false;
    }

    sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);
    return false;
}; /**/
var ChangePassWindow = function ChangePassWindow(props) {
    return React.createElement(
        "form",
        { id: "changeForm", name: "changeForm",
            onSubmit: handlePass,
            action: "/change",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "Password: "
        ),
        React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
        React.createElement("br", null),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "Password: "
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "pass2", placeholder: "retype password" }),
        React.createElement("br", null),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" })
    );
}; /**/

var createChangePassWindow = function createChangePassWindow(csrf) {
    ReactDOM.render(React.createElement(ChangePassWindow, { csrf: csrf }), document.querySelector("#content"));
}; /**/
var setup = function setup(csrf) {
    createChangePassWindow(csrf);
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
