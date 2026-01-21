// import libs
import path from 'path';

// NOTE: current dir
const __dirname = new URL('.', import.meta.url).pathname;
console.log('__dirname:', __dirname);

// NOTE: load data from CSV files in ./private
const csvDataPaths = [
    {
        path: path.join(__dirname, '../private/nasa9_200-1000K.csv'),
        range: 'nasa9_200_1000_K'
    },
    {
        path: path.join(__dirname, '../private/nasa9_1000-6000K.csv'),
        range: 'nasa9_1000_6000_K'
    },
    {
        path: path.join(__dirname, '../private/nasa9_6000-20000K.csv'),
        range: 'nasa9_6000_20000_K'
    }
];