import { useState, MouseEvent } from 'react';
import { Page } from 'react-pdf';
import '../css/DocumentPage.css';

interface Props {
    pageId: string,
    pageNumber: number,
    pageWidth: number | undefined,
    isInitialPage: boolean,
    coordinateSelectMode: boolean,
    userIsSelecting: boolean,
    pageForSelection: number | null,
    yPercentCoordinateOne: number | null,
    yPercentCoordinateTwo: number | null,
    setInitialPageIsLoaded: (isLoaded: boolean) => void,
    setInitialPageHeight: (height: number) => void,
    setPageForSelection: (pageNumber: number) => void,
    setUserIsSelecting: (isSelecting: boolean) => void,
    setYPercentCoordinateOne: (coordinate: number) => void
    setYPercentCoordinateTwo: (coordinate: number) => void
};

const DocumentPage = ({ 
    pageId, 
    pageNumber, 
    pageWidth,
    isInitialPage, 
    coordinateSelectMode,
    userIsSelecting,
    pageForSelection,
    setInitialPageIsLoaded,
    setInitialPageHeight,
    setPageForSelection,
    setUserIsSelecting,
    setYPercentCoordinateOne,
    setYPercentCoordinateTwo
    }: Props) => {

    const [yPixelCoordinateOne, setYPixelCoordinateOne] = useState<number>(0);
    const [yPixelCoordinateTwo, setYPixelCoordinateTwo] = useState<number>(0);

    const getEventYPercentCoordinate = (e: MouseEvent<HTMLDivElement>): number => {
        const targetPageHeight = e.currentTarget.clientHeight;
        const yPixelCoordinate: number = (e.clientY - e.currentTarget.getBoundingClientRect().y);
        const yPercentCoordinate: number = Math.floor((yPixelCoordinate / targetPageHeight) * 100);
        return yPercentCoordinate;
    };

    const handlePageMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
        if (!coordinateSelectMode) return;
        const yPercentCoordinate: number = getEventYPercentCoordinate(e);
        setYPercentCoordinateOne(yPercentCoordinate);
        setYPixelCoordinateOne(e.clientY);
        setUserIsSelecting(true);
        setPageForSelection(pageNumber);
    };

    const handlePageMouseUp = (e: MouseEvent<HTMLDivElement>): void => {
        if (!coordinateSelectMode || !userIsSelecting || !pageForSelection) return;
        const yPercentCoordinate: number = getEventYPercentCoordinate(e);
        if (pageNumber === pageForSelection) setYPercentCoordinateTwo(yPercentCoordinate);
        if (pageNumber > pageForSelection) setYPercentCoordinateTwo(100);
        if (pageNumber < pageForSelection) setYPercentCoordinateTwo(0);
        setYPixelCoordinateOne(0);
        setYPixelCoordinateTwo(0);
        setUserIsSelecting(false);
    };

    const handlePageMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
        if (!coordinateSelectMode || !userIsSelecting || (pageNumber !== pageForSelection)) return;
        setYPixelCoordinateTwo(e.clientY);
    };

    const selectionBoxStyle = (yPixelCoordinateTwo === 0) ? { display: 'none' } : { 
        top: `${Math.min(yPixelCoordinateOne, yPixelCoordinateTwo)}px`,
        height: `${Math.abs(yPixelCoordinateOne - yPixelCoordinateTwo)}px`,
    };
    
    return (
        <div 
            id={pageId}
            className='DocumentPage'
            data-page-number={pageNumber}
            onMouseDown={handlePageMouseDown}
            onMouseUp={handlePageMouseUp}
            onMouseMove={handlePageMouseMove}
        >
            {userIsSelecting && (pageForSelection === pageNumber) && 
            <div 
                className='selection-box' 
                style={selectionBoxStyle}>
            </div>}
            <Page 
                pageNumber={pageNumber} 
                renderAnnotationLayer={false}
                renderTextLayer={!coordinateSelectMode}
                width={pageWidth}
                onLoadSuccess={isInitialPage ? (page) => {
                    setInitialPageHeight(page.height);
                    setInitialPageIsLoaded(true);
                } : undefined}
            />
        </div>
    );
};

export default DocumentPage;