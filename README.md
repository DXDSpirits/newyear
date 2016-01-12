wedfairy
======
###PrePare
npm install nodemon

####For Linux
sudo apt-get install redis-server npm
sudo ln -sf /usr/bin/nodejs /usr/bin/node
#### Optional
echo 'use taobao source'
sudo npm install -g cnpm --registry=http://registry.npm.taobao.org
echo 'install bower'
sudo cnpm install bower -g
sudo cnpm install grunt-cli -g

###INSTALL
npm install

###RUN
sudo service redis-server restart
npm start

###RESULT
check url [127.0.0.1:4000](http://127.0.0.1:4000)
