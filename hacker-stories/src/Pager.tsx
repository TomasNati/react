interface PagerProps {
    currentPage: number,
    totalPages: number,
    clasico?: {
        pagerSize: number,
        onPageChange: (newPage: number) => void,
    },
    moreManual?: {
        onGetMoreResultsClicked: () => void;
    }
}
export const Pager = ({ currentPage, totalPages, clasico, moreManual }: PagerProps) => {

    const {
        pagerSize = 5,
        onPageChange = () => { }
    } = clasico || {};

    const getDefaultPagesLeftAndRight = (pagerSize: number) => {
        const floor = Math.floor(pagerSize / 2);
        const ceil = Math.ceil(pagerSize / 2);
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

    const classicPageNumber = currentPage + 1;
    const pageNumbers = getPagesNumbers(classicPageNumber);
    const showGetMoreResultsButton = currentPage < totalPages + 1

    return (
        <>
            {moreManual && showGetMoreResultsButton ? (
                <button className='button' onClick={moreManual.onGetMoreResultsClicked}>Get more results</button>
            ) : null}
            {clasico ? (
                <div className="pager">
                    <button className="button button_small" onClick={() => onPageChange(1)}>First</button>
                    <button className="button button_small" onClick={() => onPageChange(classicPageNumber - 1)} disabled={classicPageNumber === 1}>
                        Previous
                    </button>
                    {
                        pageNumbers.map(page => (
                            <button
                                className={`button button_small ${currentPage + 1 === page ? 'button-selected' : ''}`}
                                onClick={() => onPageChange(page)}
                                key={page}>
                                {page}
                            </button>)
                        )
                    }
                    <button className="button button_small" onClick={() => onPageChange(classicPageNumber + 1)} disabled={classicPageNumber === totalPages}>
                        Next
                    </button>
                    <button className="button button_small" onClick={() => onPageChange(totalPages)}>Last</button>
                </div>) : null
            }
        </>

    );
}
