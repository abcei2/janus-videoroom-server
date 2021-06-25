# Installing janus server on cloud

## REF: Thanks to meetecho
https://github.com/meetecho/janus-gateway 
https://janus.conf.meetecho.com/index.html 
## aptitude and meson  
apt install meson aptitude  
## using aptitude to install packages  
aptitude install libmicrohttpd-dev libjansson-dev \  
	libssl-dev libsofia-sip-ua-dev libglib2.0-dev \  
	libopus-dev libogg-dev libcurl4-openssl-dev liblua5.3-dev \  
	libconfig-dev pkg-config gengetopt libtool automake     
## Installing libnice  
git clone https://gitlab.freedesktop.org/libnice/libnice  
cd libnice  
meson --prefix=/usr build && ninja -C build && sudo ninja -C  build install  
## Installing libsrtp  
wget https://github.com/cisco/libsrtp/archive/v2.2.0.tar.gz  
tar xfv v2.2.0.tar.gz  
cd libsrtp-2.2.0  
./configure --prefix=/usr --enable-openssl  
make shared_library && sudo make install  
## For datachannels support install usrsctp  
git clone https://github.com/sctplab/usrsctp  
cd usrsctp  
./bootstrap  
./configure --prefix=/usr --disable-programs --disable-inet --disable-inet6  
make && sudo make install  
## Installing libwebsockets
We use websockets instead http server to comunicante with janus, **so is important to install this library.**

git clone https://libwebsockets.org/repo/libwebsockets  
cd libwebsockets  
# If you want the stable version of libwebsockets, uncomment the next line  
# git checkout v3.2-stable  
mkdir build  
cd build  
# See https://github.com/meetecho/janus-gateway/issues/732 re: LWS_MAX_SMP 
# See https://github.com/meetecho/janus-gateway/issues/2476 re: LWS_WITHOUT_EXTENSIONS  
cmake -DLWS_MAX_SMP=1 -DLWS_WITHOUT_EXTENSIONS=0 -DCMAKE_INSTALL_PREFIX:PATH=/usr -DCMAKE_C_FLAGS="-fpic" ..  
make && sudo make install  
## Packages needed for documentation
aptitude install doxygen graphviz  
## Compile
git clone https://github.com/meetecho/janus-gateway.git  
cd janus-gateway  
sh autogen.sh  
./configure --prefix=/opt/janus --enable-docs
make
make install
## Compile Janus Plugin configuration files
make configs
## Excecute janus.
/opt/janus/bin/janus
# Janus main configuration
nano /opt/janus/etc/janus/janus.jcfg
# Janus Videoroom plugin configuration
Here can be defined some default rooms, this rooms also can be created by the user.
nano /opt/janus/etc/janus/janus.plugin.videoroom.jcfg



