const fs = require('fs');
const zlib = require('zlib');

/** Create an optionally gzipped stream,
 * where the write operations are performed in order executed,
 * and don't require synchronization, only the 'close' operation
 * requires syncing.
 */
const WriteStream = (dir,name,options={}) => {
    const isGzip = name.indexOf('.gz')!=-1 || options.gzip;
    if( options.gzip && name.indexOf('.gz')==-1 ) {
        name = name + '.gz';
    }
    if( options.mkdir ) fs.mkdirSync(dir, { recursive: true })
    
    const rawStream = fs.createWriteStream(dir + '/' + name);
    const closePromise = new Promise((resolve, reject) => {
        rawStream.on('close', () => {
            resolve('closed');
        });
    });

    let writeStream = rawStream;
    if (isGzip) {
        writeStream = zlib.createGzip();
        writeStream.pipe(rawStream);
        writeStream.on('close', () => {
            console.log('close gzip, closing raw');
            rawStream.close();
        });
    }

    const close = async function() {
        await this.writeStream.end();
        await this.closePromise;
    }

    return {
        writeStream,
        closePromise,

        write: function(data) {
            return this.writeStream.write(data); 
        },

        close,
    };   
}

module.exports = WriteStream;