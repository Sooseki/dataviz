/** @type {import('next').NextConfig} */

module.exports =  {
    redirects: async () => {
        return [
            {
                source: "/",
                destination: "/dashboard",
                permanent: true,
            },
        ];
    },
};
