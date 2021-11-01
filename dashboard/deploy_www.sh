cp -r ./build/** /var/www/html/
sed  -i  's+http://tdaocms-das.herokuapp.com+https://157.230.115.234/+g' /var/www/html/static/js/**
sed  -i  's+http://tdaocms-das.herokuapp.com+https://157.230.115.234/+g' /var/www/html/index.html 
sed  -i  's+http://149.28.148.145:4444+https://157.230.115.234+g' /var/www/html/static/js/**
