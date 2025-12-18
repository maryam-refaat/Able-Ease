import React, { useState } from 'react';


const SVG_AVATAR_DATAURL =
"data:image/svg+xml;utf8," +
encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'>
<rect width='100' height='100' rx='12' fill='%23e6f4ea'/>
<circle cx='50' cy='36' r='18' fill='%2385c997'/>
<rect x='20' y='62' width='60' height='20' rx='6' fill='%2385c997'/>
</svg>
`);


export default function ImgPlaceholder({ src, alt }) {
const [failed, setFailed] = useState(false);
if (!src || failed) return <img src={SVG_AVATAR_DATAURL} alt={alt || 'img'} className="img-placeholder" />;
return <img src={src} alt={alt || 'img'} className="img-placeholder" onError={() => setFailed(true)} />;
}