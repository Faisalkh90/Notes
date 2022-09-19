const notesObj = new Notes();
// notesObj.connect();
 window.onload = allNotes;

btns.addEventListener('click' , (e)=>{
    e.preventDefault();
    let target = e.target;
    if(target && target.classList.contains('add-notes')){
        addNotes();
    }
})
document.addEventListener('click' , (e)=>{
    let target = e.target;
    if(target && target.classList.contains('delete-note')){
        let noteID = parseInt(target.dataset.id);
        let numberOfNotes = target.dataset.number;
         deleteNotes(noteID , numberOfNotes);
    }else if(target && target.classList.contains('edit-note')){
        let noteID = parseInt(target.dataset.id);
        let numberOfNotes = target.dataset.number;
        editNote(noteID , numberOfNotes);
    }
})

document.addEventListener('click' , (e)=>{
    e.preventDefault();
    let target = e.target;
    if(target && target.classList.contains('reverse-notes')){
      notesObj.reverseOrder = !notesObj.reverseOrder;
        allNotes();
    }
})

document.addEventListener('click' , async (e)=>{
    e.preventDefault();
    let target = e.target;
    if(target && target.classList.contains('remove-all')){
        if(confirm('Are you sure you want to delete all notes ?')){
            await notesObj.clearNotes();
            allNotes();
        }else{
            return false;
        }
    }
})

async function addNotes(){
    let note = document.querySelector('textarea');

    if(note.value == ''){
        alert('please make sure you have note to add !');
        note.focus();
    }else {
        let add = await notesObj.addNotes({text: note.value });
        add.onsuccess = () => {
            document.querySelector('textarea').value = '';
             allNotes();
            // window.location.reload();
        }
    }
}

 function editNote(noteID){

    let noteContainer = document.getElementById('notes-'+noteID);
    let oldText = noteContainer.querySelector('p').innerText;
    let form = ` 
        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3">${oldText}</textarea>
        <br>
        <button type="button" class="btn btn-light update-notes" data-number="">Update</button>`;
    noteContainer.innerHTML = form;
    let updBtn = noteContainer.querySelector('button');
    updBtn.onclick =  (e) =>{
        let newNote = noteContainer.querySelector('textarea').value;
        update(newNote ,noteID);

    }
}

async function update(note , noteID ){
    let update = await notesObj.updateNotes({text : note , id : noteID});
    update.onsuccess = allNotes;
}

async function deleteNotes(noteID, numberOfNotes){
     if(confirm(`Are you sure you want to delete note number : '${numberOfNotes}' ?`)) {
         let deleteRequest = await notesObj.deleteNotes(noteID);
         deleteRequest.onsuccess = () => {
             document.getElementById('notes-'+noteID).remove();
         }
     }else{
         return false;
     }
}

async function allNotes(){

    let request = await notesObj.allNotes();
    let notesArray =[];
    request.onsuccess = (()=>{
        let cursor = request.result;
        if(cursor){
            notesArray.push(cursor.value);
            cursor.continue();
        }else{
            displayNotes(notesArray);
        }
    });
}

async function clearAllNotes(){
    let notes = await notesObj.clearNotes();
}

function displayNotes(notesArray){

    let ulElement = document.createElement('ul');
    ulElement.className = 'tilesWrap';
    ulElement.id = 'listNotes';
    for(let i=0; i < notesArray.length; i++){

        let list = document.createElement('li');

        list.id = 'notes-'+notesArray[i].id;

        let numberOfNotes = document.createElement('h2');
        numberOfNotes.innerHTML = (i+1).toString();

        let para = document.createElement('p');
        para.innerHTML = notesArray[i].text;

        let header3 = document.createElement('h3');
        header3.innerHTML ='Note:';

         let image = document.createElement('div');
         image.id = 'images';
         image.innerHTML = `
        <img src="pencil-square.svg" class="edit-note" data-id="${notesArray[i].id}" data-number="${numberOfNotes.innerHTML}">
        <img src="trash3-fill.svg" class="delete-note" data-id="${notesArray[i].id}" data-number="${numberOfNotes.innerHTML}">
         `;
        list.append(numberOfNotes);
        list.append(header3);
        list.append(para);
        list.append(image);
        ulElement.append(list);

    }

      document.getElementById("notesDivision").innerHTML = ''
      document.getElementById("notesDivision").append(ulElement);

}
 // addNotes();
// update({id:10 , text: 'Hello ! Updated'});
// deleteNotes(11);

// allNotes();
//  clearAllNotes();