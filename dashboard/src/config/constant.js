// export const BASEURL = "https://alphabook-api.herokuapp.com/";

const env = require('get-env')();


export const BASEURL = require(`./${env}.js`).BASEURL;
export const FREELY_ACCESS_PAGES = require(`./${env}.js`).FREELY_ACCESS_PAGES;
export const PROJECT_STATUS = require(`./${env}.js`).PROJECT_STATUS;
export const CLOUDINARY = require(`./${env}.js`).CLOUDINARY;