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
    const today = new Date();
    return (
        <form id="noteForm"
        onSubmit={handleDomo}
        name="noteForm"
        action="/maker"
        method="POST"
        className="noteForm">
            <label htmlFor="name">Name: </label>
            <input id="noteName" type="text" name="name" placeholder="Note Title"/><br/>
            <label htmlFor="reveal"> Reveal Date: </label>
            <input id="reveal" type="date" name="reveal" /> <br/>
            <label htmlFor="note"> Note: </label> <br/>
            <textarea id="note" type="text" name="note" placeholder="Note" rows="10" cols="50" /> <br/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeNoteSubmit" type="submit" value="Make Note"/>
        </form>
    );
};

const NoteList = function(props){
    if(props.notes !== 'undefined' && props.notes.length === 0){
        return (
            <div className="noteList">
                <h2 className="emptynote">No Notes yet</h2>
            </div>
        );
    }
    const noteNodes = props.notes.map(function(notes) {
        console.dir(notes);
        return (
            <div key={note._id} className="note">
                <h2 className="noteName">{notes.name}</h2>
                <h2 className="noteReveal"> Reveal: <h3>{notes.reveal}</h3> </h2>
                <h2 className="note">{notes.note}</h2>
                
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
    
    
    loadNotesFromServer();/**/
    
    
};
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});