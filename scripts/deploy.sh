#!/usr/bin/env bash

parcel build ./src/index.html --public-url ./
cp -R ./dist/* /Users/renatocardoso/renatex/repos/lifeslot.github.io/
rm -rf ./dist/
rm -rf ./.cache/
cd /Users/renatocardoso/renatex/repos/lifeslot.github.io/
git pull
git add .
git commit -m "new automated update"
git push
