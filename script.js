document.addEventListener('DOMContentLoaded', () => {
    const allBooksTab = document.getElementById('all-books-tab');
    const wishlistTab = document.getElementById('wishlist-tab');
    const addBookTab = document.getElementById('add-book-tab');
    
    const bookList = document.getElementById('book-list');
    const wishlist = document.getElementById('wishlist');
    const addBook = document.getElementById('add-book');
    
    const booksContainer = document.getElementById('books');
    const wishlistContainer = document.getElementById('wishlist-books');
    
    const bookForm = document.getElementById('book-form');
    
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let wishlistBooks = JSON.parse(localStorage.getItem('wishlistBooks')) || [];
    
    allBooksTab.addEventListener('click', () => showTab(bookList));
    wishlistTab.addEventListener('click', () => showTab(wishlist));
    addBookTab.addEventListener('click', () => showTab(addBook));
    
    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('book-title').value;
        const author = document.getElementById('book-author').value;
        const cover = document.getElementById('book-cover').value;
        const notes = document.getElementById('book-notes').value;
        
        const newBook = { title, author, cover, notes, read: false };
        books.push(newBook);
        localStorage.setItem('books', JSON.stringify(books));
        addBookToDOM(newBook);
        bookForm.reset();
        showTab(bookList);
    });
    
    function showTab(tab) {
        bookList.classList.remove('active-tab');
        wishlist.classList.remove('active-tab');
        addBook.classList.remove('active-tab');
        tab.classList.add('active-tab');
    }
    
    function addBookToDOM(book, isWishlist = false) {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');
        
        bookDiv.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <p>${book.notes}</p>
            <div class="actions">
                ${!isWishlist ? `
                    <button class="mark-read">${book.read ? 'Прочитано' : 'Відмітити як прочитане'}</button>
                    <button class="add-to-wishlist">Додати в список бажань</button>
                ` : ''}
                <button class="remove">Видалити</button>
            </div>
        `;
        
        bookDiv.querySelector('.remove').addEventListener('click', () => removeBook(book, isWishlist));
        
        if (!isWishlist) {
            bookDiv.querySelector('.mark-read').addEventListener('click', () => toggleRead(book));
            bookDiv.querySelector('.add-to-wishlist').addEventListener('click', () => addToWishlist(book));
        }
        
        if (isWishlist) {
            wishlistContainer.appendChild(bookDiv);
        } else {
            booksContainer.appendChild(bookDiv);
        }
    }
    
    function removeBook(bookToRemove, isWishlist) {
        if (isWishlist) {
            wishlistBooks = wishlistBooks.filter(book => book !== bookToRemove);
            localStorage.setItem('wishlistBooks', JSON.stringify(wishlistBooks));
            wishlistContainer.innerHTML = '';
            wishlistBooks.forEach(book => addBookToDOM(book, true));
        } else {
            books = books.filter(book => book !== bookToRemove);
            localStorage.setItem('books', JSON.stringify(books));
            booksContainer.innerHTML = '';
            books.forEach(book => addBookToDOM(book));
        }
    }
    
    function toggleRead(bookToToggle) {
        books = books.map(book => {
            if (book === bookToToggle) book.read = !book.read;
            return book;
        });
        localStorage.setItem('books', JSON.stringify(books));
        booksContainer.innerHTML = '';
        books.forEach(book => addBookToDOM(book));
    }
    
    function addToWishlist(bookToAdd) {
        wishlistBooks.push(bookToAdd);
        localStorage.setItem('wishlistBooks', JSON.stringify(wishlistBooks));
        wishlistContainer.innerHTML = '';
        wishlistBooks.forEach(book => addBookToDOM(book, true));
    }
    
    books.forEach(book => addBookToDOM(book));
    wishlistBooks.forEach(book => addBookToDOM(book, true));
});
