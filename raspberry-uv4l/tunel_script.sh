local_port=$1
remote_tunel_port=$2
ssh_server_port=$3
user_server=$5
server_ip=$4
while true
do
    ssh -N -o "ServerAliveInterval 20" -o ExitOnForwardFailure=yes -R $remote_tunel_port:localhost:$local_port    $user_server@$server_ip -p $ssh_server_port
    sleep 2
        echo "Press [CTRL+C] to stop.."
done