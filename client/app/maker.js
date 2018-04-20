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
    /*
    <label htmlFor="reveal"> Reveal Date: </label>
            <input id="reveal" type="date" name="reveal" /> <br/>
    */
    return (
        <form id="noteForm"
        onSubmit={handleDomo}
        name="noteForm"
        action="/maker"
        method="POST"
        className="noteForm">
            <label htmlFor="name">Title: </label>
            <input id="noteName" type="text" name="name" placeholder="Note Title"/><br/>
            <br/>
            <label htmlFor="note"> Note: </label> <br/>
            <textarea id="note" type="text" name="note" placeholder="Write a note to your future self!" rows="10" cols="50" /> <br/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <input className="makeNoteSubmit" type="submit" value="Make Note"/>
        </form>
    );
}; 

const NoteList = function(props){
    if(props.notes.length === 0){
        return (
            <div className="noteList">
                <h2 className="emptynote">No Notes yet</h2>
            </div>
        );
    }
    const noteNodes = props.notes.map(function(notes) {
        console.dir(notes.reveal);
        /*<h2 className="noteReveal"> Reveal: <h3>{notes.reveal}</h3> </h2>
        <input type="hidden" name="_id" value={note._id} />
                    <input type="submit" value="Delete Note"/>                
                
        /**/
        return (
            <div key={note._id} className="noteList">
                <h2 className="noteName">{notes.name}</h2>
                
                <h2 className="note" id = {note._id}>{notes.note}</h2>
                <input type="submit" value = "Show Note"
                className="reveal"onSubmit = {showNote}/>
                <form
                    onSubmit = {removeNote}
                    action="/removeNote"
                    method="post">
                    </form>
            </div>
        );
    });
    
    return (
        <div>
            {noteNodes}
        </div>
    );
};

const showNote = (e) => {
    e.preventDefault();
    Document.getElementById("#"+e._id).style.display = "inline";
    console.dir(Document.getElementById(e._id));
    return false;
}
const removeNote = (e) => {
    e.preventDefault();
    
    sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function() {
        loadNotesFromServer();
    });
    return false;
}


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