#!/usr/bin/python3
import os
import subprocess
os.chdir("/opt/GestionaleMagazzino")
git_process = subprocess.Popen(["git", "fetch", "--dry-run"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
git_fetch_result = git_process.communicate()
if git_fetch_result != (b'', b''):
    subprocess.check_output("git pull", shell=True)
    subprocess.check_output("pm2 restart app", shell=True)