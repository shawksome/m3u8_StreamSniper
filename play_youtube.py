import sys
import subprocess

url = sys.argv[1]
subprocess.run(['vlc', url])
