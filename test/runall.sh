#!/bin/bash
# usage: runall.sh outdir test1 test2 ... — two at a time
out=$1; shift; mkdir -p $out
run() { timeout 590 node real.js ../index.html $1.js > $out/$1.txt 2>&1; }
while [ $# -gt 0 ]; do run $1 & if [ $# -gt 1 ]; then run $2 & shift; fi; shift; wait; done
echo done > $out/ALLDONE
