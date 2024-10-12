 export const applyFilters = (books, filters) => {
    try {
      let filteredBooks = books.filter((book) => book.Visibility !== '0');
  
      if (filters.selectedSection && filters.selectedSection !== 'Show all') {
        filteredBooks = filteredBooks.filter((book) => book.section === filters.selectedSection);
        if (filters.selectedSubsection) {
          filteredBooks = filteredBooks.filter((book) => book.partition === filters.selectedSubsection);
        }
      }
  
      if (filters.rangePrice && filters.rangePrice.length>0 ) {  
        filteredBooks = filteredBooks.filter( book => book.price >= filters.rangePrice[0] && book.price <= filters.rangePrice[1]);
      }

      if (filters.input) {
        filteredBooks = filteredBooks.filter(
          (book) =>
            book.title.toLowerCase().includes(filters.input.toLowerCase()) ||
            book.id.toString().toLowerCase().includes(filters.input.toLowerCase()) ||
            book.author.toString().toLowerCase().includes(filters.input.toLowerCase())
        );
      }
  
      if (filters.selectedTags1.length > 0) {
        filteredBooks = filteredBooks.filter((book) => filters.selectedTags1.includes(book.tags1));
      }
  
      if (filters.selectedTags2.length > 0) {
        filteredBooks = filteredBooks.filter((book) => filters.selectedTags2.includes(book.tags2));
      }
  
      if (filters.selectedTags3.length > 0) {
        filteredBooks = filteredBooks.filter((book) => filters.selectedTags3.includes(book.tags3));
      }
  
      if (filters.selectedTags4.length > 0) {
        filteredBooks = filteredBooks.filter((book) => filters.selectedTags4.includes(book.tags4));
      }
  
      if (filters.selectedSizes.length > 0) {
        filteredBooks = filteredBooks.filter((book) => filters.selectedSizes.includes(book.size));
      }
  
      if (filters.selectedColor.length > 0) {
        filteredBooks = filteredBooks.filter((book) => filters.selectedColor.includes(book.color));
      }
  
      if (filters.selectedAuthors.length > 0) {
        filteredBooks = filteredBooks.filter((book) => filters.selectedAuthors.includes(book.author));
      }
  
      return filteredBooks;
    } catch (error) {
      console.error("Error applying filters:", error);
      return [];
    }
  };
  