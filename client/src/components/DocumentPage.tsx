import { MouseEvent, useState } from 'react';
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
    yPercentCoordinateOne,
    yPercentCoordinateTwo,
    setInitialPageIsLoaded,
    setInitialPageHeight,
    setPageForSelection,
    setUserIsSelecting,
    setYPercentCoordinateOne,
    setYPercentCoordinateTwo
    }: Props) => {

    const [yPixelCoordinateOne, setYPixelCoordinateOne] = useState<number>(0);
    const [yPixelCoordinateTwo, setYPixelCoordinateTwo] = useState<number>(0);

    const getPercentCoordinate = (targetPageHeight: number, yPixelCoordinate: number): number => {
        return Math.floor((yPixelCoordinate / targetPageHeight) * 100);
    };

    const handlePageMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
        if (!coordinateSelectMode) return;
        const targetPageHeight: number = e.currentTarget.clientHeight;
        const yPixelCoordinate: number = (e.clientY - e.currentTarget.getBoundingClientRect().y);
        const yPercentCoordinate: number = getPercentCoordinate(targetPageHeight, yPixelCoordinate);
        setYPercentCoordinateOne(yPercentCoordinate);
        setYPixelCoordinateOne(yPixelCoordinate);
        setUserIsSelecting(true);
        setPageForSelection(pageNumber);
    };

    const handlePageMouseUp = (e: MouseEvent<HTMLDivElement>): void => {
        if (!coordinateSelectMode || !userIsSelecting || !pageForSelection) return;
        if (pageNumber > pageForSelection) setYPercentCoordinateTwo(100);
        if (pageNumber < pageForSelection) setYPercentCoordinateTwo(1);
        const targetPageHeight: number = e.currentTarget.clientHeight;
        const yPixelCoordinate: number = (e.clientY - e.currentTarget.getBoundingClientRect().y);
        const yPercentCoordinate: number = getPercentCoordinate(targetPageHeight, yPixelCoordinate);
        if (pageNumber === pageForSelection) setYPercentCoordinateTwo(yPercentCoordinate);
        setYPixelCoordinateOne(0);
        setYPixelCoordinateTwo(0);
        setUserIsSelecting(false);
    };

    const handlePageMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
        if (!coordinateSelectMode || !userIsSelecting || (pageNumber !== pageForSelection)) return;
        const yPixelCoordinate: number = (e.clientY - e.currentTarget.getBoundingClientRect().y);
        setYPixelCoordinateTwo(yPixelCoordinate);
    };

    const createSelectionBoxStyle = () => {
        if (userIsSelecting) {
            return (yPixelCoordinateTwo === 0) ? { display: 'none' } : { 
                top: `${Math.min(yPixelCoordinateOne, yPixelCoordinateTwo)}px`,
                height: `${Math.abs(yPixelCoordinateOne - yPixelCoordinateTwo)}px`,
            };
        } else if (yPercentCoordinateOne && yPercentCoordinateTwo) {
            return {
                top: `${Math.min(yPercentCoordinateOne, yPercentCoordinateTwo)}%`,
                height: `${Math.abs(yPercentCoordinateOne - yPercentCoordinateTwo)}%`,
            };
        } else return;
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
            {(pageForSelection === pageNumber) && 
            <div 
                className='selection-box' 
                style={createSelectionBoxStyle()}>
            </div>}
            <Page 
                pageNumber={pageNumber} 
                renderAnnotationLayer={false}
                renderTextLayer={!coordinateSelectMode}
                width={pageWidth}
                onLoadSuccess={isInitialPage ? (page) => {
                    setInitialPageHeight(page.height);
                    setInitialPageIsLoaded(true);
                } : undefined }
            />
        </div>
    );
};

export default DocumentPage;