#!/bin/bash
# usage: s3run.sh outdir t_s3_a t_s3_b … — each with s3_shot.inc in front, two at a time
out=$1; shift; mkdir -p $out
run() { cat s3_shot.inc $1.js > $out/$1.full.js; SEED=${SEED:-1} timeout 590 node real.js ../index.html $out/$1.full.js > $out/$1.txt 2>&1; }
while [ $# -gt 0 ]; do run $1 & if [ $# -gt 1 ]; then run $2 & shift; fi; shift; wait; done
echo done > $out/ALLDONE
