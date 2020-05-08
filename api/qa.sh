sshpass -p "4K-qXHeSVTK6Qcs*" ssh -o StrictHostKeyChecking=no root@149.28.148.145 <<EOF
    cd ./projects/mak90-dashboard-api;
    git pull;
    npm install;
    NODE_ENV=qa forever restart server.js;
EOF
