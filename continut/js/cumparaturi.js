function Produs(id ,nume, cantitate){
    this.id = id;
    this.nume = nume;
    this.cantitate = cantitate;
}

class PersistanceUnit{
    getProductList(){}
    addProduct(nume, cantitate){}
}

class LocalStorageUnit extends PersistanceUnit{
    getProductList(){
        var listaProduse = JSON.parse(localStorage.getItem("produse"));
        if(listaProduse == null){
            listaProduse = [];
        }
        return listaProduse;
    }

    addProduct(nume, cantitate){
        if(nume == "" || cantitate == "") return;

        var listaProduse = this.getProductList();
        var produs = new Produs(listaProduse.length + 1 ,nume, cantitate);

        listaProduse.push(produs);

        localStorage.setItem("produse", JSON.stringify(listaProduse));
        console.log("(localStorage) Se adauga produsul: " + JSON.stringify(produs));
    }
}

class IndexedDBUnit extends PersistanceUnit {
    constructor() {
        super();
        this.db = null;
        this.store = null;
        this.indexNume = null;
        this.indexCantitate = null;

        var dbName = "ProduseDatabase";
        var request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            this.db = request.result;

            // creem un objectStore pentru produse
            var objectStore = this.db.createObjectStore("ProduseStore", { keyPath: "id" });
            objectStore.createIndex("nume", "nume", { unique: false });
            objectStore.createIndex("cantitate", "cantitate", { unique: false });
        };

        request.onerror = (event) => {
            console.error("Database error: " + event.target.errorCode);
        };
        request.onsuccess = (event) => {
            this.db = request.result;
            this.store = this.db.transaction("ProduseStore", "readwrite").objectStore("ProduseStore");
            this.indexNume = this.store.index("nume");
            this.indexCantitate = this.store.index("cantitate");

            this.db.onerror = function(e) {
                console.log("ERROR: " + e.target.errorCode);
            }
            tabelCumparaturi(storageType);
        };
    }

    getProductList() {
        var listaProduse = [];
    

        var transaction = this.db.transaction("ProduseStore", "readonly");
        

        var objectStore = transaction.objectStore("ProduseStore");
        

        var cursorRequest = objectStore.openCursor();
        

        cursorRequest.onsuccess = (event) => {
            var cursor = event.target.result;
            if (cursor) {
            listaProduse.push(cursor.value);
            cursor.continue();
            }
        };
        

        cursorRequest.onerror = (event) => {
            console.error("Error opening cursor:", event.target.error);
        };
    
        return listaProduse;
    }

    addProduct(numeProdus, cantitateProdus) {
        if (numeProdus === "" || cantitateProdus === "") return;
    
        var transaction = this.db.transaction("ProduseStore", "readwrite");
    
        var objectStore = transaction.objectStore("ProduseStore");
    
        var numarProduse = this.getProductList().length;
        var produs = new Produs(numarProduse + 1, numeProdus, cantitateProdus);
    

        var request = objectStore.add(produs);
    
        request.onsuccess = (event) => {
            let prod = new Produs(event.target.result, numeProdus, cantitateProdus);
            console.log("(IndexedDB) Se adauga produsul: " + JSON.stringify(prod));
        };
    

        request.onerror = (event) => {
            console.error("Error adding product:", event.target.error);
        };
    }
    
}


var localPersistanceUnit = new LocalStorageUnit();
var indexedPersistanceUnit = new IndexedDBUnit();
var storageType = "localStorage";

function worker(){
    const myWorker = new Worker("js/worker.js");
    console.log("Worker initialised");

    setInterval(function(){
        var listaProduse;
        // se extrage lista de produse, iar depinzand de storage, se salveaza
        if(document.getElementById("store-type-local").checked == true){
            // local storage
            storageType = "localStorage";
            listaProduse = localPersistanceUnit.getProductList();
        }
        else{
            // indexedDb information
            storageType = "indexedDB";
            // extrage lista de produse
            listaProduse = indexedPersistanceUnit.getProductList();
        }

        myWorker.postMessage([JSON.stringify(listaProduse), storageType])
        
    }, 500)

    myWorker.onmessage = function(e) {
        if(e.data[0] == "changed"){
            tabelCumparaturi(e.data[1]);
        }
    }
}

function adaugaProdus() {
    if (storageType == "localStorage") {
        var persistanceUnit = localPersistanceUnit;
    } else {
        var persistanceUnit = indexedPersistanceUnit;
    }
    var numeProdus = document.getElementById("nume-produs").value;
    var cantitateProdus = document.getElementById("cantitate-produs").value;
    persistanceUnit.addProduct(numeProdus, cantitateProdus);
}

// Legare eveniment de click la butonul "Adaugă"
document.getElementById("adauga-btn").addEventListener("click", adaugaProdus);


document.getElementById("adauga-btn").addEventListener("click", adaugaProdus);
document.getElementById("nume-produs").addEventListener("keydown", keyListener);
document.getElementById("cantitate-produs").addEventListener("keydown", keyListener);

function tabelCumparaturi(storageType){
    var tabel = document.getElementById("tabela-cumparaturi");
    tabel.innerHTML = 
    "<tr>" +
        "<th>Nr.</th>" +
        "<th>Nume Produs</th>" +
        "<th>Cantitate</th>" + 
    "</tr>";

    var listaProduse;
    var persistanceUnit = null;
    if(storageType == "localStorage"){
        persistanceUnit = localPersistanceUnit;
    }
    else if(storageType == "indexedDB"){
        persistanceUnit = indexedPersistanceUnit;
    }

    listaProduse = persistanceUnit.getProductList();

    if (Array.isArray(listaProduse)) { // Verifică dacă listaProduse este un array
        listaProduse.forEach(produs => {
            var tr = document.createElement("TR");

            var td = document.createElement("TD");
            td.innerText = produs.id + ".";
            tr.appendChild(td);

            td = document.createElement("TD");
            td.innerText = produs.nume;
            tr.appendChild(td);

            td = document.createElement("TD");
            td.innerText = produs.cantitate;
            tr.appendChild(td);

            tabel.appendChild(tr);
        });
    } else {
        console.error("Lista de produse nu este un array.");
    }
}
function clearEntries() {
    if (storageType === "localStorage") {
        localStorage.clear();
        console.log("All entries cleared from localStorage.");
    } else if (storageType === "indexedDB") {
        var transaction = indexedPersistanceUnit.db.transaction("ProduseStore", "readwrite");
        var objectStore = transaction.objectStore("ProduseStore");

        var clearRequest = objectStore.clear();

        
        clearRequest.onsuccess = function() {
            console.log("All entries cleared from IndexedDB.");
        };

        clearRequest.onerror = function(event) {
            console.error("Error clearing entries from IndexedDB:", event.target.error);
        };
    }
}
