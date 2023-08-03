interface Props {
    content: string,
    onClick: () => void,
    classes?: string,
}

const Button = ({ content, onClick, classes }: Props) => {
    return (
        <button 
            className={classes}
            onClick={onClick}
        >
            {content}
        </button>
    );
};

export default Button;