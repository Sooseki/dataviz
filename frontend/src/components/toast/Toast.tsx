interface InputProps {
    type: "success" | "error" | "warning",
    content: string,
}

const Toast = ({ type, content }: InputProps) => {
    return (
        <div className={`toast toast-${type}`}>{content}</div>
    )
}