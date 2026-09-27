// the route for the server's cut check (build.py runs this and writes netlify/lib/tracks.mjs): signature, points, road widths
return { sig: trackSignature(), x: trackPoints.map(p => Math.round(p.x*100)/100), z: trackPoints.map(p => Math.round(p.y*100)/100), w: trackPoints.map((p, i) => Math.round(wAt(i)*100)/100) };
