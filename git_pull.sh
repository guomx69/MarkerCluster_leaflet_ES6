## before run this code first run the following lines: not .bashrc  (.bashrc vs .bash_profile vs .profile)
# echo "export PWDSOLAR=xxxx" >> .profile
localsecret=./git_pwd

echo "start to pull from remote repo"
 
GIT_ASKPASS=$localsecret git pull &&\
printf "\033[0;31m git pull is done locally \033[0m\n\n"