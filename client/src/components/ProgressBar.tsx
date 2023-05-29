import '../css/ProgressBar.css';

interface Props {
    className?: string, 
    message: string, 
    progressPercent: number
};

const ProgressBar = ({ className, message, progressPercent }: Props) => {
    return (
        <div className={`ProgressBar ${className}`}>
            <span className='ProgressBar--message'>{message}</span>
            <div className='ProgressBar--bar-container'>
                <div 
                    className='ProgressBar--bar-amount'
                    style={{ width: `${progressPercent}%` }}>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;