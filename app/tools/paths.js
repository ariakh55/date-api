import { URL } from 'url'
import os from 'os';

const paths = {
    __dirname: new URL('..', import.meta.url).pathname,
    __filename: new URL('', import.meta.url).pathname
}

if(os.type() == 'Windows_NT'){
    paths.__dirname = paths.__dirname.substring(1)
    paths.__filename = paths.__filename.substring(1)
}

export default paths;