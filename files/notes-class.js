class Notes{
    dbVersion = 1;
    dbName = 'notesDB';
    reverseOrder = false;

    connect(){
        return new Promise((resolve, reject) =>{
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded=(()=>{
                let db = request.result;
                if(!db.objectStoreNames.contains('notes')){
                    db.createObjectStore('notes', {keyPath:'id' , autoIncrement:true});
                }
            });
            request.onsuccess=(()=>{
                resolve(request.result);
            });
            request.onerror=(()=>{
                reject(request.error.message);
            });
            request.onblocked=(()=>{
                alert('DataBase blocked ');
            })
        })
    }



    async accessStore(accessType){
        let connect = await this.connect();
        let tx = connect.transaction('notes',accessType);
        return tx.objectStore('notes');
    }
    async addNotes(note){
        let store = await this.accessStore('readwrite');
        return store.add(note);
    }
    async updateNotes(note ,noteID){
        let store = await this.accessStore('readwrite');
        return store.put(note ,noteID);

    }
    async deleteNotes(noteID){
        let store = await this.accessStore('readwrite');
        return store.delete(noteID)
    }
    async allNotes(){
        let notes = await this.accessStore('readonly');
        return notes.openCursor(null, this.reverseOrder ? "prev" : "next");
    }
    async clearNotes(){
        let notes = await this.accessStore('readwrite');
        notes.clear();
    }
}