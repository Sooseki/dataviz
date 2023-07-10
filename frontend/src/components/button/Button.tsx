interface Props {
    content: string,
    onClick: () => void,
    classes?: string,
}

const Button = ({ content, onClick, classes }: Props) => {
    return (
        <button 
            className={`main-button ${classes}`}
            onClick={onClick}
        >
            {content}
        </button>
    );
};

export default Button;