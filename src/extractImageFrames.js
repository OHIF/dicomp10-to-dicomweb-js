const getNumberOfFrames = require('./getNumberOfFrames')
const getUncompressedImageFrame = require('./getUncompressedImageFrame')
const getEncapsulatedImageFrame = require('./getEncapsulatedImageFrame')
const {isVideo} = require('./video')

const areFramesAreFragmented = (attr, numberOfFrames) => {
    return attr.encapsulatedPixelData && numberOfFrames != attr.fragments.length
}


const getFrameSize = (dataSet) => {
    const rows = dataSet.uint16('x00280010')
    const columns = dataSet.uint16('x00280011')
    const samplesPerPixel = dataSet.uint16('x00280002')
    const bitsAllocated = dataSet.uint16('x00280100')
    return rows * columns * samplesPerPixel * bitsAllocated / 8
}

const extractImageFrames = async (dataSet, attr, vr, callback, options) => {
    const numberOfFrames = getNumberOfFrames(dataSet)
    const framesAreFragmented = areFramesAreFragmented(attr, numberOfFrames)
    const uncompressedFrameSize = getFrameSize(dataSet)

    const videoType = isVideo(dataSet);
    if( videoType ) {
        return await callback.pixeldata(dataSet);
    }
    
    let BulkDataURI;

    for(let frameIndex = 0; frameIndex < numberOfFrames; frameIndex++) {
        if(attr.encapsulatedPixelData) {
            const compressedFrame = getEncapsulatedImageFrame(dataSet, attr, frameIndex, framesAreFragmented)
            BulkDataURI = await callback.imageFrame(compressedFrame, {dataSet})
        } else {
            const uncompressedFrame = getUncompressedImageFrame(dataSet, attr, frameIndex, uncompressedFrameSize)
            BulkDataURI = await callback.imageFrame(uncompressedFrame, {dataSet})
        }
    }
    return BulkDataURI
}

module.exports = extractImageFrames