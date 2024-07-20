document.addEventListener("DOMContentLoaded", () => {
    const addNoteBtn = document.querySelector(".add-note");
    const notesContainer = document.getElementById("notes-container");
    const exportBtn = document.getElementById("export-notes");
    const searchInput = document.getElementById("search-input");

    if (addNoteBtn && notesContainer && exportBtn && searchInput) {
        // Load notes from Local Storage
        loadNotes();

        // Add event listener to button for adding a new note
        addNoteBtn.addEventListener("click", addNote);

        // Add event listener to button for exporting notes
        exportBtn.addEventListener("click", exportToCSV);

        // Add event listener to search input
        searchInput.addEventListener("input", filterNotes);
    }

    function addNote() {
        const note = createNoteElement();
        notesContainer.appendChild(note);
        saveNotes();
    }

    function createNoteElement(title = "Note Title", content = "", isPinned = false) {
        const note = document.createElement("div");
        note.classList.add("note");
        if (isPinned) {
            // Add "fixed" class to pin the note
            note.classList.add("fixed");
            // Select a random color for pinned notes
            const randomColor = getRandomColor();
            note.style.backgroundColor = randomColor;
        }
        note.innerHTML = `
            <div class="actions">
                <i class="bi bi-pin"></i>
                <i class="bi bi-x-lg"></i>
                <i class="bi bi-file-earmark-plus"></i>
            </div>
            <h3 contenteditable="true">${title}</h3>
            <textarea placeholder="Your note here...">${content}</textarea>
        `;

        // Add events to save when content is changed
        note.querySelector("h3").addEventListener("input", saveNotes);
        note.querySelector("textarea").addEventListener("input", saveNotes);

        // Add event to remove note
        note.querySelector(".bi-x-lg").addEventListener("click", () => {
            note.remove();
            saveNotes();
        });

        // Add event to duplicate note
        note.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
            const newNote = createNoteElement(note.querySelector("h3").innerText, note.querySelector("textarea").value);
            notesContainer.appendChild(newNote);
            saveNotes();
        });

        // Add event to pin/unpin note
        note.querySelector(".bi-pin").addEventListener("click", () => {
            note.classList.toggle("fixed");
            if (note.classList.contains("fixed")) {
                const randomColor = getRandomColor();
                note.style.backgroundColor = randomColor;
            } else {
                note.style.backgroundColor = ""; // Reset color if unpinned
            }
            saveNotes();
        });

        return note;
    }

    function saveNotes() {
        const notes = [];
        document.querySelectorAll(".note").forEach(note => {
            const title = note.querySelector("h3").innerText;
            const content = note.querySelector("textarea").value;
            const isPinned = note.classList.contains("fixed");
            const color = note.style.backgroundColor;
            notes.push({ title, content, isPinned, color });
        });
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function loadNotes() {
        const savedNotes = localStorage.getItem("notes");
        if (savedNotes) {
            try {
                const notes = JSON.parse(savedNotes);
                // Clear notes container
                notesContainer.innerHTML = "";
                // Add pinned notes first
                notes.filter(note => note.isPinned).forEach(note => {
                    const noteElement = createNoteElement(note.title, note.content, true);
                    noteElement.style.backgroundColor = note.color; // Apply saved color
                    notesContainer.appendChild(noteElement);
                });
                // Add unpinned notes
                notes.filter(note => !note.isPinned).forEach(note => {
                    const noteElement = createNoteElement(note.title, note.content, false);
                    notesContainer.appendChild(noteElement);
                });
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
    }

    
    function exportToCSV() {
        const notes = JSON.parse(localStorage.getItem("notes"));
        if (!notes || notes.length === 0) {
            alert("No notes to export!");
            return;
        }

        const csvContent = "data:text/csv;charset=utf-8,"
            + "Title,Content\n"
            + notes.map(note => `"${note.title.replace(/"/g, '""')}","${note.content.replace(/"/g, '""')}"`)
                    .join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "notes.csv");
        document.body.appendChild(link);
        link.click();
    }

    function filterNotes() {
        const searchText = searchInput.value.toLowerCase();
        document.querySelectorAll(".note").forEach(note => {
            const title = note.querySelector("h3").innerText.toLowerCase();
            const content = note.querySelector("textarea").value.toLowerCase();
            if (title.includes(searchText) || content.includes(searchText)) {
                note.style.display = "block";
            } else {
                note.style.display = "none";
            }
        });
    }

    // Function to get random color
    function getRandomColor() {
        const colors = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6"];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }
});
