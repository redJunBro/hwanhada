/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["ldb-phinf.pstatic.net", "search.pstatic.net"],
  },
  compiler: {
    styledComponents: true, // styled-components 최적화 활성화
  },
};

export default nextConfig;
