interface PagerProps {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}
export const Pager = ({ currentPage, itemsPerPage, totalPages, onPageChange }: PagerProps) => {
    const firstPage = currentPage - 2 < 1 ? 1 : currentPage - 2;
    const nextPage = currentPage + 2 > totalPages ? totalPages : currentPage + 2

    /*

        
    const showPages = (currentPage: number, totalPages: number) => {
        const firstPage = currentPage - 2 < 1 ? 1 : currentPage - 2;
        const lastPage = currentPage + 2 > totalPages ? totalPages : currentPage + 2;

        let pagesString = ``
        let page = firstPage;
        for (let i: number = 1; i <= 5; i++) {
            if (i > lastPage) break;
            pagesString += ` ${page} -`;
            page++;
        }
        console.log(pagesString)
    }

    showPages(1, 8)
   

    */

    return (
        <div>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </button>
            <span>
                Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
}
