let globalCSRF=null;
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
    //const today = new Date();
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
        return (
            <div id={notes._id+"_list"} className="noteList">
                <h2 className="noteName">{notes.name}</h2>
                
                <h2 className="note" 
                id = {notes._id}>{notes.note}</h2>
                <div className="reveal" id={notes._id+"_reveal"}>
                <input type="submit" value = "Show Note"
                className="reveal" onClick = {(e)=> showNote(notes._id)}/>
                </div>
                <div className="reveal" id={notes._id+"_hide"}>
                </div>
                <form id= {notes._id+"_remove"}
                    className="remove"
                    onSubmit = {(e)=> removeNote(e, notes._id)}
                    action="/removeNote"
                    method="post">
                    <input type="submit" value = "Remove Note"/>
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

const showNote = (props) => {// takes the id of the note, and reveals the text while removing the reveal button
    document.getElementById(props).style.display = "block";
    document.getElementById(props+"_reveal").style.display = "none";
    document.getElementById(props+"_hide").style.display = "inline";
    ReactDOM.render(<HideButton _id={props}/>, document.getElementById(props+"_hide"));
    //console.log(props);
    //console.dir(document.getElementById(props));
};
const hideNote = (props) => {// takes the id of the note, and reveals the text while removing the reveal button
    document.getElementById(props).style.display = "none";
    document.getElementById(props+"_hide").style.display = "none";
    document.getElementById(props+"_reveal").style.display = "inline";
    ReactDOM.render(<ShowButton _id={props}/>, document.getElementById(props+"_reveal"));
    //console.log(props);
    //console.dir(document.getElementById(props));
};
const HideButton = (props) =>{
    return(
    <input type="submit" value = "Hide Note"
                className="reveal" onClick = {(e)=> hideNote(props._id)}/>
    )
}
const ShowButton = (props) => {
    return(
    <input type="submit" value = "Show Note"
                className="reveal" onClick = {(e)=> showNote(props._id)}/>
    )
}
const removeNote = (e, props) => {
    e.preventDefault();
    //console.log(props);
    sendAjax('DELETE', '/removeNote', "id="+props + "&_csrf="+globalCSRF, function() {
        
        ReactDOM.render(
            <RemoveMessage />, document.getElementById(props+"_list")
        );
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
const RemoveMessage = () => {
    return (
        <div id="removeMessage">
            <h2>Note Removed</h2>
        </div>
    );
};

const loadNotesFromServer = () => {
    sendAjax('GET', '/getNotes', null, (data) => {
        //console.log(data.notes);
        data.notes.sort(function(a, b) {// a compare function. Compares the date it was created in order to output the most recent notes first
            if(a.revealDate>b.revealDate) return -1;
            else return 1;
        });
        //console.log(data.notes);
        ReactDOM.render(
            <NoteList notes={data.notes} />, document.querySelector("#notes")
        );
    });
};/**/
const setup = function(csrf) {
    globalCSRF=csrf;
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