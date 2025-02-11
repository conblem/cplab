/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos",
                port: "",
                search: "",
            },
            {
                protocol: "https",
                hostname: "cplabr2.conblem.me",
                port: "",
                search: "",
            },
        ],
    },
};

export default nextConfig;
