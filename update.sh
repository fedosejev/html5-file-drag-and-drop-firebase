#!/bin/bash

git checkout master
git add .
git commit -m "Update"
git checkout gh-pages
git merge master
git push origin master
git push origin gh-pages
echo 'All done!'
