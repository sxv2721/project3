
const handlePass = (e) => {
    e.preventDefault();
    $("#domoMessage").animate({width: 'hide'}, 350);
    
    if($("#pass").val() == '') {
        handleError("password 1 is empty");
        return false;
    }
    if($("#pass2").val() == '') {
        handleError("please retype password");
        return false;
    }
     
    
    sendAjax('POST', $("#changeForm").attr("action"), $("#changeForm").serialize(), redirect);
    return false;
}/**/
const ChangePassWindow = (props) => {
    return (
    <form id="changeForm" name="changeForm"
            onSubmit={handlePass}
            action="/change"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <br/>    
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <br/>    
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="formSubmit" type="submit" value="Change Password" />
        
        </form>
    )
};/**/

const createChangePassWindow = (csrf)=> {
    ReactDOM.render(
        <ChangePassWindow csrf = {csrf} />,
        document.querySelector("#content"),
    )
};/**/
const setup = (csrf) => {
    createChangePassWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};
$(document).ready(function() {
    getToken();
});