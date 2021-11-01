heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git --app tdaocms-das
heroku config:set HEROKU_API_KEY=466f6ea8-43a0-493a-b9b6-ad88047575e2 --app tdaocms-das
npm run build
git add .
git commit -m "[Build] To heroku"
git push heroku qa:master -f
heroku open
