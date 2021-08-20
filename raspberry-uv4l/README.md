# Setting up UV4L  
## Add uv4l repo key to apt
```bash
curl https://www.linux-projects.org/listing/uv4l_repo/lpkey.asc | sudo apt-key add -  
sudo nano /etc/apt/sources.list
```
## And add next line to file:
```bash
deb https://www.linux-projects.org/listing/uv4l_repo/raspbian/stretch stretch main  
```
## Then update the packages and install dependencies
```bash
sudo apt-get update  
sudo apt-get install uv4l uv4l-raspicam  
sudo apt-get install uv4l-raspicam-extras uv4l-server uv4l-mjpegstream uv4l-demos uv4l-xmpp-bridge  
```
## For pi 2 or 3  
```bash
sudo apt-get install uv4l-webrtc  
```
## For pizero
```bash
sudo apt-get install uv4l-webrtc-armv6  
```
## Open uv4l-raspicam.conf and set this lanes, or just replace with file in this repository
```bash
nano /etc/uv4l/uv4l-raspicam.conf
```
```
frame-buffers = 0  
drop-bad-frames = yes  
...  
encoding = h264  
width = 320  
height = 240  
framerate = 10  
...  
bitrate = 800000  
...  
quantisation-parameter = 10  
```
when done restart uv4l_raspicam service  
## Manage uv4l_raspicam service with systemctl
```bash
sudo service uv4l_raspicam restart/status/stop/start 
``` 
## Now you can access to UV4L main application from client using the browser
```
http://raspberrypi:8080/
```

# Sending stream to server

## Janus way
UV4L has an janus videoroom client application, can be configurable by editing some lines and restarting de uv4l_raspicam service.

Lane 307 - 325 of /etc/uv4l/uv4l-raspicam.conf
```
### Janus WebRTC Gateway options:
server-option = --janus-gateway-url=http://host_ip:janus_http_port  # URL to server and janus http services 
server-option = --janus-gateway-root=/janus # Root of janus services this is by default
server-option = --janus-room=1234 # Room where the raspberry will send stream
...
server-option = --janus-username=pi # Name user to recognize the publisher
...
server-option = --janus-publish=yes # Publish video of UV4L /dev/video0
...
server-option = --janus-reconnect=yes  # To try reconnection if some fail

```
### Start/Stop conectionn
```
curl -s 'http://raspberry:8080/janus?action=Start' > /dev/null  
```
```
curl -s 'http://raspberry:8080/janus?action=Stop' > /dev/null  
```
### Test on janus.conf.meetecho domain
You can test this without configuring a januserver instead using https://janus.conf.meetecho.com domain, and accesing to this  url: https://janus.conf.meetecho.com/videoroomtest.html

### When sudo service uv4l_raspicam status
after joining and publishing media to janus room, appear some error about PCM and ALSA, i suppouse this is mainly because there aren't any audio device availaible.

## Tunel way
### Access to stream from client in the same network.
```
HTTP/MJPEG: http://raspberrypi_ip:8080/stream/video.mjpeg  
HTTP/Raw H264: http://raspberrypi_ip:8080/stream/video.h264    
HTTP/JPEG: http://raspberrypi_ip:8080/stream/video.jpeg  
```
### Access to stream from ikaro
In this version the conection are only from server to raspberry, we willn't have a public ip for each raspberry so thats why i use a SSH TUNNEL, allowing server access to raspberrypi streaming port (eg: 8080) like it where on localhost. Now instead raspberrypi_ip, use localhost try;
```bash
wget http://localhost:8080/stream/video.h264
```
### Add server to ssh known hosts
```bash
ssh-keygen
ssh-copy-id -i ~/.ssh/id_rsa.pub server_username@server_ip_or_domain -p server_ssh_port
```
### Next excecute script by.
```bash
bash tunel_script.sh local_tunel_port remote_tunel_port server_ssh_port server_ip_or_domain server_username
```
### Example link local raspberry port 8080 to rata server port 8080.
```bash
ssh-keygen 
ssh-copy-id -i ~/.ssh/id_rsa.pub root@207.246.118.54
bash tunel_script.sh 8080 8080 22 207.246.118 root
```



