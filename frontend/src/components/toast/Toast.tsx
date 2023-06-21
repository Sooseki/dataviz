interface Props {
    type: "success" | "error" | "warning",
    content: string,
}

const Toast = ({ type, content }: Props) => {
    return (
        <div className={`toast toast-${type}`}>{content}</div>
    )
}