@ECHO OFF
git rev-parse --abbrev-ref HEAD > temp.txt
set /p  branch=<temp.txt 
set "message=%branch% #code-review"
del /f temp.txt
git commit -m "%message%"
git push --set-upstream origin "%branch%"