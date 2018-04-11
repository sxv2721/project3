const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'}, 350);
    
    if($("#noteName").val() == '' || $("#note").val() == '')
    {
        handleError("RAWR~ All fields are required");
        return false;
    }
    
    //console.log($("input[name=_csrf]").val());
    
    sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function() {
        loadNotesFromServer();
    });
    
    return false;
};


const NoteForm = (props) => {
    return (
        <form id="noteForm"
        onSubmit={handleDomo}
        name="noteForm"
        action="/maker"
        method="POST"
        className="noteForm">
            <label htmlFor="name">Name: </label>
            <input id="name" type="text" name="name" placeholder="Note Title"/>
            <label htmlFor="age">Age: </label>
            <input id="note" type="text" name="note" placeholder="Note"/>
            <label htmlFor="reveal">Reveal Date: </label>
            <input id="reveal" type="date" name="reveal"/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeNoteSubmit" type="submit" value="Make Note"/>
        </form>
    );
};

const NoteList = function(props){
    if(props.notes.length === 0){
        return (
            <div className="noteList">
                <h3 className="emptynote">No Notes yet</h3>
            </div>
        );
    }
    const noteNodes = props.notes.map(function(domo) {
        return (
            <div key={note._id} className="note">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="noteName"> Name: {notes.name} </h3>
                <h3 className="note"> Note: {notes.note} </h3>
                <h3 className="noteReveal"> Reveal: {notes.reveal} </h3>
            </div>
        );
    });
    
    return (
        <div className = "noteList">
            {noteNodes}
        </div>
    );
};



const loadNotesFromServer = () => {
    sendAjax('GET', '/getNotes', null, (data) => {
        ReactDOM.render(
            <NoteList notes={data.notes} />, document.querySelector("#notes")
        );
    });
};/**/

const setup = function(csrf) {
    
    ReactDOM.render(
        <NoteForm csrf={csrf} />, document.querySelector("#makeNote")
    );
    
    ReactDOM.render(
        <NoteList notes={[]} />, document.querySelector("#notes")
    );
    
    
    loadNotesFromServer/**/
    
    
};
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});