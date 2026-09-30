#!/bin/bash
# usage: runall.sh outdir test1 test2 ... — two at a time.
# A script that uses the shot helpers without defining them gets them put in front, as s3run.sh / lhrun.sh would:
#   view( / around( / TRY( → s3_shot.inc + lh_common.inc (at 1000×625, SEED 4 unless set);  step( / shot( undefined → s3_shot.inc
out=$1; shift; mkdir -p $out
run() { local f=$1.js size=""
  if grep -qE "\b(view|around|aroundClear|TRY)\(" $f && ! grep -qE "(const|let) (view|TRY)\b" $f; then cat s3_shot.inc lh_common.inc $f > $out/$1.full.js; f=$out/$1.full.js; size="1000 625"; export SEED=${SEED:-4}
  elif grep -qE "\b(step|shot)\(" $f && ! grep -qE "(const|let|var) (step|shot)\b|\bstep = " $f; then cat s3_shot.inc $f > $out/$1.full.js; f=$out/$1.full.js; fi
  timeout 590 node real.js ../index.html $f $size > $out/$1.txt 2>&1; }
while [ $# -gt 0 ]; do run $1 & if [ $# -gt 1 ]; then run $2 & shift; fi; shift; wait; done
echo done > $out/ALLDONE
