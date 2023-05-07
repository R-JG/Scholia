import { MouseEvent, useState, useRef } from 'react';
import { Page } from 'react-pdf';
import { Commentary, CommentarySection } from '../typeUtils/types';
import SelectionBoxContainer from './SelectionBoxContainer';
import '../css/DocumentPage.css';

interface Props {
    pageId: string,
    pageNumber: number,
    pageWidth: number | undefined,
    isInitialPage: boolean,
    selectedCommentary: Commentary | null,
    selectedSection: { section: CommentarySection, index: number } | null,
    coordinateSelectMode: boolean,
    userIsSelecting: boolean,
    pageForSelection: number | null,
    yPercentCoordinateOne: number | null,
    yPercentCoordinateTwo: number | null,
    setInitialPageIsLoaded: (isLoaded: boolean) => void,
    setInitialPageHeight: (height: number) => void,
    setPageForSelection: (pageNumber: number) => void,
    setUserIsSelecting: (isSelecting: boolean) => void,
    setYPercentCoordinateOne: (coordinate: number) => void,
    setYPercentCoordinateTwo: (coordinate: number) => void,
    setSelectedSection: (section: { section: CommentarySection, index: number }) => void
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
    setInitialPageIsLoaded,
    setInitialPageHeight,
    setPageForSelection,
    setUserIsSelecting,
    setYPercentCoordinateOne,
    setYPercentCoordinateTwo,
    setSelectedSection
    }: Props) => {

    const [yPixelCoordinateOne, setYPixelCoordinateOne] = useState<number>(0);
    const [yPixelCoordinateTwo, setYPixelCoordinateTwo] = useState<number>(0);

    const pageRef = useRef<HTMLDivElement>(null);

    const scrollToPage = (): void => pageRef.current?.scrollIntoView();

    const getPercentCoordinate = (targetPageHeight: number, yPixelCoordinate: number): number => {
        return (yPixelCoordinate / targetPageHeight) * 100;
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
        setYPixelCoordinateOne(0);
        setYPixelCoordinateTwo(0);
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
                coordinateSelectMode={coordinateSelectMode}
                pageForSelection={pageForSelection}
                userIsSelecting={userIsSelecting}
                yPercentCoordinateOne={yPercentCoordinateOne}
                yPercentCoordinateTwo={yPercentCoordinateTwo}
                yPixelCoordinateOne={yPixelCoordinateOne}
                yPixelCoordinateTwo={yPixelCoordinateTwo}
                setSelectedSection={setSelectedSection}
            />
            <Page 
                pageNumber={pageNumber} 
                renderAnnotationLayer={false}
                renderTextLayer={!coordinateSelectMode}
                width={pageWidth}
                onLoadSuccess={isInitialPage ? (page) => {
                    setInitialPageHeight(page.height);
                    setInitialPageIsLoaded(true);
                } : undefined }
                onRenderSuccess={isInitialPage ? () => {
                    scrollToPage();
                    if (selectedSection 
                    && (selectedSection.section.coordinates.pageNumber === pageNumber)) {
                        pageRef.current?.children[0].querySelector(
                            `[data-coordinate-top="${selectedSection.section.coordinates.yTop}"]`
                        )?.scrollIntoView({ block: 'start' });
                    };
                } : undefined}
            />
        </div>
    );
};

export default DocumentPage;