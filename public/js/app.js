$(document).ready(() => {
    $('#save-note').click(async () => {
      const content = $('#note-content').val();
      const token = localStorage.getItem('token');
      const note = { content, labels: [], color: '#fff' }; // Add fields as needed
  
      try {
        const response = await fetch('/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
          body: JSON.stringify(note),
        });
        if (response.ok) {
          const newNote = await response.json();
          $('#notes-list').append(`<div class="note">${newNote.content}</div>`);
          $('#note-content').val('');
        }
      } catch (error) {
        console.error('Error saving note:', error);
      }
    });
  
    // Load notes on page load
    async function loadNotes() {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('/notes', {
          headers: { 'Authorization': token },
        });
        if (response.ok) {
          const notes = await response.json();
          notes.forEach(note => {
            $('#notes-list').append(`<div class="note">${note.content}</div>`);
          });
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  
    loadNotes();
  });
  