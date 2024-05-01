// Definieer constanten
const NOTE_COLORS = {
    DEFAULT: '#f9f9f9',
    COMPLETED: '#cceeff'
};

// Object om lijsten van notities per categorie bij te houden
let categoryNoteLists = {
    Personal: [],
    Work: [],
    Ideas: []
};

// Referenties naar HTML-elementen
const noteForm = document.getElementById('note-form');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const noteCategory = document.getElementById('note-category');
const notesContainer = document.getElementById('note-list');

// Functie om notities toe te voegen aan de juiste lijst op basis van categorie
const addNote = (title, content, category) => {
    const note = {
        id: Date.now(), // Unieke ID voor elke notitie
        title,
        content,
        category,
        color: NOTE_COLORS.DEFAULT
    };
    categoryNoteLists[category].push(note);
    renderNotes();
    saveNotesToLocalStorage();
};

// Functie om notities te verwijderen
const deleteNote = (id, category) => {
    categoryNoteLists[category] = categoryNoteLists[category].filter(note => note.id !== id);
    renderNotes();
    saveNotesToLocalStorage();
};

// Functie om een notitie te bewerken
const editNote = (id, category) => {
    // Zoek de notitie met de gegeven id in de juiste categorie
    const noteToEdit = categoryNoteLists[category].find(note => note.id === id);


     deleteNote(id, category);


    noteTitleInput.value = noteToEdit.title;
    noteContentInput.value = noteToEdit.content;
    noteCategory.value = category;


    document.getElementById('edit-btn').style.display = 'inline';
    document.getElementById('cancel-btn').style.display = 'inline';
    document.getElementById('submit-btn').style.display = 'none';

    // Bewaar de id van de notitie die wordt bewerkt, zodat we deze kunnen gebruiken bij het bijwerken van de notitie
    noteForm.dataset.editId = id;
};


// Functie om notities weer te geven op de pagina met kolommen per categorie
const renderNotes = () => {
    const noteListContainer = document.getElementById('note-list');
    noteListContainer.innerHTML = ''; 


    // Maak een object om notitielijsten per categorie bij te houden
    const categoryColumns = {};

    // Creëer een kolom voor elke categorie
    for (const category in categoryNoteLists) {
        categoryColumns[category] = document.createElement('div');
        categoryColumns[category].classList.add('note-column');
        categoryColumns[category].innerHTML = `<h3>${category} notes</h2>`;
    }

    // Voeg alle kolommen toe aan de container
    for (const category in categoryColumns) {
        noteListContainer.appendChild(categoryColumns[category]);
    }

    // Plaats notities in de juiste kolom op basis van de categorie
    for (const category in categoryNoteLists) {
        const categoryList = categoryNoteLists[category];
        categoryList.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.classList.add('note-item');
            noteItem.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <button class="delete-btn" onclick="deleteNote(${note.id}, '${category}')">Verwijderen</button>
                <button class="edit-btn" onclick="editNote(${note.id}, '${category}')">Bewerken</button>
            `;
            categoryColumns[category].appendChild(noteItem);
        });
    }
    // Wis alle huidige inhoud van de notities-container
    notesContainer.innerHTML = '';

    // Voeg alle kolommen toe aan de notities-container
    for (const category in categoryColumns) {
        notesContainer.appendChild(categoryColumns[category]);
    }
};

//de invoervelden van het formulier leeg te maken
const resetNoteForm = () => {
    noteTitleInput.value = '';
    noteContentInput.value = '';
    noteCategory.selectedIndex = 0; 
};


// Functie om notities naar LocalStorage op te slaan
const saveNotesToLocalStorage = () => {
    localStorage.setItem('categoryNoteLists', JSON.stringify(categoryNoteLists));
};

// Functie om notities van LocalStorage te laden
const loadNotesFromLocalStorage = () => {
    const storedCategoryNoteLists = localStorage.getItem('categoryNoteLists');
    if (storedCategoryNoteLists) {
        categoryNoteLists = JSON.parse(storedCategoryNoteLists);
        renderNotes();
    }
};

// Self-executing function om initialisatiecode uit te voeren
(function() {
    loadNotesFromLocalStorage();
    noteForm.addEventListener('submit', event => {
        event.preventDefault();
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();
        const category = noteCategory.value;
        console.log("Title:", title);
        console.log("Content:", content);
        console.log("Category:", category);
        if (title && content) {
            addNote(title, content, category);
            resetNoteForm();
        } else {
            alert('Vul alstublieft zowel de titel als de inhoud in voor de notitie.');
        }
    });
})();
