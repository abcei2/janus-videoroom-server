# Util functions janus
By default Janus serves a http API interface that can be use to comunicate to janus plugins and features.   
The http api can be configured accesing the file: **/opt/janus/etc/janus/janus.transport.http.jcfg** 
inside file are some kind of dictionary named "general" with some parameters like http port, or http base path, some other useful features.  
```bash
general = {
	...
	base_path = "/janus",
	http = true,					# Is true by defaul, telling to allow this http API interface.
	port = 8088
	...
}
```
In the same file can be found the admin http API interface that isn't allowed by default for security reasons.  
To allow this API in the same file we must find the "admin" dict and change ``` http = false # --> for true ```

```bash
admin = {
	admin_base_path = "/admin",
	admin_http = true,					# Is false by default for security reasons here we allow it changing to true.
	admin_port = 7088
	...
}
```

Doing that we can restart janus server. The admin API are useful to administrate sessions, access tokens, logs, etc.  
We are interesting mainly in use the token authentication. There are three ways of token authentication, in this repo i explain just two:    
Stored token based authentication mechanism, and Shared static secret.  

## Stored token based authentication mechanism  
After allowing admin API, go to main jauns config file **janus.jcfg** and uncoment;  
```bash  
token_auth = true # Telling to enable the token_auth api,  and to tell your admin_secret that is an admin password   
```
very important to do request to the admin API.
```bash  
admin_secret = "janusoverlord"  # change janusoverlord to your own secret.  
```
in general dict:  

```bash
general = {
	...
	token_auth = true,
	...
	admin_secret = "janusoverlord",
	...
}
```

Restart janu server to get the changes to work.
### Janus admin  


## Janu videoroom plugin
