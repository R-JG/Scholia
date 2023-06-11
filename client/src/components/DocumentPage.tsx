import { useState, useRef, MouseEvent } from 'react';
import { Page } from 'react-pdf';
import { Commentary, SelectedSection } from '../typeUtils/types';
import SelectionBoxContainer from './SelectionBoxContainer';
import '../css/DocumentPage.css';

interface Props {
    pageId: string,
    pageNumber: number,
    pageWidth: number | undefined,
    isInitialPage: boolean,
    selectedCommentary: Commentary | null,
    selectedSection: SelectedSection | null,
    coordinateSelectMode: boolean,
    userIsSelecting: boolean,
    pageForSelection: number | null,
    yPercentCoordinateOne: number | null,
    yPercentCoordinateTwo: number | null,
    editTextMode: boolean,
    handleInitialPageLoadSuccess?: () => void, 
    setEditTextMode: (boolean: boolean) => void, 
    setInitialPageHeight: (height: number) => void,
    setPageForSelection: (pageNumber: number) => void,
    setUserIsSelecting: (isSelecting: boolean) => void,
    setYPercentCoordinateOne: (coordinate: number) => void,
    setYPercentCoordinateTwo: (coordinate: number) => void,
    setSelectedSection: (section: SelectedSection) => void
};

const DocumentPage = ({ 
    pageId, 
    pageNumber, 
    pageWidth,
    isInitialPage, 
    selectedCommentary,
    selectedSection,
    coordinateSelectMode,
    userIsSelecting,
    pageForSelection,
    yPercentCoordinateOne,
    yPercentCoordinateTwo,
    editTextMode, 
    handleInitialPageLoadSuccess, 
    setEditTextMode, 
    setInitialPageHeight,
    setPageForSelection,
    setUserIsSelecting,
    setYPercentCoordinateOne,
    setYPercentCoordinateTwo,
    setSelectedSection
    }: Props) => {

    const [yPixelCoordinateOne, setYPixelCoordinateOne] = useState<number | null>(0);
    const [yPixelCoordinateTwo, setYPixelCoordinateTwo] = useState<number | null>(0);

    const pageRef = useRef<HTMLDivElement>(null);

    const scrollToPage = (): void => pageRef.current?.scrollIntoView();

    const scrollToSelectedSectionBox = (selectedSection: SelectedSection): void => {
        pageRef.current?.querySelector(
            `.selection-box--commentary-section[data-coordinate-top="${
            selectedSection.data.pageCoordinateTop}"]`
        )?.scrollIntoView({ block: 'start' });
    };

    const getPercentCoordinate = (targetPageHeight: number, yPixelCoordinate: number): number => {
        const percentFloat: number = (yPixelCoordinate / targetPageHeight) * 100;
        return (Math.trunc(percentFloat * 100) / 100);
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
        if (pageNumber < pageForSelection) setYPercentCoordinateTwo(0.001);
        const targetPageHeight: number = e.currentTarget.clientHeight;
        const yPixelCoordinate: number = (e.clientY - e.currentTarget.getBoundingClientRect().y);
        const yPercentCoordinate: number = getPercentCoordinate(targetPageHeight, yPixelCoordinate);
        if (pageNumber === pageForSelection) setYPercentCoordinateTwo(yPercentCoordinate);
        setYPixelCoordinateOne(null);
        setYPixelCoordinateTwo(null);
        setUserIsSelecting(false);
    };

    const handlePageMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
        if (!coordinateSelectMode || !userIsSelecting || (pageNumber !== pageForSelection)) return;
        const yPixelCoordinate: number = (e.clientY - e.currentTarget.getBoundingClientRect().y);
        setYPixelCoordinateTwo(yPixelCoordinate);
    };

    return (
        <div 
            id={pageId}
            className='DocumentPage'
            data-page-number={pageNumber}
            onMouseDown={handlePageMouseDown}
            onMouseUp={handlePageMouseUp}
            onMouseMove={handlePageMouseMove}
            ref={pageRef}
        >
            <SelectionBoxContainer 
                pageNumber={pageNumber}
                selectedCommentary={selectedCommentary}
                selectedSection={selectedSection}
                coordinateSelectMode={coordinateSelectMode}
                pageForSelection={pageForSelection}
                userIsSelecting={userIsSelecting}
                yPercentCoordinateOne={yPercentCoordinateOne}
                yPercentCoordinateTwo={yPercentCoordinateTwo}
                yPixelCoordinateOne={yPixelCoordinateOne}
                yPixelCoordinateTwo={yPixelCoordinateTwo}
                editTextMode={editTextMode}
                setEditTextMode={setEditTextMode}
                setSelectedSection={setSelectedSection}
            />
            <Page 
                pageNumber={pageNumber} 
                renderAnnotationLayer={false}
                renderTextLayer={!coordinateSelectMode}
                width={pageWidth}
                onLoadSuccess={isInitialPage ? (page) => {
                    setInitialPageHeight(page.height);
                    handleInitialPageLoadSuccess && handleInitialPageLoadSuccess();
                } : undefined}
                onRenderSuccess={isInitialPage ? () => {
                    if (selectedSection 
                    && (selectedSection.data.pageNumber === pageNumber)) {
                        scrollToSelectedSectionBox(selectedSection);
                    } else scrollToPage();
                } : undefined}
            />
        </div>
    );
};

export default DocumentPage;