# this shell script builds the react project and places build in a dist folder
# use this when you make updates to the react code and want to see changes on the node.js server
admin_app="../admin"

cd ${admin_app}
npm run build