function createNoteElement() {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");

    const textarea = document.createElement("textarea");
    textarea.placeholder = "Add text";

    const pinIcon = document.createElement("i");
    pinIcon.classList.add("bi", "bi-pin");
    pinIcon.addEventListener('click', function() {
        noteDiv.style.backgroundColor = getRandomColor(); // Altera a cor de fundo ao clicar no ícone de fixar
    });

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("bi", "bi-x-lg");
    deleteIcon.addEventListener('click', function() {
        noteDiv.remove(); // Remove a nota ao clicar no ícone de deletar
    });

    const duplicateIcon = document.createElement("i");
    duplicateIcon.classList.add("bi", "bi-file-earmark-plus");
    duplicateIcon.addEventListener('click', function() {
        const clonedNote = noteDiv.cloneNode(true);
        notesContainer.appendChild(clonedNote);
        addNoteEventListeners(clonedNote); // Adiciona event listeners à nota clonada
    });

    noteDiv.appendChild(textarea);
    noteDiv.appendChild(pinIcon);
    noteDiv.appendChild(deleteIcon);
    noteDiv.appendChild(duplicateIcon);

    return noteDiv;
}

function addNoteEventListeners(noteDiv) {
    const pinIcon = noteDiv.querySelector(".bi-pin");
    pinIcon.addEventListener('click', function() {
        noteDiv.style.backgroundColor = getRandomColor(); // Altera a cor de fundo ao clicar no ícone de fixar
    });

    const deleteIcon = noteDiv.querySelector(".bi-x-lg");
    deleteIcon.addEventListener('click', function() {
        noteDiv.remove(); // Remove a nota ao clicar no ícone de deletar
    });
}

function getRandomColor() {
    const colors = ["#c2ff3d", "#ff3de8", "#3dc2ff", "#04e022", "#bc83e6", "#eebb328"];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

// Add note btn
document.addEventListener('DOMContentLoaded', function() {
    const addNoteBtn = document.querySelector(".add-note");
    const notesContainer = document.getElementById("notes-container");

    addNoteBtn.addEventListener('click', function() {
        const noteElement = createNoteElement();
        notesContainer.appendChild(noteElement);
    });

    notesContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains("bi-file-earmark-plus")) {
            const noteDiv = event.target.closest(".note");
            if (noteDiv) {
                const clonedNote = noteDiv.cloneNode(true);
                notesContainer.appendChild(clonedNote);
                addNoteEventListeners(clonedNote); // Adiciona event listeners à nota clonada
            }
        }
    });

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener('input', function() {
        const searchText = searchInput.value.toLowerCase();
        const notes = notesContainer.querySelectorAll(".note");

        notes.forEach(function(note) {
            const text = note.querySelector("textarea").value.toLowerCase();
            if (text.includes(searchText)) {
                note.style.display = "block";
            } else {
                note.style.display = "none";
            }
        });
    });
});
