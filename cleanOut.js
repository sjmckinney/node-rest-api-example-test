const rimraf = require('rimraf');
const path = require('path');

let dir;

/**
 * Cleans outDir before compiling. Designed to be run as a pre-compile script
 * 
 */
const performClean = () => {
    let appRoot = path.resolve(__dirname);
    dir = path.resolve(appRoot, "out");
    console.info(`Starting clean up of ${dir}`);

    rimraf(dir, cb);
}

/**
 * Callback function for rimraf deletion call
 * 
 * @param {any} err 
 */
const cb = (err) => {
    if (err) {
        console.error("Failed to delete contents")
        console.error(err);
    } else {
        console.info(`${dir} cleaned successfully.`)
    }
}

performClean();