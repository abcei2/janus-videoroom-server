from utils_requests import *

token = "00000"
admin_secret = "janusoverlord"

print("\n","ADDING NEW TOKEN",add_token(admin_secret,token))
print("\n","LISTING TOKENS",list_tokens(admin_secret))

session_response = start_session(token)
session_id = session_response["data"]["id"]
print("\n","STARTING SESSION WITH TOKEN",session_response)

plugin_response = attach_to_plugin(session_id,token)
handler_id = plugin_response["data"]["id"]
print("\n","ATTACH SESSION TO VIDEROOM PLUGIN",plugin_response)
print("\n","LIST PUBLIC ROOMS",list_rooms(session_id,handler_id,token))


print("\n",f"REMOVE TOKEN {token}",remove_token(admin_secret,token))
print("\n","LISTING TOKENS AGAIN",list_tokens(admin_secret))




