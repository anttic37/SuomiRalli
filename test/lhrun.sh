#!/bin/bash
# run lehti photo scripts at 1000×625: lh_common.inc + s3_shot.inc in front
out=$1; shift; mkdir -p $out
run() { cat s3_shot.inc lh_common.inc $1.js > $out/$1.full.js; SEED=${SEED:-4} timeout 900 node real.js ../index.html $out/$1.full.js 1000 625 > $out/$1.txt 2>&1; }
while [ $# -gt 0 ]; do run $1 & if [ $# -gt 1 ]; then run $2 & shift; fi; shift; wait; done
