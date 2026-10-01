#!/bin/bash
# usage: cmp_builds.sh outdir test1 test2 … — the same tests on the last commit's build (git HEAD:index.html) and on ../index.html, twice
# each (several tests vary run to run: compare the spread, not one run). Results in outdir/{old1,old2,new1,new2}/<test>.txt
out=$1; shift; mkdir -p $out; git -C .. show HEAD:index.html > ../zz_cmp_old.html
for r in 1 2; do INDEX=../zz_cmp_old.html SEED=1 ./runall.sh $out/old$r "$@" > /dev/null 2>&1; SEED=1 ./runall.sh $out/new$r "$@" > /dev/null 2>&1; done
rm -f ../zz_cmp_old.html
for t in "$@"; do h() { grep -h '"result"\|HARNESS' $out/$1/$t.txt 2>/dev/null | head -1 | md5sum | cut -c1-6; }; echo "$t old:$(h old1),$(h old2) new:$(h new1),$(h new2)"; done
echo CMPDONE
