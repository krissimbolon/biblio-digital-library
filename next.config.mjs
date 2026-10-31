/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers(){
    return [{
      source:"/:path*",
      headers:[
        {key:"X-Content-Type-Options",value:"nosniff"},
        {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
        {key:"X-Frame-Options",value:"DENY"},
        {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=()"},
        {key:"Strict-Transport-Security",value:"max-age=31536000; includeSubDomains"},
      ],
    },{
      source:"/api/:path*",
      headers:[{key:"Content-Security-Policy",value:"default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"}],
    },{
      source:"/admin/:path*",
      headers:[{key:"X-Robots-Tag",value:"noindex, nofollow, noarchive"}],
    }];
  },
};
export default nextConfig;
