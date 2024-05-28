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

// Variabelen om de ID en categorie van de notitie die wordt bewerkt bij te houden
let editNoteId = null;
let editNoteCategory = null;
let isNewNote = false;

// Referenties naar HTML-elementen
const noteForm = document.getElementById('note-form');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const noteCategory = document.getElementById('note-category');
const notesContainer = document.getElementById('note-list');
const submitBtn = document.getElementById('submit-btn');
const editBtn = document.getElementById('edit-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Functie om notities toe te voegen aan de juiste lijst op basis van categorie
const addNote = (title, content, category) => {
    if (editNoteId !== null && editNoteCategory !== null) {
        // Verwijder de oude versie van de notitie
        deleteNoteWithoutConfirmation(editNoteId, editNoteCategory);
    }

    const note = {
        id: Date.now(), 
        title,
        content,
        category,
        color: NOTE_COLORS.DEFAULT
    };
    categoryNoteLists[category].push(note);
    renderNotes();
    saveNotesToLocalStorage();
    resetNoteForm();
};

// Functie om notities te verwijderen met bevestiging
const deleteNote = (id, category) => {
    if (confirm('Weet je zeker dat je deze notitie wilt verwijderen?')) {
        deleteNoteWithoutConfirmation(id, category);
    }
};

// Functie om notities te verwijderen zonder bevestiging
const deleteNoteWithoutConfirmation = (id, category) => {
    categoryNoteLists[category] = categoryNoteLists[category].filter(note => note.id !== id);
    renderNotes();
    saveNotesToLocalStorage();
};

// Functie om een notitie te bewerken
const editNote = (id, category) => {
    const noteToEdit = categoryNoteLists[category].find(note => note.id === id);
    renderNotes(); // Opnieuw renderen om te beginnen met een schone lei
    const noteItem = document.querySelector(`.note-item[data-id='${id}']`);

 
    noteItem.classList.add('editing');

    noteItem.innerHTML = `
        <input type="text" class="edit-title" value="${noteToEdit.title}" />
        <textarea class="edit-content">${noteToEdit.content}</textarea>
        <button class="save-btn">Opslaan</button>
        <button class="cancel-btn">Annuleren</button>
    `;

    noteItem.querySelector('.save-btn').addEventListener('click', () => {
        saveEditedNote(id, category);
    });

    noteItem.querySelector('.cancel-btn').addEventListener('click', () => {
        renderNotes();
    });
};

// Functie om de bewerkte notitie op te slaan
const saveEditedNote = (id, category) => {
    const noteItem = document.querySelector(`.note-item[data-id='${id}']`);
    const newTitle = noteItem.querySelector('.edit-title').value;
    const newContent = noteItem.querySelector('.edit-content').value;

    const noteIndex = categoryNoteLists[category].findIndex(note => note.id === id);
    if (noteIndex !== -1) {
        categoryNoteLists[category][noteIndex].title = newTitle;
        categoryNoteLists[category][noteIndex].content = newContent;
    }

    renderNotes();
    saveNotesToLocalStorage();
};

// Functie om notities weer te geven op de pagina met kolommen per categorie
const renderNotes = () => {
    const noteListContainer = document.getElementById('note-list');
    noteListContainer.innerHTML = '';


    const categoryColumns = {};


    for (const category in categoryNoteLists) {
        categoryColumns[category] = document.createElement('div');
        categoryColumns[category].classList.add('note-column');
        categoryColumns[category].innerHTML = `<h3>${category.charAt(0).toUpperCase() + category.slice(1)} Notities</h3>`;
    }

 
    for (const category in categoryColumns) {
        noteListContainer.appendChild(categoryColumns[category]);
    }

    // Plaats notities in de juiste kolom op basis van de categorie
    for (const category in categoryNoteLists) {
        const categoryList = categoryNoteLists[category];
        categoryList.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.classList.add('note-item');
            noteItem.setAttribute('data-id', note.id);
            noteItem.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.content}</p>
                <button class="delete-btn" onclick="deleteNote(${note.id}, '${category}')">Verwijderen</button>
                <button class="edit-btn" onclick="editNote(${note.id}, '${category}')">Bewerken</button>
            `;
            categoryColumns[category].appendChild(noteItem);

            // Voeg de pulse toe aan de nieuwe notities voor 5 seconden
            if (note.id === Date.now()) {
                noteItem.classList.add('pulse');
                setTimeout(() => {
                    noteItem.classList.remove('pulse');
                }, 5000);
            }

        });
    }
};

// Functie om de form leeg te maken als ik op toevoegen druk
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
    }

    renderNotes();
};

// Self-executing function om initialisatiecode uit te voeren
(function() {
    loadNotesFromLocalStorage();
    noteForm.addEventListener('submit', event => {
        event.preventDefault();
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();
        const category = noteCategory.value;
        if (title && content) {
            addNote(title, content, category);
            resetNoteForm();
        } else {
            alert('Vul alstublieft zowel de titel als de inhoud in voor de notitie.');
        }
    });
})();
