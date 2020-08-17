cp -r ./build/** /var/www/cms/
sed  -i  's+http://bridgecms-das.herokuapp.com+https://wallet.smartcon.expert/+g' /var/www/cms/static/js/**
sed  -i  's+http://bridgecms-das.herokuapp.com+https://wallet.smartcon.expert/+g' /var/www/cms/index.html 
sed  -i  's+http://149.28.148.145:4444+https://wallet.smartcon.expert+g' /var/www/cms/static/js/**