interface PagerProps {
    clasico?: {
        currentPage: number,
        pagerSize: number,
        totalPages: number,
        onPageChange: (newPage: number) => void,
    },
    moreManual?: {
        onGetMoreResultsClicked: () => void;
    }
}
export const Pager = ({ clasico, moreManual }: PagerProps) => {

    const {
        pagerSize = 5,
        totalPages = 1,
        currentPage = 1,
        onPageChange = () => {}
    } = clasico || {};

    const getDefaultPagesLeftAndRight = (pagerSize: number) => {
        const floor = Math.floor(pagerSize/2);
        const ceil = Math.ceil(pagerSize/2);
        return [floor, ceil - 1] 
    }

    const getPagesNumbers = (currentPage: number): number[] => {
        if (!clasico) return []
        

        const [pagesLeft, pagesRight] = getDefaultPagesLeftAndRight(pagerSize)
        const pagesToAddRight = currentPage - pagesLeft - 1 < 0 ? (currentPage - pagesLeft - 1) * -1 : 0;
        const pagesToAddLeft = totalPages - currentPage - pagesRight < 0 ? (totalPages - currentPage - pagesRight) * -1 : 0;

        const firstPageLeftIndex = currentPage - pagesLeft - pagesToAddLeft;
        const lastPageRightIndex = currentPage + pagesRight + pagesToAddRight

        const pagesNumber: number[] = []
        let pagesAdded = 0;
        for (let i: number = firstPageLeftIndex; i <= lastPageRightIndex; i++) {
            if (i < 1 || i > totalPages) continue;
            if (pagesAdded == pagerSize) break;
            
            pagesNumber.push(i)
            pagesAdded++
        }
        
        return pagesNumber
    }

    const pageNumbers = getPagesNumbers(clasico?.currentPage || 0);

    return (
        <>
            {moreManual ? (
                <button className='button' onClick={moreManual.onGetMoreResultsClicked}>Get more results</button>
            ): null }
            {clasico ? (
                <div>
                    <button onClick={() => onPageChange(1)}>First</button>
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Previous
                    </button>
                    {
                        pageNumbers.map(page =>  <button onClick={() => onPageChange(page)} key={page}>{page}</button>)
                    }
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                    <button onClick={() => onPageChange(totalPages)}>Last</button>
                </div>): null
            }
        </>
        
    );
}
