import Link from "next/link";

export type CrumbItem = {
    label: string;
    path: string;
};

export type BreadcrumbsProps = {
    items: CrumbItem[];
};

const Breadcrumb = ({ items }: BreadcrumbsProps) => {
    return (
        <div className="breadcrumb">
            {items.map((crumb, i) => {
                const isLastItem = i === items.length - 1;
                if (!isLastItem) {
                    return (
                        <>
                            <Link href={crumb.path} key={i}>
                                {crumb.label}
                            </Link>
                            <span> / </span>
                        </>
                    );
                } else {
                    return crumb.label;
                }
            })}
        </div>
    );
};

export default Breadcrumb;
