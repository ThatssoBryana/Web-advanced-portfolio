// Definieer constanten
const NOTE_COLORS = {
    DEFAULT: '#f9f9f9',
    COMPLETED: '#cceeff'
};

// Lijst van notities
let notes = [];

// Referenties naar HTML-elementen
const noteForm = document.getElementById('note-form');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const noteList = document.getElementById('note-list');

// Functie om notities toe te voegen
const addNote = (title, content) => {
    const note = {
        id: Date.now(), // Unieke ID voor elke notitie
        title,
        content,
        color: NOTE_COLORS.DEFAULT
    };
    notes.push(note);
    renderNotes();
    saveNotesToLocalStorage();
};

// Functie om notities te bewerken
const editNote = (id, title, content) => {
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
        notes[index].title = title;
        notes[index].content = content;
        renderNotes();
        saveNotesToLocalStorage();
    }
};

// Functie om notities te verwijderen
const deleteNote = id => {
    notes = notes.filter(note => note.id !== id);
    renderNotes();
    saveNotesToLocalStorage();
};

// Functie om notities te markeren als voltooid
const toggleNoteCompleted = id => {
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
        notes[index].color = notes[index].color === NOTE_COLORS.DEFAULT ? NOTE_COLORS.COMPLETED : NOTE_COLORS.DEFAULT;
        renderNotes();
        saveNotesToLocalStorage();
    }
};

// Functie om notities weer te geven op de pagina
const renderNotes = () => {
    noteList.innerHTML = '';
    notes.forEach(note => {
        const noteItem = document.createElement('li');
        noteItem.style.backgroundColor = note.color;
        noteItem.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="toggleNoteCompleted(${note.id})">Markeren als voltooid</button>
            <button onclick="editNoteForm(${note.id})">Bewerken</button>
            <button onclick="deleteNote(${note.id})">Verwijderen</button>
        `;
        noteList.appendChild(noteItem);
    });
};

// Functie om formulier voor het bewerken van notitie voor te bereiden
const editNoteForm = id => {
    const note = notes.find(note => note.id === id);
    if (note) {
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        // Verberg toevoegen-knop, toon bewerken-knop en annuleren-knop
        document.getElementById('edit-btn').style.display = 'inline';
        document.getElementById('cancel-btn').style.display = 'inline';
        document.getElementById('edit-btn').onclick = () => {
            editNote(id, noteTitleInput.value, noteContentInput.value);
            resetNoteForm();
        };
        document.getElementById('cancel-btn').onclick = resetNoteForm;
    }
};

// Functie om formulier voor het toevoegen van notities te resetten
const resetNoteForm = () => {
    noteTitleInput.value = '';
    noteContentInput.value = '';
    // Toon toevoegen-knop, verberg bewerken-knop en annuleren-knop
    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('cancel-btn').style.display = 'none';
};

// Functie om notities naar LocalStorage op te slaan
const saveNotesToLocalStorage = () => {
    localStorage.setItem('notes', JSON.stringify(notes));
};

// Functie om notities van LocalStorage te laden
const loadNotesFromLocalStorage = () => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
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
        if (title && content) {
            addNote(title, content);
            resetNoteForm();
        } else {
            alert('Vul alstublieft zowel de titel als de inhoud in voor de notitie.');
        }
    });
})();
