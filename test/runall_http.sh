#!/bin/bash
# like runall.sh, but against the game served by serve.mjs (http: the playlist, the /api, AudioWorklets): runall_http.sh outdir port t_a t_b …
out=$1; port=$2; shift 2; mkdir -p $out
run() { local f=$1.js; if grep -qE "\b(step|shot)\(" $f && ! grep -qE "(const|let|var) (step|shot)\b|\bstep = " $f; then cat s3_shot.inc $f > $out/$1.full.js; f=$out/$1.full.js; fi
  timeout 590 node real.js http://localhost:$port/index.html $f > $out/$1.txt 2>&1; }
while [ $# -gt 0 ]; do run $1 & if [ $# -gt 1 ]; then run $2 & shift; fi; shift; wait; done
echo done > $out/ALLDONE
