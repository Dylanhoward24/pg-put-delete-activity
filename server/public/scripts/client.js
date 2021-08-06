$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);

  // TODO - Add code for edit & delete buttons
  $(document).on('click', '.deleteBtn', handleDelete);
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

function handleDelete() {
  console.log('in handleDelete');

  let tr = $(this).parents('tr');
  console.log(tr);
  let id = tr.data('id');
  console.log('id', id);

  $.ajax({
      method: 'DELETE',
      url: `/books/${id}`
  }).then((res) => {
    console.log('DELETE /books', res);
    
    // refresh the data
    refreshBooks();
  }).catch((err) => {
    console.log('DELETE /books error', err);
    alert('DELETE /books failed!');
  });
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr data-id="${book.id}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>
            <button class="deleteBtn">Delete</button>
        </td>
      </tr>
    `);
  }
}
